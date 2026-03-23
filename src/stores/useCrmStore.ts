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
    cnpj: '08.237.002/0042-89',
    razaoSocial: 'INDUSTRIAL PAULISTA DE METALURGIA LTDA',
    nomeFantasia: 'Ind. Paulista',
    tipoCarga: 'Seca',
    endereco: 'Rua A, 123',
    descricaoNegocio: 'Indústria metalúrgica focada em peças pesadas.',
  },
  {
    id: '2',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Sk Automotive Distribuidora de Autopeças LTDA',
    nomeFantasia: 'Sk Auto',
    tipoCarga: 'Seca',
    endereco: 'Av. Autopeças, 456',
    descricaoNegocio: 'Distribuição de autopeças em grande escala.',
  },
  {
    id: '3',
    cnpj: '30.689.437/0001-45',
    razaoSocial: 'E F METALÚRGICA',
    nomeFantasia: 'EF Met',
    tipoCarga: 'Seca',
    endereco: 'Rodovia Industrial, km 10',
    descricaoNegocio: 'Usinagem e produção de moldes metálicos.',
  },
  {
    id: '4',
    cnpj: '45.123.456/0001-12',
    razaoSocial: 'IMA USINAGEM',
    nomeFantasia: 'IMA Usinagem',
    tipoCarga: 'Seca',
    endereco: 'Rua das Máquinas, 88',
    descricaoNegocio: 'Serviços de precisão e usinagem CNC.',
  },
]

const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
    title: 'INDUSTRIAL PAULISTA DE METALURGIA LTDA',
    pipeline: 'Prospection',
    stage: 'Primeiro contato',
    value: 0,
    owner: 'Bruna Araujo',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    updatedBy: 'Bruna Araujo',
    updatedAt: '23/02/2026 17:29:24',
    createdAt: '23 de fevereiro de 2026',
  },
  {
    id: '2',
    companyId: '2',
    title: 'Sk Automotive Distribuidora de Autopeças LTDA',
    pipeline: 'Prospection',
    stage: '1º contato sem resposta',
    value: 0,
    owner: 'NICOLY',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    updatedBy: 'NICOLY',
    updatedAt: '05/03/2026 15:59:05',
    createdAt: '24 de fevereiro de 2026',
  },
  {
    id: '3',
    companyId: '3',
    title: 'E F METALÚRGICA',
    pipeline: 'Prospection',
    stage: 'Qualificação',
    value: 0,
    owner: 'NICOLY',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    updatedBy: 'NICOLY',
    updatedAt: '17/03/2026 16:10:08',
    createdAt: '16 de março de 2026',
  },
  {
    id: '4',
    companyId: '4',
    title: 'IMA USINAGEM',
    pipeline: 'Prospection',
    stage: 'Negociação',
    value: 15000,
    owner: 'NICOLY',
    ownerAvatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    updatedBy: 'NICOLY',
    updatedAt: '18/03/2026 10:00:00',
    createdAt: '18 de março de 2026',
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
