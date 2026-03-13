'use client'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/types'
import { Building2, TrendingUp, Landmark } from 'lucide-react'

const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    role: 'WAREHOUSE_OPERATOR',
    label: 'Warehouse Operator',
    desc: 'Issue and manage digital warehouse receipts for stored commodities',
    icon: <Building2 className="w-8 h-8" />,
    color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50',
  },
  {
    role: 'TRADER',
    label: 'Commodity Trader',
    desc: 'View your WR portfolio, transfer receipts, and pledge as collateral',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
  },
  {
    role: 'BANK_OFFICER',
    label: 'Bank Credit Officer',
    desc: 'Review pledge requests, approve collateral, and manage loans',
    icon: <Landmark className="w-8 h-8" />,
    color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50',
  },
]

export default function Home() {
  const { setRole } = useStore()
  const router = useRouter()

  const handleSelect = (role: UserRole) => {
    setRole(role)
    if (role === 'WAREHOUSE_OPERATOR') router.push('/dashboard/warehouse')
    else if (role === 'TRADER') router.push('/dashboard/trader')
    else router.push('/dashboard/bank')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-500 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Iteration 1 — Digital Foundation
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">WR Platform</h1>
          <p className="text-lg text-gray-500">
            Digital Warehouse Receipt Management
          </p>
          <p className="text-sm text-gray-400 mt-2">Select your role to continue</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map(({ role, label, desc, icon, color }) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className={`bg-white border-2 rounded-xl p-6 text-left transition-all cursor-pointer ${color} group`}
            >
              <div className="text-gray-400 group-hover:text-gray-700 mb-4 transition-colors">
                {icon}
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">{label}</h2>
              <p className="text-sm text-gray-500">{desc}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Demo mode — no authentication required. Using in-memory seed data.
        </p>
      </div>
    </main>
  )
}
