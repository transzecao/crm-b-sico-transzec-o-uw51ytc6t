import { useState, useEffect } from 'react'

// LEGACY TYPES
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
]
const initialConfig: EngineConfig = {
  modules: defaultModules,
  fields: defaultFields,
  rules: [],
}

// STACKABLE ENGINE TYPES
export type InternalQuote = {
  id: string
  date: string
  time: string
  customerCnpj: string
  employeeName: string
  department: string
  originalValue: number
  discountValue: number
  finalValue: number
}

export type StackableRule = {
  id: string
  name: string
  isActive: boolean
  trigger: 'nfValue' | 'weight' | 'fixed'
  minRange: number
  maxRange: number | null
  type: 'fixed' | 'percentage'
  value: number
  logic: string
}

let globalEngineState = {
  draft: JSON.parse(JSON.stringify(initialConfig)),
  published: JSON.parse(JSON.stringify(initialConfig)) as EngineConfig | null,
  isDraftDirty: true,
  maxDiscountMargin: 10,
  internalQuotes: [] as InternalQuote[],

  stackableRules: [
    {
      id: 'r1',
      name: 'Taxa de Despacho',
      isActive: true,
      trigger: 'fixed',
      minRange: 0,
      maxRange: null,
      type: 'fixed',
      value: 66.08,
      logic: 'Taxa fixa administrativa aplicada a todos os envios de forma incondicional.',
    },
    {
      id: 'r2',
      name: 'GRIS (Baixo Risco)',
      isActive: true,
      trigger: 'nfValue',
      minRange: 0,
      maxRange: 3000,
      type: 'percentage',
      value: 0.3,
      logic: 'Taxa de gerenciamento de risco para mercadorias de até R$ 3.000,00.',
    },
    {
      id: 'r3',
      name: 'Ad Valorem',
      isActive: true,
      trigger: 'nfValue',
      minRange: 3000.01,
      maxRange: null,
      type: 'percentage',
      value: 0.5,
      logic:
        'Taxa de proteção sobre o valor da mercadoria (seguro extra) para notas acima de R$ 3k.',
    },
    {
      id: 'r4',
      name: 'Excesso de Peso',
      isActive: false,
      trigger: 'weight',
      minRange: 100,
      maxRange: null,
      type: 'fixed',
      value: 50,
      logic: 'Taxa extra (R$ 50 fixo) aplicada quando a carga bruta ultrapassa os 100 Kg.',
    },
    {
      id: 'r5',
      name: 'TDE (Taxa de Dificuldade de Entrega)',
      isActive: true,
      trigger: 'nfValue',
      minRange: 0,
      maxRange: null,
      type: 'percentage',
      value: 0.5,
      logic: 'Taxa aplicada para locais de difícil acesso (TDE).',
    },
  ] as StackableRule[],
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

  // LEGACY
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

  const updateMaxDiscountMargin = (margin: number) => {
    updateGlobal({ maxDiscountMargin: margin })
  }

  const addInternalQuote = (quote: InternalQuote) => {
    updateGlobal({ internalQuotes: [quote, ...globalEngineState.internalQuotes] })
  }

  // STACKABLE ENGINE
  const addRule = (r: StackableRule) => {
    updateGlobal({ stackableRules: [...globalEngineState.stackableRules, r] })
  }
  const updateRule = (id: string, updates: Partial<StackableRule>) => {
    updateGlobal({
      stackableRules: globalEngineState.stackableRules.map((r) =>
        r.id === id ? { ...r, ...updates } : r,
      ),
    })
  }
  const deleteRule = (id: string) => {
    updateGlobal({ stackableRules: globalEngineState.stackableRules.filter((r) => r.id !== id) })
  }
  const duplicateRule = (id: string) => {
    const rule = globalEngineState.stackableRules.find((r) => r.id === id)
    if (rule) {
      addRule({ ...rule, id: `rule-${Date.now()}`, name: `${rule.name} (Cópia)` })
    }
  }

  // Legacy fallbacks
  const variables: any[] = []
  const rules: any[] = []
  const addVariable = () => {}
  const updateVariable = () => {}
  const deleteVariable = () => {}

  return {
    ...state,
    updateMaxDiscountMargin,
    addInternalQuote,
    updateDraft,
    publishDraft,
    discardDraft,
    stackableRules: state.stackableRules,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    variables,
    rules,
    addVariable,
    updateVariable,
    deleteVariable,
  }
}
