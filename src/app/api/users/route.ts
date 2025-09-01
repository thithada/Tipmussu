// Location: src/app/api/users/route.ts
// API route for getting user by username (public donation page)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  username: string
}

// GET /api/users/[username] - Get public user info for donation page
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { username } = params
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        donationGoal: true,
        // Don't expose sensitive data
        _count: {
          select: {
            donations: {
              where: {
                paymentStatus: 'confirmed'
              }
            }
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { message: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      )
    }
    
    // Calculate total donations
    const totalDonations = await prisma.donation.aggregate({
      where: {
        userId: user.id,
        paymentStatus: 'confirmed'
      },
      _sum: {
        amount: true
      }
    })
    
    return NextResponse.json({
      user: {
        ...user,
        totalDonations: totalDonations._sum.amount || 0,
        totalDonors: user._count.donations
      }
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}