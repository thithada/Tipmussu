// Location: src/types/index.ts
// TypeScript type definitions

export interface User {
  id: string
  email: string
  username: string
  name?: string
  image?: string
  bio?: string
  donationGoal?: number
  promptPayId?: string
  bankAccount?: string
  createdAt: Date
  updatedAt: Date
}

export interface Donation {
  id: string
  amount: number
  message?: string
  donorName: string
  donorEmail?: string
  paymentMethod: 'promptpay' | 'truemoney' | 'linepay'
  paymentStatus: 'pending' | 'confirmed' | 'failed'
  transactionId?: string
  userId: string
  user?: User
  createdAt: Date
  updatedAt: Date
}

export interface DonationFormData {
  amount: number
  message: string
  donorName: string
  donorEmail?: string
  paymentMethod: 'promptpay' | 'truemoney' | 'linepay'
}

export interface ApiResponse<T = any> {
  message: string
  data?: T
  errors?: any[]
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Additional types for authentication
export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpData {
  name: string
  username: string
  email: string
  password: string
}

// Dashboard related types
export interface DashboardStats {
  totalDonations: number
  totalDonors: number
  thisMonth: number
  pendingDonations: number
}

// Payment related types
export interface PaymentMethod {
  id: string
  name: string
  type: 'promptpay' | 'truemoney' | 'linepay'
  icon: string
  fee: number
  description: string
}

// Alert/Notification types
export interface AlertSettings {
  enabled: boolean
  showAmount: boolean
  showMessage: boolean
  minAmount: number
  sound: string
  duration: number
}

// Creator profile types
export interface CreatorProfile {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
  donationGoal?: number
  totalDonations: number
  totalDonors: number
  isVerified: boolean
}

// Session extensions for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      username?: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    username?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username?: string
  }
}