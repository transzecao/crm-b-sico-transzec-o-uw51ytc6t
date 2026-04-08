import { useState, useEffect } from 'react'

export type Role =
  | 'DESENVOLVEDOR'
  | 'DIRETOR'
  | 'SUPERVISOR_FINANCEIRO'
  | 'SUPERVISOR_COLETA'
  | 'SUPERVISOR_COMERCIAL'
  | 'FUNCIONARIO_FINANCEIRO'
  | 'FUNCIONARIO_COLETA'
  | 'FUNCIONARIO_PROSPECCAO'
  | 'FUNCIONARIO_MARKETING'
  | 'CLIENTE'
  | 'SUPORTE_TECNICO'

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  DESENVOLVEDOR: [
    'DIRETOR',
    'SUPERVISOR_FINANCEIRO',
    'SUPERVISOR_COLETA',
    'SUPERVISOR_COMERCIAL',
    'FUNCIONARIO_FINANCEIRO',
    'FUNCIONARIO_COLETA',
    'FUNCIONARIO_PROSPECCAO',
    'FUNCIONARIO_MARKETING',
    'CLIENTE',
    'SUPORTE_TECNICO',
  ],
  DIRETOR: [
    'SUPERVISOR_FINANCEIRO',
    'SUPERVISOR_COLETA',
    'SUPERVISOR_COMERCIAL',
    'FUNCIONARIO_FINANCEIRO',
    'FUNCIONARIO_COLETA',
    'FUNCIONARIO_PROSPECCAO',
    'FUNCIONARIO_MARKETING',
    'CLIENTE',
    'SUPORTE_TECNICO',
  ],
  SUPERVISOR_FINANCEIRO: ['FUNCIONARIO_FINANCEIRO'],
  SUPERVISOR_COLETA: ['FUNCIONARIO_COLETA'],
  SUPERVISOR_COMERCIAL: ['FUNCIONARIO_PROSPECCAO', 'FUNCIONARIO_MARKETING'],
  FUNCIONARIO_FINANCEIRO: [],
  FUNCIONARIO_COLETA: [],
  FUNCIONARIO_PROSPECCAO: [],
  FUNCIONARIO_MARKETING: [],
  CLIENTE: [],
  SUPORTE_TECNICO: [],
}

export const TOOL_RESPONSIBILITIES: Record<string, Role[]> = {
  finance_cpk: ['SUPERVISOR_FINANCEIRO', 'FUNCIONARIO_FINANCEIRO'],
  freight_calculation: ['SUPERVISOR_COLETA', 'FUNCIONARIO_COLETA'],
  prospeccao: ['SUPERVISOR_COMERCIAL', 'FUNCIONARIO_PROSPECCAO'],
}

export type Permissions = {
  canAccessTool: (toolId: string) => boolean
  isDeveloperOf: (toolId: string) => boolean
  canManageFields: (toolId: string) => boolean
}

function createPermissions(role: Role): Permissions {
  const userRoles = [role, ...(ROLE_HIERARCHY[role] || [])]

  const canAccessTool = (toolId: string) => {
    if (role === 'DESENVOLVEDOR' || role === 'DIRETOR') return true
    const allowedRoles = TOOL_RESPONSIBILITIES[toolId] || []
    return allowedRoles.some((r) => userRoles.includes(r as Role))
  }

  const isDeveloperOf = (toolId: string) => {
    if (role === 'DESENVOLVEDOR' || role === 'DIRETOR') return true
    const allowedRoles = TOOL_RESPONSIBILITIES[toolId] || []
    return allowedRoles.some((r) => r.startsWith('SUPERVISOR_') && userRoles.includes(r as Role))
  }

  return {
    canAccessTool,
    isDeveloperOf,
    canManageFields: isDeveloperOf,
  }
}

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
  segmento?: string
  clusters?: string[]
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
}

export type ConsultantGoal = {
  id: string
  consultantName: string
  targetValue: number
  currentValue: number
  period: string
}

export type FreightOrder = {
  id: string
  companyId: string
  trackingCode: string
  status: 'Pendente' | 'Em Coleta' | 'Em Trânsito' | 'Entregue'
  origin: string
  destination: string
  updatedAt: string
  invoiceUrl?: string
}

export type AuditLog = {
  id: string
  timestamp: string
  userName: string
  actionType: string
  targetEntity: string
  prevValue: string
  newValue: string
}

type CrmState = {
  role: Role
  permissions: Permissions
  currentUser: { name: string; avatar: string }
  companies: Company[]
  leads: Lead[]
  contacts: Contact[]
  interactions: Interaction[]
  accessLogs: { date: string; user: string; role: string; module: string }[]
  auditLogs: AuditLog[]
  consultantGoals: ConsultantGoal[]
  freightOrders: FreightOrder[]
  tourOpen: boolean
}

let globalState: CrmState = {
  role: 'DESENVOLVEDOR',
  permissions: createPermissions('DESENVOLVEDOR'),
  currentUser: {
    name: 'Admin',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  companies: [],
  leads: [],
  contacts: [],
  interactions: [],
  accessLogs: [],
  auditLogs: [],
  consultantGoals: [],
  freightOrders: [],
  tourOpen: false,
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
    if (newState.role) {
      newState.permissions = createPermissions(newState.role)
    }
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

  const logAction = (
    actionType: string,
    targetEntity: string,
    prevValue: string,
    newValue: string,
  ) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleString('pt-BR'),
      userName: globalState.currentUser.name,
      actionType,
      targetEntity,
      prevValue,
      newValue,
    }
    updateState({ auditLogs: [newLog, ...globalState.auditLogs].slice(0, 500) })
  }

  return { state, updateState, logAccess, logAction }
}
