// Location: src/app/donate/[username]/page.tsx
// Public donation page for each creator

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Heart, 
  DollarSign, 
  Users, 
  MessageCircle,
  Smartphone,
  CreditCard,
  QrCode
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Creator {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
  donationGoal?: number
  totalDonations: number
  totalDonors: number
}

interface DonationForm {
  amount: number
  donorName: string
  donorEmail: string
  message: string
  paymentMethod: 'promptpay' | 'truemoney' | 'linepay'
}

export default function DonatePage() {
  const params = useParams()
  const username = params?.username as string
  
  const [creator, setCreator] = useState<Creator | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)
  
  const [form, setForm] = useState<DonationForm>({
    amount: 0,
    donorName: '',
    donorEmail: '',
    message: '',
    paymentMethod: 'promptpay'
  })

  const [quickAmounts] = useState([50, 100, 200, 500, 1000])

  // Fetch creator data
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        const data = await response.json()
        
        if (!response.ok) {
          setError(data.message || 'ไม่พบผู้ใช้งาน')
          return
        }
        
        setCreator(data.user)
      } catch (error) {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      fetchCreator()
    }
  }, [username])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))
  }

  const handleQuickAmount = (amount: number) => {
    setForm(prev => ({ ...prev, amount }))
  }

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!creator) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          userId: creator.id
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาด')
      }
      
      setDonationSuccess(true)
      setShowDonationForm(false)
      
      // Reset form
      setForm({
        amount: 0,
        donorName: '',
        donorEmail: '',
        message: '',
        paymentMethod: 'promptpay'
      })
      
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบหน้านี้</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button variant="primary">
              <a href="/">กลับสู่หน้าแรก</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (donationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ขอบคุณสำหรับการสนับสนุน! ❤️</h2>
            <p className="text-gray-600 mb-6">การบริจาคของคุณถูกส่งเรียบร้อยแล้ว</p>
            <Button 
              variant="primary" 
              onClick={() => setDonationSuccess(false)}
            >
              บริจาคอีกครั้ง
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = creator.donationGoal 
    ? Math.min((creator.totalDonations / creator.donationGoal) * 100, 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Creator Profile */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {creator.image ? (
                  <img 
                    src={creator.image} 
                    alt={creator.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold">
                    {creator.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{creator.name}</h1>
                <p className="text-white/90 mb-2">@{creator.username}</p>
                {creator.bio && (
                  <p className="text-white/80">{creator.bio}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(creator.totalDonations)}
                </p>
                <p className="text-sm text-gray-600">ยอดรวม</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{creator.totalDonors}</p>
                <p className="text-sm text-gray-600">ผู้สนับสนุน</p>
              </div>

              <div className="text-center md:col-span-1 col-span-2">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {creator.donationGoal ? `${progressPercentage.toFixed(0)}%` : '∞'}
                </p>
                <p className="text-sm text-gray-600">
                  {creator.donationGoal ? 'ความคืบหน้า' : 'เป้าหมาย'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {creator.donationGoal && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>เป้าหมาย: {formatCurrency(creator.donationGoal)}</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Donation Button */}
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowDonationForm(true)}
                className="px-8"
              >
                <Heart className="w-5 h-5 mr-2" />
                สนับสนุน {creator.name}
              </Button>
            </div>
          </div>
        </div>

        {/* Donation Form Modal */}
        {showDonationForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    สนับสนุน {creator.name}
                  </h3>
                  <button
                    onClick={() => setShowDonationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitDonation} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Quick Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      เลือกจำนวนเงิน
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleQuickAmount(amount)}
                          className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                            form.amount === amount
                              ? 'bg-pink-500 text-white border-pink-500'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          ฿{amount}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        min="1"
                        step="1"
                        required
                        className="block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="จำนวนเงิน (บาท)"
                        value={form.amount || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div>
                    <label htmlFor="donorName" className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อของคุณ *
                    </label>
                    <input
                      id="donorName"
                      name="donorName"
                      type="text"
                      required
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      placeholder="ชื่อที่จะแสดงในการบริจาค"
                      value={form.donorName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล (ไม่บังคับ)
                    </label>
                    <input
                      id="donorEmail"
                      name="donorEmail"
                      type="email"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      placeholder="example@email.com"
                      value={form.donorEmail}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      ข้อความ (ไม่บังคับ)
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MessageCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        className="block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="ส่งกำลังใจให้ครีเอเตอร์..."
                        value={form.message}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      วิธีการชำระเงิน
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="promptpay"
                          checked={form.paymentMethod === 'promptpay'}
                          onChange={handleInputChange}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-3 flex items-center">
                          <QrCode className="w-5 h-5 text-blue-600 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">PromptPay</p>
                            <p className="text-sm text-gray-600">สแกน QR Code</p>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="truemoney"
                          checked={form.paymentMethod === 'truemoney'}
                          onChange={handleInputChange}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-3 flex items-center">
                          <Smartphone className="w-5 h-5 text-orange-600 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">TrueMoney Wallet</p>
                            <p className="text-sm text-gray-600">ค่าธรรมเนียม 10%</p>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="linepay"
                          checked={form.paymentMethod === 'linepay'}
                          onChange={handleInputChange}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-3 flex items-center">
                          <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">LINE Pay</p>
                            <p className="text-sm text-gray-600">ค่าธรรมเนียม 10%</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowDonationForm(false)}
                      disabled={isSubmitting}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={isSubmitting || !form.amount || !form.donorName}
                    >
                      {isSubmitting ? 'กำลังดำเนินการ...' : `บริจาค ${formatCurrency(form.amount)}`}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Recent Supporters */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            ผู้สนับสนุนล่าสุด
          </h3>
          
          {creator.totalDonors === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีผู้สนับสนุน</h4>
              <p className="text-gray-600">เป็นคนแรกที่ให้การสนับสนุน {creator.name}!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholder for recent supporters - should be fetched from API */}
              {Array.from({ length: Math.min(creator.totalDonors, 6) }, (_, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">ผู้สนับสนุนคนที่ {i + 1}</p>
                    <p className="text-sm text-gray-600">สนับสนุนแล้ว</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}