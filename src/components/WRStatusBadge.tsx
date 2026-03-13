import { WRStatus } from '@/lib/types'

const statusConfig: Record<WRStatus, { label: string; className: string }> = {
  ACTIVE:      { label: 'Active',      className: 'bg-green-100 text-green-800 border border-green-200' },
  PLEDGED:     { label: 'Pledged',     className: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
  TRANSFERRED: { label: 'Transferred', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
  CANCELLED:   { label: 'Cancelled',   className: 'bg-red-100 text-red-800 border border-red-200' },
  EXPIRED:     { label: 'Expired',     className: 'bg-gray-100 text-gray-600 border border-gray-200' },
}

export function WRStatusBadge({ status }: { status: WRStatus }) {
  const { label, className } = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
