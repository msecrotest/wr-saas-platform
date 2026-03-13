export type WRStatus = 'ACTIVE' | 'PLEDGED' | 'TRANSFERRED' | 'CANCELLED' | 'EXPIRED'
export type PledgeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'REPAID' | 'RELEASED'
export type UserRole = 'WAREHOUSE_OPERATOR' | 'TRADER' | 'BANK_OFFICER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  orgName: string
}

export interface WarehouseReceipt {
  id: string
  receiptNumber: string
  commodity: string
  quantity: number
  unit: string
  grade?: string
  location: string
  warehouseId: string
  warehouseName: string
  holderId: string
  holderName: string
  status: WRStatus
  issuedAt: string
  expiresAt?: string
}

export interface AuditLog {
  id: string
  wrId?: string
  pledgeId?: string
  actorId: string
  actorName: string
  action: string
  detail?: string
  createdAt: string
}

export interface Pledge {
  id: string
  wrId: string
  traderId: string
  bankId: string
  amountRequested: number
  currency: string
  status: PledgeStatus
  notes?: string
  createdAt: string
  updatedAt: string
}
