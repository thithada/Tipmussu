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
