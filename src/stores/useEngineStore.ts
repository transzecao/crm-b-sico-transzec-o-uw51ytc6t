import { useState, useEffect } from 'react'

// LEGACY TYPES (Kept for compatibility with other files)
export type FieldType = 'currency' | 'percentage' | 'number'
export type DynamicField = {
  id: string
  name: string
  type: FieldType
  moduleId: string
  defaultValue: number
}
export type TieredRule = {
  id: string
  moduleId: string
  basedOn: 'weight' | 'nfValue' | 'distance'
  min: number
  max: number | null
  value: number
  isPercentage: boolean
}
export type EngineModule = {
  id: string
  name: string
  isActive: boolean
  isBuiltIn: boolean
}
export type EngineConfig = {
  modules: EngineModule[]
  fields: DynamicField[]
  rules: TieredRule[]
}

const defaultModules: EngineModule[] = [
  { id: 'frete-peso', name: 'Frete Peso', isActive: true, isBuiltIn: true },
  { id: 'frete-valor', name: 'Frete Valor', isActive: true, isBuiltIn: true },
  { id: 'gris', name: 'GRIS', isActive: true, isBuiltIn: true },
  { id: 'despacho', name: 'Despacho', isActive: true, isBuiltIn: true },
  { id: 'zmrc', name: 'ZMRC', isActive: true, isBuiltIn: true },
]
const defaultFields: DynamicField[] = [
  {
    id: 'peso-base',
    name: 'Frete Peso Base (R$)',
    type: 'currency',
    moduleId: 'frete-peso',
    defaultValue: 1.5,
  },
  {
    id: 'frete-valor-taxa',
    name: 'Frete Valor (Taxa %)',
    type: 'percentage',
    moduleId: 'frete-valor',
    defaultValue: 0.5,
  },
  {
    id: 'gris-taxa',
    name: 'GRIS (Taxa %)',
    type: 'percentage',
    moduleId: 'gris',
    defaultValue: 0.3,
  },
  {
    id: 'taxa-despacho',
    name: 'Taxa Despacho (R$)',
    type: 'currency',
    moduleId: 'despacho',
    defaultValue: 66.08,
  },
]
const initialConfig: EngineConfig = {
  modules: defaultModules,
  fields: defaultFields,
  rules: [],
}

// NEW TYPES FOR DYNAMIC ENGINE
export type ShippingVariable = {
  id: string
  name: string
  type: 'fixed' | 'percentage'
  value: number
  isActive: boolean
}

export type ShippingRule = {
  id: string
  name: string
  isActive: boolean
  minNfValue: number
  maxNfValue: number | null
  type: 'fixed' | 'percentage'
  value: number
  logic: string
}

let globalEngineState = {
  draft: JSON.parse(JSON.stringify(initialConfig)),
  published: JSON.parse(JSON.stringify(initialConfig)) as EngineConfig | null,
  isDraftDirty: true,

  // NEW STATE
  variables: [
    { id: 'v1', name: 'Taxa de Despacho', type: 'fixed', value: 66.08, isActive: true },
    { id: 'v2', name: 'GRIS', type: 'percentage', value: 0.3, isActive: true },
    { id: 'v3', name: 'Pedágio Fixo', type: 'fixed', value: 15.0, isActive: false },
  ] as ShippingVariable[],

  rules: [
    {
      id: 'r1',
      name: 'Faixa NF Baixa',
      isActive: true,
      minNfValue: 0,
      maxNfValue: 3000,
      type: 'percentage',
      value: 1.5,
      logic: 'Aplicar taxa de seguro mínima para notas de baixo valor.',
    },
    {
      id: 'r2',
      name: 'Faixa NF Média',
      isActive: true,
      minNfValue: 3000.01,
      maxNfValue: 5000,
      type: 'percentage',
      value: 1.2,
      logic: 'Reduzir % para incentivar envios de maior valor.',
    },
    {
      id: 'r3',
      name: 'Taxa Emergencial',
      isActive: false,
      minNfValue: 0,
      maxNfValue: null,
      type: 'fixed',
      value: 50,
      logic: 'Taxa extra para coletas no mesmo dia (Desativada).',
    },
  ] as ShippingRule[],
}

const listeners = new Set<(state: typeof globalEngineState) => void>()

export function useEngineStore() {
  const [state, setState] = useState(globalEngineState)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const updateGlobal = (newState: Partial<typeof globalEngineState>) => {
    globalEngineState = { ...globalEngineState, ...newState }
    listeners.forEach((l) => l(globalEngineState))
  }

  // LEGACY METHODS
  const updateDraft = (draftUpdate: Partial<EngineConfig>) => {
    updateGlobal({ draft: { ...globalEngineState.draft, ...draftUpdate }, isDraftDirty: true })
  }
  const publishDraft = () => {
    updateGlobal({
      published: JSON.parse(JSON.stringify(globalEngineState.draft)),
      isDraftDirty: false,
    })
  }
  const discardDraft = () => {
    updateGlobal({
      draft: JSON.parse(JSON.stringify(globalEngineState.published || initialConfig)),
      isDraftDirty: false,
    })
  }

  // NEW DYNAMIC ENGINE METHODS
  const addVariable = (v: ShippingVariable) => {
    updateGlobal({ variables: [...globalEngineState.variables, v] })
  }
  const updateVariable = (id: string, updates: Partial<ShippingVariable>) => {
    updateGlobal({
      variables: globalEngineState.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    })
  }
  const deleteVariable = (id: string) => {
    updateGlobal({ variables: globalEngineState.variables.filter((v) => v.id !== id) })
  }

  const addRule = (r: ShippingRule) => {
    updateGlobal({ rules: [...globalEngineState.rules, r] })
  }
  const updateRule = (id: string, updates: Partial<ShippingRule>) => {
    updateGlobal({
      rules: globalEngineState.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })
  }
  const deleteRule = (id: string) => {
    updateGlobal({ rules: globalEngineState.rules.filter((r) => r.id !== id) })
  }

  return {
    ...state,
    updateDraft,
    publishDraft,
    discardDraft,
    addVariable,
    updateVariable,
    deleteVariable,
    addRule,
    updateRule,
    deleteRule,
  }
}
