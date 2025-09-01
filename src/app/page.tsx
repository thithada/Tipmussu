// Location: src/app/page.tsx
// Homepage - Landing page

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Heart, Users, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-900">DonatePro</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                ฟีเจอร์
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
                เข้าสู่ระบบ
              </Link>
              <Button variant="primary">
                <Link href="/auth/signup">เริ่มใช้งาน</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            รับโดเนท
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              แบบมืออาชีพ
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            แพลตฟอร์มรับเงินบริจาคที่ทันสมัย รองรับ PromptPay, TrueMoney 
            และระบบแจ้งเตือนแบบเรียลไทม์สำหรับสตรีมเมอร์และครีเอเตอร์
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              <Link href="/auth/signup">เริ่มใช้งานฟรี</Link>
            </Button>
            <Button variant="secondary" size="lg">
              ดูตัวอย่าง
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้องเลือก DonatePro?
            </h2>
            <p className="text-xl text-gray-600">
              ฟีเจอร์ครบครันสำหรับการรับโดเนทอย่างมืออาชีพ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ง่ายต่อการใช้งาน</h3>
              <p className="text-gray-600">ตั้งค่าได้ใน 5 นาที พร้อมใช้งานทันที</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">แจ้งเตือนเรียลไทม์</h3>
              <p className="text-gray-600">เชื่อมต่อกับ OBS และ Streamlabs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ปลอดภัยสูง</h3>
              <p className="text-gray-600">เข้ารหัสข้อมูลและยืนยันตัวตน</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">รองรับหลายช่องทาง</h3>
              <p className="text-gray-600">PromptPay, TrueMoney, LINE Pay</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            พร้อมเริ่มรับโดเนทแล้วหรือยัง?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            เข้าร่วมกับครีเอเตอร์หลายพันคนที่เลือกใช้ DonatePro
          </p>
          <Button variant="primary" size="lg">
            <Link href="/auth/signup">สร้างบัญชีฟรี</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-lg font-bold text-gray-900">DonatePro</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 DonatePro. สร้างด้วย ❤️ ในประเทศไทย
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}