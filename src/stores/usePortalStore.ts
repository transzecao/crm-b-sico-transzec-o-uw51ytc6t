import React, { createContext, useContext, useState, ReactNode } from 'react'

export type PortalUser = {
  id: string
  cnpj: string
  name: string
  email: string
  phone: string
  password?: string
  status: 'pending' | 'approved' | 'rejected'
  customerId?: string
}

export type PortalCollection = {
  id: string
  customerId: string
  dailyOrder: number
  date: string
  originAddress: string
  originName: string
  originCnpj: string
  destAddress: string
  destName: string
  destCnpj: string
  invoiceNumber: string
  contactPhone: string
  freightType: 'CIF' | 'FOB'
  dimensions: string
  weight: number
  invoiceValue: number
  quantity: number
  status: 'pending' | 'requested_confirmation' | 'confirmed' | 'routed'
  slot?: string
  displayId?: string
}

export type PortalQuote = {
  id: string
  customerId: string
  quoteCode: string
  date: string
  invoiceNumber: string
  value: number
  origin: string
  dest: string
  weight: number
  status: 'active'
}

export type PortalDocRequest = {
  id: string
  customerId: string
  type: 'CTe' | 'OS' | 'Fatura' | 'Boleto'
  status: 'urgent' | 'completed'
  data: any
  date: string
}

export type PortalMessage = {
  id: string
  customerId: string
  department: 'Financeiro' | 'Coleta'
  message: string
  date: string
  replies: any[]
}

export interface PortalState {
  hasSeenTour: boolean
  setHasSeenTour: (val: boolean) => void
  users: PortalUser[]
  collections: PortalCollection[]
  quotes: PortalQuote[]
  docRequests: PortalDocRequest[]
  messages: PortalMessage[]
  currentUser: PortalUser | null
  setCurrentUser: (user: PortalUser | null) => void
  login: (email: string, pass: string) => boolean
  logout: () => void
  register: (user: Omit<PortalUser, 'id' | 'status'>) => void
  approveUser: (id: string) => void
  rejectUser: (id: string) => void
  addCollection: (
    col: Omit<PortalCollection, 'id' | 'status' | 'dailyOrder' | 'date' | 'displayId'>,
  ) => void
  updateCollectionSlot: (id: string, slot: string) => void
  requestConfirmation: (id: string) => void
  addQuote: (quote: Omit<PortalQuote, 'id' | 'date' | 'quoteCode'>) => void
  addDocRequest: (req: Omit<PortalDocRequest, 'id' | 'status' | 'date'>) => void
  addMessage: (msg: Omit<PortalMessage, 'id' | 'date' | 'replies'>) => void
}

const PortalContext = createContext<PortalState | undefined>(undefined)

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<PortalUser[]>([
    {
      id: '1',
      cnpj: '12.345.678/0001-90',
      name: 'Empresa Teste',
      email: 'teste@empresa.com',
      phone: '11999999999',
      password: 'Password1!',
      status: 'approved',
      customerId: '064',
    },
  ])
  const [collections, setCollections] = useState<PortalCollection[]>([])
  const [quotes, setQuotes] = useState<PortalQuote[]>([])
  const [docRequests, setDocRequests] = useState<PortalDocRequest[]>([])
  const [messages, setMessages] = useState<PortalMessage[]>([])
  const [currentUser, setCurrentUser] = useState<PortalUser | null>({
    id: '1',
    cnpj: '12.345.678/0001-90',
    name: 'Empresa Teste',
    email: 'teste@empresa.com',
    phone: '11999999999',
    status: 'approved',
    customerId: '064',
  })
  const [hasSeenTour, setHasSeenTour] = useState(false)

  const value: PortalState = {
    hasSeenTour,
    setHasSeenTour,
    users,
    collections,
    quotes,
    docRequests,
    messages,
    currentUser,
    setCurrentUser,
    login: (email, pass) => {
      const u = users.find(
        (x) => x.email === email && x.password === pass && x.status === 'approved',
      )
      if (u) {
        setCurrentUser(u)
        return true
      }
      return false
    },
    logout: () => {}, // Disabled since login is bypassed
    register: (data) =>
      setUsers((prev) => [...prev, { ...data, id: Date.now().toString(), status: 'pending' }]),
    approveUser: (id) =>
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: 'approved',
                customerId: Math.floor(Math.random() * 1000)
                  .toString()
                  .padStart(3, '0'),
              }
            : u,
        ),
      ),
    rejectUser: (id) =>
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'rejected' } : u))),
    addCollection: (colData) => {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dailyOrder = collections.filter((c) => c.date.startsWith(`${dd}/${mm}`)).length + 1
      const displayId = `${dd}${mm}${dailyOrder}${colData.customerId}`
      setCollections((prev) => [
        ...prev,
        {
          ...colData,
          id: Date.now().toString(),
          status: 'pending',
          dailyOrder,
          date: `${dd}/${mm}/${today.getFullYear()}`,
          displayId,
        },
      ])
    },
    updateCollectionSlot: (id, slot) =>
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, slot, status: 'confirmed' } : c)),
      ),
    requestConfirmation: (id) =>
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'requested_confirmation' } : c)),
      ),
    addQuote: (data) =>
      setQuotes((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          quoteCode: `${data.customerId}${data.invoiceNumber}`,
          status: 'active',
        },
      ]),
    addDocRequest: (data) =>
      setDocRequests((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now().toString(),
          status: 'urgent',
          date: new Date().toLocaleDateString(),
        },
      ]),
    addMessage: (data) =>
      setMessages((prev) => [
        ...prev,
        { ...data, id: Date.now().toString(), date: new Date().toLocaleDateString(), replies: [] },
      ]),
  }

  return React.createElement(PortalContext.Provider, { value }, children)
}

export default function usePortalStore() {
  const context = useContext(PortalContext)
  if (!context) throw new Error('usePortalStore must be used within PortalProvider')
  return context
}
