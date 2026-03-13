'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { WRStatusBadge } from '@/components/WRStatusBadge'
import { formatDate } from '@/lib/utils'
import { ArrowRightLeft, TrendingUp, X, Package } from 'lucide-react'
import Link from 'next/link'

export default function TraderDashboard() {
  const { receipts, currentUser, transferWR, getUsersByRole } = useStore()
  const [transferWRId, setTransferWRId] = useState<string | null>(null)
  const [newHolderId, setNewHolderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const myReceipts = receipts.filter(wr => wr.holderId === currentUser?.id)
  const traders = getUsersByRole('TRADER').filter(t => t.id !== currentUser?.id)
  const transferTarget = receipts.find(wr => wr.id === transferWRId)

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transferWRId || !newHolderId) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    transferWR(transferWRId, newHolderId)
    setLoading(false)
    setTransferWRId(null)
    setNewHolderId('')
    setSuccess('WR transferred successfully!')
    setTimeout(() => setSuccess(''), 4000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My WR Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">{currentUser?.orgName} — {myReceipts.length} receipt{myReceipts.length !== 1 ? 's' : ''} in portfolio</p>
        </div>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">{success}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total WRs', value: myReceipts.length },
          { label: 'Active', value: myReceipts.filter(r => r.status === 'ACTIVE').length },
          { label: 'Pledged', value: myReceipts.filter(r => r.status === 'PLEDGED').length },
          { label: 'Transferred', value: myReceipts.filter(r => r.status === 'TRANSFERRED').length },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Warehouse Receipts</h2>
        </div>
        {myReceipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="w-10 h-10 mb-3" />
            <p className="font-medium">No WRs in your portfolio</p>
            <p className="text-sm">Warehouse receipts issued to you will appear here</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Receipt #', 'Commodity', 'Quantity', 'Location', 'Status', 'Expiry', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myReceipts.map(wr => (
                <tr key={wr.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-700">{wr.receiptNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{wr.commodity}</td>
                  <td className="px-6 py-4 text-gray-600">{wr.quantity.toLocaleString()} {wr.unit}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs max-w-[160px] truncate">{wr.location}</td>
                  <td className="px-6 py-4"><WRStatusBadge status={wr.status} /></td>
                  <td className="px-6 py-4 text-gray-500">{wr.expiresAt ? formatDate(wr.expiresAt) : '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/wr/${wr.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</Link>
                      {wr.status === 'ACTIVE' && (
                        <>
                          <span className="text-gray-200">|</span>
                          <button onClick={() => setTransferWRId(wr.id)} className="text-gray-600 hover:text-gray-900 text-xs font-medium flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" /> Transfer
                          </button>
                          <span className="text-gray-200">|</span>
                          <button className="text-yellow-600 hover:text-yellow-800 text-xs font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Pledge
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transfer Modal */}
      {transferWRId && transferTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Transfer Warehouse Receipt</h2>
              <button onClick={() => setTransferWRId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Transferring</div>
              <div className="font-medium text-gray-900">{transferTarget.receiptNumber}</div>
              <div className="text-sm text-gray-500">{transferTarget.quantity.toLocaleString()} {transferTarget.unit} of {transferTarget.commodity}</div>
            </div>
            <form onSubmit={handleTransfer} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Transfer to Trader *</label>
                <select value={newHolderId} onChange={e => setNewHolderId(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select recipient...</option>
                  {traders.map(t => <option key={t.id} value={t.id}>{t.name} ({t.orgName})</option>)}
                </select>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-yellow-800">
                ⚠️ This action is irreversible. The WR will be transferred and marked as TRANSFERRED.
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setTransferWRId(null)} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                  {loading ? 'Transferring...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
