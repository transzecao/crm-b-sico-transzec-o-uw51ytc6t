import { useState, useEffect } from 'react'
import { useEngineStore } from '@/stores/useEngineStore'

export function useFinanceCalculator() {
  const { published } = useEngineStore()

  const [data, setData] = useState(() => {
    const dynamicData: Record<string, number> = {}
    if (published) {
      published.fields.forEach((f) => {
        dynamicData[f.id] = f.defaultValue
      })
    } else {
      dynamicData['peso-base'] = 1.5
      dynamicData['frete-valor-taxa'] = 0.5
      dynamicData['gris-taxa'] = 0.3
      dynamicData['taxa-despacho'] = 66.08
    }

    return {
      weight: 120,
      volume: 0.8,
      cubageFactor: 300,
      distance: 150,
      nfValue: 5000,

      useCubing: true,
      useTolls: true,
      useTas: false,

      route: 'bandeirantes',
      axles: 2,
      zmrc: false,
      spRegion: 'Centro',
      rodizio: false,
      originState: 'SP',
      destState: 'SP',
      originCity: 'São Paulo',
      destCity: 'São Paulo',
      ciot: '123456789012',
      rntrc: '12345678',
      ediCode: '01',
      ncm: '3808',
      zipCode: '01000-000',

      manualOverrideFinalValue: null as number | null,
      ...dynamicData,
    }
  })

  useEffect(() => {
    if (published) {
      setData((prev) => {
        const next = { ...prev }
        let changed = false
        published.fields.forEach((f) => {
          if (next[f.id] === undefined) {
            next[f.id] = f.defaultValue
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
  }, [published])

  const update = (updates: Partial<typeof data>) => setData((prev) => ({ ...prev, ...updates }))

  const isPublished = !!published

  const cubedWeight = data.useCubing ? data.volume * data.cubageFactor : 0
  const taxableWeight = Math.max(data.weight, cubedWeight)

  let calculatedFinalValue = 0
  let tollTotal = 0
  let tasFee = 0
  let zmrcFee = 0

  if (isPublished) {
    const isModuleActive = (id: string) =>
      published.modules.find((m) => m.id === id)?.isActive ?? false

    const getRuleValue = (moduleId: string, baseValue: number, fallbackFieldId: string) => {
      const rules = published.rules.filter((r) => r.moduleId === moduleId)
      let appliedRule = null
      for (const rule of rules) {
        const min = rule.min
        const max = rule.max === null ? Infinity : rule.max
        let compareValue = taxableWeight
        if (rule.basedOn === 'nfValue') compareValue = data.nfValue
        if (rule.basedOn === 'distance') compareValue = data.distance

        if (compareValue >= min && compareValue <= max) {
          appliedRule = rule
          break
        }
      }

      if (appliedRule) {
        return appliedRule.value
      }
      return data[fallbackFieldId] || 0
    }

    let weightFreightTotal = 0
    let valueFreightTotal = 0
    let grisTotal = 0
    let dispatchFeeTotal = 0
    let customModulesTotal = 0

    if (isModuleActive('frete-peso')) {
      weightFreightTotal = getRuleValue('frete-peso', taxableWeight, 'peso-base')
    }
    if (isModuleActive('frete-valor')) {
      valueFreightTotal = getRuleValue('frete-valor', data.nfValue, 'frete-valor-taxa')
    }
    if (isModuleActive('gris')) {
      grisTotal = getRuleValue('gris', data.nfValue, 'gris-taxa')
    }
    if (isModuleActive('despacho')) {
      dispatchFeeTotal = getRuleValue('despacho', 1, 'taxa-despacho')
    }

    published.modules
      .filter((m) => !m.isBuiltIn && m.isActive)
      .forEach((m) => {
        const field = published.fields.find((f) => f.moduleId === m.id)
        if (field) {
          customModulesTotal += data[field.id] || 0
        }
      })

    calculatedFinalValue =
      (weightFreightTotal + valueFreightTotal + grisTotal + dispatchFeeTotal + customModulesTotal) *
      taxableWeight

    const tolls: Record<string, number> = {
      anhanguera: 12.5,
      bandeirantes: 12.4,
      imigrantes: 36.8,
      dutra: 18.2,
    }
    tollTotal = data.useTolls ? (tolls[data.route] || 0) * data.axles : 0
    tasFee = data.useTas ? 45.0 : 0
    zmrcFee = data.zmrc && isModuleActive('zmrc') ? calculatedFinalValue * 0.2 : 0
  }

  const finalValue =
    data.manualOverrideFinalValue !== null ? data.manualOverrideFinalValue : calculatedFinalValue
  const totalFracionado = finalValue + tollTotal + tasFee + zmrcFee

  const lotacaoCost = 1200 + data.distance * 4.5
  const isLotacaoBetter = totalFracionado > lotacaoCost

  const isSameCity =
    data.originCity.toLowerCase() === data.destCity.toLowerCase() &&
    data.originState === data.destState
  const issRate = isSameCity ? 5 : 0
  const icmsRate =
    data.originState === 'SP' && data.destState === 'SP' && !isSameCity ? 12 : isSameCity ? 0 : 7

  const taxValue = totalFracionado * ((issRate || icmsRate) / 100)
  const anttFloor = data.distance * data.axles * 1.5
  const isAnttCompliant = totalFracionado >= anttFloor

  const baseHours = Math.ceil(data.distance / 60)
  const transitTime = baseHours + (data.rodizio ? 24 : 0)

  const isCiotValid = data.ciot.replace(/\D/g, '').length === 12
  const isRntrcValid = data.rntrc.replace(/\D/g, '').length === 8

  const isHighRisk =
    data.zipCode.startsWith('01') || data.zipCode.startsWith('02') || data.zipCode.startsWith('03')
  const riskLevel = isHighRisk ? 'Alto (Escolta Sugerida)' : 'Padrão'

  return {
    isPublished,
    data,
    update,
    cubedWeight,
    taxableWeight,
    calculatedFinalValue,
    finalValue,
    tollTotal,
    zmrcFee,
    tasFee,
    totalFracionado,
    lotacaoCost,
    isLotacaoBetter,
    isSameCity,
    issRate,
    icmsRate,
    taxValue,
    anttFloor,
    isAnttCompliant,
    riskLevel,
    transitTime,
    isCiotValid,
    isRntrcValid,
  }
}
