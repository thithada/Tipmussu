// Location: src/app/layout.tsx
// Root layout with providers

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DonatePro - แพลตฟอร์มรับโดเนทสำหรับครีเอเตอร์',
  description: 'รับเงินบริจาคแบบมืออาชีพ รองรับ PromptPay, TrueMoney และระบบแจ้งเตือนแบบเรียลไทม์',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}