import { useState, useEffect } from 'react'

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

let globalEngineState = {
  draft: JSON.parse(JSON.stringify(initialConfig)),
  published: null as EngineConfig | null,
  isDraftDirty: true,
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

  const updateDraft = (draftUpdate: Partial<EngineConfig>) => {
    updateGlobal({
      draft: { ...globalEngineState.draft, ...draftUpdate },
      isDraftDirty: true,
    })
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

  return { ...state, updateDraft, publishDraft, discardDraft }
}
