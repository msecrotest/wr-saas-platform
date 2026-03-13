'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { WarehouseReceipt, User, AuditLog, Pledge, UserRole } from './types'
import { generateReceiptNumber } from './utils'

// --- Seed Data ---
const SEED_USERS: User[] = [
  { id: 'u1', name: 'GrainCo Warehouse', email: 'ops@grainco.com', role: 'WAREHOUSE_OPERATOR', orgName: 'GrainCo Ltd' },
  { id: 'u2', name: 'Trader A (AgriTrade)', email: 'trader@agritrade.com', role: 'TRADER', orgName: 'AgriTrade Inc' },
  { id: 'u3', name: 'Trader B (CommodEx)', email: 'trader@commodex.com', role: 'TRADER', orgName: 'CommodEx LLC' },
  { id: 'u4', name: 'First National Bank', email: 'credit@fnb.com', role: 'BANK_OFFICER', orgName: 'First National Bank' },
]

const SEED_WRS: WarehouseReceipt[] = [
  {
    id: 'wr1',
    receiptNumber: 'WR-2026-100001',
    commodity: 'Wheat',
    quantity: 500,
    unit: 'tonnes',
    grade: 'Grade A',
    location: 'GrainCo Silo #3, Chicago, IL',
    warehouseId: 'u1',
    warehouseName: 'GrainCo Warehouse',
    holderId: 'u2',
    holderName: 'Trader A (AgriTrade)',
    status: 'ACTIVE',
    issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wr2',
    receiptNumber: 'WR-2026-100002',
    commodity: 'Corn',
    quantity: 1200,
    unit: 'tonnes',
    grade: 'Grade B',
    location: 'GrainCo Silo #7, Kansas City, MO',
    warehouseId: 'u1',
    warehouseName: 'GrainCo Warehouse',
    holderId: 'u2',
    holderName: 'Trader A (AgriTrade)',
    status: 'ACTIVE',
    issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'wr3',
    receiptNumber: 'WR-2026-100003',
    commodity: 'Copper',
    quantity: 25,
    unit: 'tonnes',
    grade: 'LME Grade A',
    location: 'MetalStore Vault, Detroit, MI',
    warehouseId: 'u1',
    warehouseName: 'GrainCo Warehouse',
    holderId: 'u3',
    holderName: 'Trader B (CommodEx)',
    status: 'PLEDGED',
    issuedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const SEED_AUDIT: AuditLog[] = [
  { id: 'a1', wrId: 'wr1', actorId: 'u1', actorName: 'GrainCo Warehouse', action: 'ISSUED', detail: 'WR issued to Trader A', createdAt: SEED_WRS[0].issuedAt },
  { id: 'a2', wrId: 'wr2', actorId: 'u1', actorName: 'GrainCo Warehouse', action: 'ISSUED', detail: 'WR issued to Trader A', createdAt: SEED_WRS[1].issuedAt },
  { id: 'a3', wrId: 'wr3', actorId: 'u1', actorName: 'GrainCo Warehouse', action: 'ISSUED', detail: 'WR issued to Trader B', createdAt: SEED_WRS[2].issuedAt },
  { id: 'a4', wrId: 'wr3', actorId: 'u3', actorName: 'Trader B (CommodEx)', action: 'PLEDGED', detail: 'WR pledged to First National Bank as collateral', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
]

// --- Context ---
interface StoreContextType {
  currentUser: User | null
  users: User[]
  receipts: WarehouseReceipt[]
  auditLogs: AuditLog[]
  pledges: Pledge[]
  setRole: (role: UserRole) => void
  createWR: (data: Omit<WarehouseReceipt, 'id' | 'receiptNumber' | 'issuedAt' | 'status' | 'warehouseName' | 'holderName' | 'warehouseId' | 'holderId'> & { holderId: string }) => WarehouseReceipt
  transferWR: (wrId: string, newHolderId: string) => void
  getWRById: (id: string) => WarehouseReceipt | undefined
  getAuditForWR: (wrId: string) => AuditLog[]
  getUsersByRole: (role: UserRole) => User[]
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users] = useState<User[]>(SEED_USERS)
  const [receipts, setReceipts] = useState<WarehouseReceipt[]>(SEED_WRS)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT)
  const [pledges] = useState<Pledge[]>([])

  const setRole = useCallback((role: UserRole) => {
    const user = SEED_USERS.find(u => u.role === role) || null
    setCurrentUser(user)
  }, [])

  const createWR = useCallback((data: Omit<WarehouseReceipt, 'id' | 'receiptNumber' | 'issuedAt' | 'status' | 'warehouseName' | 'holderName' | 'warehouseId' | 'holderId'> & { holderId: string }): WarehouseReceipt => {
    const holder = SEED_USERS.find(u => u.id === data.holderId)
    const warehouse = SEED_USERS.find(u => u.role === 'WAREHOUSE_OPERATOR')
    const newWR: WarehouseReceipt = {
      ...data,
      id: `wr${Date.now()}`,
      receiptNumber: generateReceiptNumber(),
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
      warehouseId: warehouse?.id || 'u1',
      warehouseName: warehouse?.name || 'Warehouse',
      holderName: holder?.name || 'Unknown',
    }
    setReceipts(prev => [...prev, newWR])
    setAuditLogs(prev => [...prev, {
      id: `a${Date.now()}`,
      wrId: newWR.id,
      actorId: warehouse?.id || 'u1',
      actorName: warehouse?.name || 'Warehouse',
      action: 'ISSUED',
      detail: `WR issued to ${holder?.name}`,
      createdAt: newWR.issuedAt,
    }])
    return newWR
  }, [])

  const transferWR = useCallback((wrId: string, newHolderId: string) => {
    const newHolder = SEED_USERS.find(u => u.id === newHolderId)
    setReceipts(prev => prev.map(wr =>
      wr.id === wrId ? { ...wr, holderId: newHolderId, holderName: newHolder?.name || 'Unknown', status: 'TRANSFERRED' as const } : wr
    ))
    setAuditLogs(prev => [...prev, {
      id: `a${Date.now()}`,
      wrId,
      actorId: currentUser?.id || '',
      actorName: currentUser?.name || '',
      action: 'TRANSFERRED',
      detail: `WR transferred to ${newHolder?.name}`,
      createdAt: new Date().toISOString(),
    }])
  }, [currentUser])

  const getWRById = useCallback((id: string) => receipts.find(wr => wr.id === id), [receipts])
  const getAuditForWR = useCallback((wrId: string) => auditLogs.filter(a => a.wrId === wrId), [auditLogs])
  const getUsersByRole = useCallback((role: UserRole) => users.filter(u => u.role === role), [users])

  return (
    <StoreContext.Provider value={{ currentUser, users, receipts, auditLogs, pledges, setRole, createWR, transferWR, getWRById, getAuditForWR, getUsersByRole }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
