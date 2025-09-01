// Location: src/app/api/auth/signup/route.ts
// API route for user registration

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  username: z.string()
    .min(3, 'Username ต้องมีอย่างน้อย 3 ตัวอักษร')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และ _'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingEmail) {
      return NextResponse.json(
        { message: 'อีเมลนี้มีผู้ใช้งานแล้ว' },
        { status: 400 }
      )
    }
    
    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username }
    })
    
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username นี้มีผู้ใช้งานแล้ว' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword, // Make sure password field exists in schema
      }
    })
    
    // Remove sensitive data from response
    const { password, ...userResponse } = user
    
    return NextResponse.json(
      { 
        message: 'สมัครสมาชิกสำเร็จ',
        user: userResponse 
      },
      { status: 201 }
    )
    
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
    
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}