'use client'
import { useStore } from '@/lib/store'
import { Landmark, Clock, CheckCircle, Package } from 'lucide-react'

export default function BankDashboard() {
  const { receipts } = useStore()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bank Credit Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">First National Bank — Pledge requests and collateral management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total WRs in System', value: receipts.length, icon: <Package className="w-5 h-5 text-gray-400" /> },
          { label: 'Active Pledges', value: receipts.filter(r => r.status === 'PLEDGED').length, icon: <Landmark className="w-5 h-5 text-yellow-500" /> },
          { label: 'Pending Requests', value: 0, icon: <Clock className="w-5 h-5 text-blue-500" /> },
          { label: 'Approved This Month', value: 0, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {stat.icon}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pledge Queue Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pledge Requests</h2>
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">Iteration 2</span>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="bg-blue-50 rounded-full p-4 mb-4">
            <Landmark className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">Pledge requests coming in Iteration 2</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            When traders pledge warehouse receipts as collateral, they will appear here for your review and approval.
          </p>
          <div className="mt-6 text-left bg-gray-50 rounded-xl p-4 max-w-sm w-full text-xs text-gray-500 space-y-2">
            <div className="font-medium text-gray-700 mb-3">Coming in Iter 2:</div>
            <div>✓ Receive pledge request from trader</div>
            <div>✓ Review WR details + warehouse confirmation</div>
            <div>✓ Approve or reject with notes</div>
            <div>✓ Track loan status: APPROVED → DISBURSED → REPAID</div>
            <div>✓ Auto-lock WR while pledged</div>
          </div>
        </div>
      </div>

      {/* Currently Pledged WRs */}
      {receipts.filter(r => r.status === 'PLEDGED').length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Currently Pledged WRs</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Receipt #', 'Commodity', 'Quantity', 'Holder', 'Location'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {receipts.filter(r => r.status === 'PLEDGED').map(wr => (
                <tr key={wr.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-700">{wr.receiptNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{wr.commodity}</td>
                  <td className="px-6 py-4 text-gray-600">{wr.quantity.toLocaleString()} {wr.unit}</td>
                  <td className="px-6 py-4 text-gray-600">{wr.holderName}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{wr.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
