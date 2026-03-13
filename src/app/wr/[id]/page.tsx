'use client'
import { useStore } from '@/lib/store'
import { notFound } from 'next/navigation'
import { WRStatusBadge } from '@/components/WRStatusBadge'
import { formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Package, User, Clock } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export default function WRDetailPage({ params }: { params: { id: string } }) {
  const { getWRById, getAuditForWR } = useStore()
  const wr = getWRById(params.id)

  if (!wr) return notFound()

  const auditLogs = getAuditForWR(wr.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link href="javascript:history.back()" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{wr.receiptNumber}</h1>
              <WRStatusBadge status={wr.status} />
            </div>
            <p className="text-gray-500 text-sm">Warehouse Receipt Detail</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Main Info */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Receipt Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Commodity</div>
                <div className="font-medium text-gray-900">{wr.commodity}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Quantity</div>
                <div className="font-medium text-gray-900">{wr.quantity.toLocaleString()} {wr.unit}</div>
              </div>
              {wr.grade && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Grade</div>
                  <div className="font-medium text-gray-900">{wr.grade}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</div>
                <div className="font-medium text-gray-900 text-sm">{wr.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Issued</div>
                <div className="font-medium text-gray-900">{formatDate(wr.issuedAt)}</div>
              </div>
              {wr.expiresAt && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Expires</div>
                  <div className="font-medium text-gray-900">{formatDate(wr.expiresAt)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Parties */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><User className="w-3 h-3" /> Current Holder</div>
              <div className="font-medium text-gray-900 text-sm">{wr.holderName}</div>
              <div className="text-xs text-gray-500 mt-1">Trader</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><User className="w-3 h-3" /> Issuing Warehouse</div>
              <div className="font-medium text-gray-900 text-sm">{wr.warehouseName}</div>
              <div className="text-xs text-gray-500 mt-1">Warehouse Operator</div>
            </div>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> Audit Trail</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {auditLogs.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">No audit logs yet</div>
            ) : (
              auditLogs.map((log, i) => (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{log.action}</span>
                      <span className="text-gray-500 text-xs">by {log.actorName}</span>
                    </div>
                    {log.detail && <p className="text-sm text-gray-600 mt-0.5">{log.detail}</p>}
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(log.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
