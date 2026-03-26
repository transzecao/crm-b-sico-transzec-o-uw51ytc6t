import { useState, useEffect } from 'react'

export type Role =
  | 'Master'
  | 'Supervisor'
  | 'Comercial'
  | 'Financeiro'
  | 'Coleta'
  | 'Marketing'
  | 'Diretoria'

export type Lead = {
  id: string
  companyId: string
  title: string
  pipeline: 'Prospection' | 'Nutrition'
  stage: string
  value: number
  owner: string
  ownerAvatar?: string
  updatedBy: string
  updatedAt: string
  createdAt: string
  score?: 'Hot' | 'Warm' | 'Cold'
  isStalled?: boolean
  stalledDays?: number
}

export type Company = {
  id: string
  cnpj: string
  razaoSocial?: string
  nomeFantasia: string
  endereco: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  descricaoNegocio?: string
  pipeline?: string
  segmento?: string
  clusters?: string[]
  observacoes?: string
  customData?: Record<string, any>
  createdBy?: string
}

export type Contact = {
  id: string
  companyId: string
  name: string
  isPrincipal?: boolean
  methods: {
    id: string
    type: 'email' | 'whatsapp' | 'phone'
    value: string
    isPrincipal: boolean
  }[]
}

export type Interaction = {
  id: string
  companyId: string
  type: 'email' | 'whatsapp' | 'phone' | 'note'
  content: string
  date: string
  author: string
  subject?: string
}

export type UserLogin = {
  id: string
  name: string
  sector: string
  accessLink: string
  status: 'Ativo' | 'Inativo'
  createdAt: string
  updatedAt: string
}

type CrmState = {
  role: Role
  currentUser: { name: string; avatar: string }
  companies: Company[]
  leads: Lead[]
  contacts: Contact[]
  interactions: Interaction[]
  userLogins: UserLogin[]
  accessLogs: { date: string; user: string; role: string; module: string }[]
}

const mockCompanies: Company[] = [
  {
    id: '1',
    cnpj: '08.237.002/0042-89',
    razaoSocial: 'Industrial SP Metalurgia',
    nomeFantasia: 'Ind. SP',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    cep: '01310-100',
    logradouro: 'Av. Paulista',
    numero: '1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    segmento: 'Metalúrgico',
    clusters: ['Campinas'],
  },
]

const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Ind. SP Metalurgia',
    pipeline: 'Prospection',
    stage: 'Primeiro contato',
    value: 12500,
    owner: 'Admin',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    updatedBy: 'Admin',
    updatedAt: new Date().toLocaleString(),
    createdAt: new Date().toLocaleDateString(),
    score: 'Warm',
  },
]

const mockContacts: Contact[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Carlos Oliveira',
    isPrincipal: true,
    methods: [
      { id: 'm1', type: 'email', value: 'carlos@indsp.com.br', isPrincipal: true },
      { id: 'm2', type: 'whatsapp', value: '(11) 98765-4321', isPrincipal: true },
    ],
  },
]

let globalState: CrmState = {
  role: 'Master',
  currentUser: {
    name: 'Admin',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  companies: mockCompanies,
  leads: mockLeads,
  contacts: mockContacts,
  interactions: [],
  userLogins: [],
  accessLogs: [],
}

const listeners = new Set<(state: CrmState) => void>()

export default function useCrmStore() {
  const [state, setState] = useState<CrmState>(globalState)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const updateState = (newState: Partial<CrmState>) => {
    globalState = { ...globalState, ...newState }
    listeners.forEach((listener) => listener(globalState))
  }

  const logAccess = (moduleName: string) => {
    const newLog = {
      date: new Date().toISOString(),
      user: globalState.currentUser.name,
      role: globalState.role,
      module: moduleName,
    }
    updateState({ accessLogs: [newLog, ...globalState.accessLogs].slice(0, 100) })
  }

  return { state, updateState, logAccess }
}
