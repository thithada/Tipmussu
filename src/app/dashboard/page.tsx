// Location: src/app/dashboard/page.tsx
// Main dashboard for authenticated users

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  Heart, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  Settings,
  Bell,
  Calendar,
  CreditCard
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DashboardStats {
  totalDonations: number
  totalDonors: number
  thisMonth: number
  pendingDonations: number
}

interface RecentDonation {
  id: string
  amount: number
  donorName: string
  message: string
  createdAt: string
  paymentStatus: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalDonors: 0,
    thisMonth: 0,
    pendingDonations: 0
  })
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch donations
        const donationsRes = await fetch('/api/donations?limit=5')
        const donationsData = await donationsRes.json()
        
        if (donationsRes.ok) {
          setRecentDonations(donationsData.donations || [])
          
          // Calculate stats from donations
          const total = donationsData.donations?.reduce((sum: number, d: any) => 
            d.paymentStatus === 'confirmed' ? sum + d.amount : sum, 0) || 0
          const uniqueDonors = new Set(donationsData.donations?.map((d: any) => d.donorName)).size
          const pending = donationsData.donations?.filter((d: any) => d.paymentStatus === 'pending').length || 0
          
          setStats({
            totalDonations: total,
            totalDonors: uniqueDonors,
            thisMonth: total, // Simplified - should calculate actual month
            pendingDonations: pending
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const copyDonationLink = async () => {
    if (session?.user?.username) {
      const donationUrl = `${window.location.origin}/donate/${session.user.username}`
      try {
        await navigator.clipboard.writeText(donationUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-pink-500" />
                <span className="text-xl font-bold text-gray-900">DonatePro</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                แจ้งเตือน
              </Button>
              <Link href="/dashboard/settings">
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  ตั้งค่า
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500">@{session.user.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            สวัสดี, {session.user.name}! 👋
          </h2>
          <p className="text-gray-600">ยินดีต้อนรับสู่แดชบอร์ดของคุณ</p>
        </div>

        {/* Quick Action - Donation Link */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">ลิงก์รับโดเนทของคุณ</h3>
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-4 py-2">
                <code className="text-sm">
                  donatepro.com/donate/{session.user.username}
                </code>
                <button
                  onClick={copyDonationLink}
                  className="p-1 hover:bg-black/20 rounded transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copySuccess && (
                <p className="text-sm mt-2 text-green-200">คัดลอกลิงก์แล้ว!</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Link 
                href={`/donate/${session.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="sm" className="text-gray-900">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ดูหน้าโดเนท
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ยอดรวมทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalDonations)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">เดือนนี้: {formatCurrency(stats.thisMonth)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ผู้สนับสนุน</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonors}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">คนที่ให้การสนับสนุน</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingDonations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">รายการยังไม่ยืนยัน</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">อัตราเติบโต</p>
                <p className="text-2xl font-bold text-gray-900">+12%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">เทียบกับเดือนที่แล้ว</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">การบริจาคล่าสุด</h3>
                <Link href="/dashboard/donations">
                  <Button variant="secondary" size="sm">ดูทั้งหมด</Button>
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {recentDonations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">ยังไม่มีการบริจาค</p>
                  <p className="text-sm text-gray-400">แชร์ลิงก์ของคุณเพื่อเริ่มรับโดเนท</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{donation.donorName}</p>
                          <p className="text-sm text-gray-500">
                            {donation.message || 'ไม่มีข้อความ'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(new Date(donation.createdAt))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(donation.amount)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          donation.paymentStatus === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : donation.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.paymentStatus === 'confirmed' ? 'ยืนยันแล้ว' :
                           donation.paymentStatus === 'pending' ? 'รอยืนยัน' : 'ล้มเหลว'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">การดำเนินการด่วน</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <Link href="/dashboard/settings" className="block">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">ตั้งค่าการรับเงิน</h4>
                      <p className="text-sm text-gray-500">เพิ่มบัญชีธนาคารและ PromptPay</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/alerts" className="block">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">ตั้งค่าแจ้งเตือน</h4>
                      <p className="text-sm text-gray-500">เชื่อมต่อกับ OBS และ Streamlabs</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/customize" className="block">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">ปรับแต่งหน้าโดเนท</h4>
                      <p className="text-sm text-gray-500">เปลี่ยนธีม สี และข้อความ</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}