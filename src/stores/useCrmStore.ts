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
  lastInteraction?: string
  score?: 'Hot' | 'Warm' | 'Cold'
  isStalled?: boolean
}

export type Company = {
  id: string
  cnpj: string
  razaoSocial?: string
  nomeFantasia: string
  tipoCarga?: string
  endereco: string
  descricaoNegocio?: string
  siteProspectado?: string
  sitePesquisado?: string
  pipeline?: string
  origin?: string
  segmento?: string
  clusters?: string[]
  observacoes?: string
  customData?: Record<string, any>
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

export type CustomFieldDef = {
  id: string
  name: string
  type: 'text' | 'select' | 'number' | 'date'
  options?: string[]
}

type CrmState = {
  role: Role
  currentUser: { name: string; avatar: string }
  mandatoryFields: string[]
  companies: Company[]
  leads: Lead[]
  contacts: Contact[]
  interactions: Interaction[]
  customFieldDefs: CustomFieldDef[]
}

const mockCompanies: Company[] = [
  {
    id: '1',
    cnpj: '08.237.002/0042-89',
    razaoSocial: 'INDUSTRIAL PAULISTA DE METALURGIA LTDA',
    nomeFantasia: 'Ind. Paulista',
    tipoCarga: 'Seca',
    endereco: 'Rua A, 123',
    descricaoNegocio: 'Indústria metalúrgica focada em peças pesadas.',
    siteProspectado: 'https://www.indpaulista.com.br',
    pipeline: 'Pipeline de Prospecção',
    origin: 'Comercial',
    segmento: 'Metalúrgica',
    clusters: ['Campinas', 'Grande SP'],
  },
  {
    id: '2',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Sk Automotive Distribuidora de Autopeças LTDA',
    nomeFantasia: 'Sk Auto',
    tipoCarga: 'Seca',
    endereco: 'Av. Autopeças, 456',
    descricaoNegocio: 'Distribuição de autopeças em grande escala.',
    sitePesquisado: 'https://br.linkedin.com/company/skautomotive',
    pipeline: 'Pipeline de Nutrição',
    segmento: 'Autopeças',
    clusters: ['Vale do Paraíba'],
  },
]

const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
    title: 'INDUSTRIAL PAULISTA DE METALURGIA LTDA',
    pipeline: 'Prospection',
    stage: 'Primeiro contato',
    value: 12500,
    owner: 'Bruna Araujo',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    updatedBy: 'Bruna Araujo',
    updatedAt: '23/02/2026 17:29:24',
    createdAt: '23 de fevereiro de 2026',
    score: 'Hot',
  },
  {
    id: '2',
    companyId: '2',
    title: 'Sk Automotive Distribuidora',
    pipeline: 'Nutrition',
    stage: 'Nutrição – Aquecimento',
    value: 45000,
    owner: 'Carlos Silva',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    updatedBy: 'Automação',
    updatedAt: '20/03/2026 09:15:00',
    createdAt: '15 de janeiro de 2026',
    score: 'Warm',
  },
  {
    id: '3',
    companyId: '1',
    title: 'Projeto Especial Metalúrgica',
    pipeline: 'Prospection',
    stage: 'Negociação',
    value: 85000,
    owner: 'Bruna Araujo',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    updatedBy: 'Bruna Araujo',
    updatedAt: '01/03/2026 10:00:00',
    createdAt: '01 de março de 2026',
    score: 'Hot',
    isStalled: true,
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
    ],
  },
]

const mockInteractions: Interaction[] = [
  {
    id: 'int1',
    companyId: '1',
    type: 'whatsapp',
    content: 'Mensagem enviada com proposta inicial para o diretor comercial. Aguardando feedback.',
    date: '20/03/2026 10:30',
    author: 'Bruna Araujo',
  },
  {
    id: 'int2',
    companyId: '1',
    type: 'email',
    content: 'E-mail enviado contendo a apresentação institucional da Transzecão.',
    date: '19/03/2026 14:15',
    author: 'Bruna Araujo',
  },
]

let globalState: CrmState = {
  role: 'Master',
  currentUser: {
    name: 'Bruna Araujo',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
  },
  mandatoryFields: ['nomeFantasia'],
  companies: mockCompanies,
  leads: mockLeads,
  contacts: mockContacts,
  interactions: mockInteractions,
  customFieldDefs: [{ id: 'cf1', name: 'Concorrente Atual', type: 'text' }],
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
