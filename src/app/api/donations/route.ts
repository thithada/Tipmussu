// Location: src/app/api/donations/route.ts
// API route for handling donations

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const donationSchema = z.object({
  amount: z.number().min(1, 'จำนวนเงินต้องมากกว่า 0'),
  message: z.string().optional(),
  donorName: z.string().min(1, 'กรุณาใส่ชื่อผู้บริจาค'),
  donorEmail: z.string().email().optional(),
  paymentMethod: z.enum(['promptpay', 'truemoney', 'linepay']),
  userId: z.string(),
})

// GET /api/donations - Get donations for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    
    const where = {
      userId: session.user.id,
      ...(status && { paymentStatus: status })
    }
    
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.donation.count({ where })
    ])
    
    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get donations error:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

// POST /api/donations - Create new donation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = donationSchema.parse(body)
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      )
    }
    
    // Create donation
    const donation = await prisma.donation.create({
      data: {
        amount: validatedData.amount,
        message: validatedData.message || '',
        donorName: validatedData.donorName,
        donorEmail: validatedData.donorEmail,
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: 'pending',
        userId: validatedData.userId,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          }
        }
      }
    })
    
    // TODO: Implement payment processing logic here
    // - Generate QR code for PromptPay
    // - Handle TrueMoney/LINE Pay integration
    // - Send webhook to alert systems
    
    return NextResponse.json({
      message: 'สร้างการบริจาคสำเร็จ',
      donation
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'ข้อมูลไม่ถูกต้อง',
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    console.error('Create donation error:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}