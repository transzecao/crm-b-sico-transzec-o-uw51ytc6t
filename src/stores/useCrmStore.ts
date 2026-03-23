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
  lastInteraction?: string
}

export type Company = {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  tipoCarga: string
  endereco: string
  descricaoNegocio?: string
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

type CrmState = {
  role: Role
  companies: Company[]
  leads: Lead[]
  contacts: Contact[]
}

const mockCompanies: Company[] = [
  {
    id: '1',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Logistica Alpha LTDA',
    nomeFantasia: 'Alpha Log',
    tipoCarga: 'Seca',
    endereco: 'Rua A, 123',
    descricaoNegocio:
      'Especializada em transporte rodoviário de cargas secas fracionadas para o interior paulista. Possui frota própria de 50 caminhões.',
  },
  {
    id: '2',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Transportes Beta S.A.',
    nomeFantasia: 'TransBeta',
    tipoCarga: 'Refrigerada',
    endereco: 'Av B, 456',
    descricaoNegocio: '',
  },
]

const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Negociação Alpha',
    pipeline: 'Prospection',
    stage: 'Negociação',
    value: 15000,
  },
  {
    id: '2',
    companyId: '2',
    title: 'Contato Inicial Beta',
    pipeline: 'Prospection',
    stage: 'Primeiro contato',
    value: 5000,
  },
  {
    id: '3',
    companyId: '1',
    title: 'Retomada Alpha',
    pipeline: 'Nutrition',
    stage: 'Mercado',
    value: 0,
  },
]

const mockContacts: Contact[] = [
  {
    id: '1',
    companyId: '1',
    name: 'João Silva',
    isPrincipal: true,
    methods: [
      { id: 'm1', type: 'email', value: 'joao@alpha.com', isPrincipal: true },
      { id: 'm2', type: 'whatsapp', value: '11999999999', isPrincipal: true },
      { id: 'm3', type: 'phone', value: '1133334444', isPrincipal: false },
    ],
  },
  {
    id: '2',
    companyId: '1',
    name: 'Maria Souza',
    isPrincipal: false,
    methods: [{ id: 'm4', type: 'email', value: 'maria@alpha.com', isPrincipal: true }],
  },
]

let globalState: CrmState = {
  role: 'Master',
  companies: mockCompanies,
  leads: mockLeads,
  contacts: mockContacts,
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

  return { state, updateState }
}
