import { useState, useEffect, useMemo } from 'react'
import { UserRole, Permissions, createPermissions } from '@/types/roles'
import pb from '@/lib/pocketbase/client'

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

export type AuditLog = {
  id: string
  timestamp: string
  userName: string
  actionType: string
  targetEntity: string
  prevValue: string
  newValue: string
}

export interface CrmStateChunks {
  user: {
    role: UserRole
    permissions: Permissions
    currentUser: { name: string; avatar: string }
  }
  data: {
    companies: Company[]
    leads: Lead[]
    contacts: Contact[]
    interactions: Interaction[]
  }
  logs: {
    accessLogs: { date: string; user: string; role: string; module: string }[]
    auditLogs: AuditLog[]
  }
  ui: {
    consultantGoals: ConsultantGoal[]
    tourOpen: boolean
  }
}

// Internal structure with chunking applied
let globalState: CrmStateChunks = {
  user: {
    role: 'DESENVOLVEDOR',
    permissions: createPermissions('DESENVOLVEDOR'),
    currentUser: {
      name: 'Admin',
      avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    },
  },
  data: {
    companies: [],
    leads: [],
    contacts: [],
    interactions: [],
  },
  logs: {
    accessLogs: [],
    auditLogs: [],
  },
  ui: {
    consultantGoals: [],
    tourOpen: false,
  },
}

const listeners = new Set<(state: CrmStateChunks) => void>()

export default function useCrmStore() {
  const [state, setState] = useState<CrmStateChunks>(globalState)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const records = await pb.collection('tool_permissions').getFullList({
          filter: `role="${state.user.role}"`,
        })
        const map: Record<string, any> = {}
        records.forEach((r) => {
          map[r.tool] = r
        })
        const newPerms = createPermissions(state.user.role, map)
        updateState({ user: { ...globalState.user, permissions: newPerms } })
      } catch (e) {
        // silent fallback to default
      }
    }
    fetchPerms()
  }, [state.user.role])

  const updateState = (newState: Partial<CrmStateChunks> | Record<string, any>) => {
    if ('user' in newState || 'data' in newState || 'logs' in newState || 'ui' in newState) {
      const chunked = newState as Partial<CrmStateChunks>
      globalState = {
        ...globalState,
        user: chunked.user ? { ...globalState.user, ...chunked.user } : globalState.user,
        data: chunked.data ? { ...globalState.data, ...chunked.data } : globalState.data,
        logs: chunked.logs ? { ...globalState.logs, ...chunked.logs } : globalState.logs,
        ui: chunked.ui ? { ...globalState.ui, ...chunked.ui } : globalState.ui,
      }
    } else {
      const flat = newState as Record<string, any>
      const updatedUser = { ...globalState.user }
      const updatedData = { ...globalState.data }
      const updatedLogs = { ...globalState.logs }
      const updatedUi = { ...globalState.ui }

      if ('role' in flat) updatedUser.role = flat.role
      if ('permissions' in flat) updatedUser.permissions = flat.permissions
      if ('currentUser' in flat) updatedUser.currentUser = flat.currentUser

      if ('companies' in flat) updatedData.companies = flat.companies
      if ('leads' in flat) updatedData.leads = flat.leads
      if ('contacts' in flat) updatedData.contacts = flat.contacts
      if ('interactions' in flat) updatedData.interactions = flat.interactions

      if ('accessLogs' in flat) updatedLogs.accessLogs = flat.accessLogs
      if ('auditLogs' in flat) updatedLogs.auditLogs = flat.auditLogs

      if ('consultantGoals' in flat) updatedUi.consultantGoals = flat.consultantGoals
      if ('tourOpen' in flat) updatedUi.tourOpen = flat.tourOpen

      globalState = { user: updatedUser, data: updatedData, logs: updatedLogs, ui: updatedUi }
    }

    if (globalState.user.role && !newState.user?.permissions && !newState.permissions) {
      globalState.user.permissions = createPermissions(globalState.user.role)
    }

    listeners.forEach((listener) => listener(globalState))
  }

  const logAccess = (moduleName: string) => {
    const newLog = {
      date: new Date().toISOString(),
      user: globalState.user.currentUser.name,
      role: globalState.user.role,
      module: moduleName,
    }
    updateState({
      logs: {
        ...globalState.logs,
        accessLogs: [newLog, ...globalState.logs.accessLogs].slice(0, 100),
      },
    })
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
      userName: globalState.user.currentUser.name,
      actionType,
      targetEntity,
      prevValue,
      newValue,
    }
    updateState({
      logs: {
        ...globalState.logs,
        auditLogs: [newLog, ...globalState.logs.auditLogs].slice(0, 500),
      },
    })
  }

  const proxyState = useMemo(() => {
    return new Proxy(state, {
      get(target, prop: string) {
        if (prop in target) return target[prop as keyof CrmStateChunks]
        if (prop in target.user) return target.user[prop as keyof typeof target.user]
        if (prop in target.data) return target.data[prop as keyof typeof target.data]
        if (prop in target.logs) return target.logs[prop as keyof typeof target.logs]
        if (prop in target.ui) return target.ui[prop as keyof typeof target.ui]
        return undefined
      },
    })
  }, [state]) as CrmStateChunks &
    typeof state.user &
    typeof state.data &
    typeof state.logs &
    typeof state.ui

  return { state: proxyState, updateState, logAccess, logAction }
}
