'use client'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { Building2, TrendingUp, Landmark, FileText, LogOut } from 'lucide-react'

const roleLabels = {
  WAREHOUSE_OPERATOR: { label: 'Warehouse Operator', color: 'bg-orange-100 text-orange-800', icon: <Building2 className="w-4 h-4" /> },
  TRADER: { label: 'Trader', color: 'bg-blue-100 text-blue-800', icon: <TrendingUp className="w-4 h-4" /> },
  BANK_OFFICER: { label: 'Bank Officer', color: 'bg-purple-100 text-purple-800', icon: <Landmark className="w-4 h-4" /> },
}

export function Navbar() {
  const { currentUser } = useStore()
  const router = useRouter()
  const roleInfo = currentUser ? roleLabels[currentUser.role] : null

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-gray-900 font-semibold">
            <FileText className="w-5 h-5 text-blue-600" />
            WR Platform
          </Link>
          {currentUser && (
            <div className="flex items-center gap-4 text-sm">
              {currentUser.role === 'WAREHOUSE_OPERATOR' && (
                <Link href="/dashboard/warehouse" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              )}
              {currentUser.role === 'TRADER' && (
                <Link href="/dashboard/trader" className="text-gray-600 hover:text-gray-900">My Portfolio</Link>
              )}
              {currentUser.role === 'BANK_OFFICER' && (
                <Link href="/dashboard/bank" className="text-gray-600 hover:text-gray-900">Pledges</Link>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {currentUser && roleInfo && (
            <>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                {roleInfo.icon}
                {currentUser.name}
              </div>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Switch Role
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
