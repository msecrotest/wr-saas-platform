'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { WRStatusBadge } from '@/components/WRStatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus, X, Package } from 'lucide-react'
import Link from 'next/link'

interface IssueFormData {
  commodity: string
  quantity: string
  unit: string
  grade: string
  location: string
  expiresAt: string
  holderId: string
}

export default function WarehouseDashboard() {
  const { receipts, createWR, currentUser, getUsersByRole } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<IssueFormData>({ commodity: '', quantity: '', unit: 'tonnes', grade: '', location: '', expiresAt: '', holderId: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const traders = getUsersByRole('TRADER')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.commodity || !form.quantity || !form.location || !form.holderId) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    createWR({
      commodity: form.commodity,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      grade: form.grade || undefined,
      location: form.location,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      holderId: form.holderId,
    })
    setLoading(false)
    setSuccess('Warehouse receipt issued successfully!')
    setForm({ commodity: '', quantity: '', unit: 'tonnes', grade: '', location: '', expiresAt: '', holderId: '' })
    setShowForm(false)
    setTimeout(() => setSuccess(''), 4000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{currentUser?.orgName} — Manage and issue digital warehouse receipts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Issue New WR
        </button>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">{success}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Issued', value: receipts.length },
          { label: 'Active', value: receipts.filter(r => r.status === 'ACTIVE').length },
          { label: 'Pledged', value: receipts.filter(r => r.status === 'PLEDGED').length },
          { label: 'Transferred', value: receipts.filter(r => r.status === 'TRANSFERRED').length },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* WR Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Warehouse Receipts</h2>
        </div>
        {receipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="w-10 h-10 mb-3" />
            <p className="font-medium">No receipts issued yet</p>
            <p className="text-sm">Issue your first warehouse receipt above</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Receipt #', 'Commodity', 'Quantity', 'Holder', 'Status', 'Issued', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {receipts.map(wr => (
                <tr key={wr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-700">{wr.receiptNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{wr.commodity}</td>
                  <td className="px-6 py-4 text-gray-600">{wr.quantity.toLocaleString()} {wr.unit}</td>
                  <td className="px-6 py-4 text-gray-600">{wr.holderName}</td>
                  <td className="px-6 py-4"><WRStatusBadge status={wr.status} /></td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(wr.issuedAt)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/wr/${wr.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Issue WR Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Issue New Warehouse Receipt</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Commodity *</label>
                  <input value={form.commodity} onChange={e => setForm(f => ({...f, commodity: e.target.value}))} placeholder="e.g. Wheat" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Grade</label>
                  <input value={form.grade} onChange={e => setForm(f => ({...f, grade: e.target.value}))} placeholder="e.g. Grade A" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
                  <input type="number" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} placeholder="0" required min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>tonnes</option><option>kg</option><option>bushels</option><option>barrels</option><option>lbs</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Storage Location *</label>
                <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Silo #3, Chicago, IL" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Issue to Trader *</label>
                  <select value={form.holderId} onChange={e => setForm(f => ({...f, holderId: e.target.value}))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select trader...</option>
                    {traders.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({...f, expiresAt: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  {loading ? 'Issuing...' : 'Issue Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
