import { useState, useEffect } from 'react'
import { useEngineStore, StackableRule } from '@/stores/useEngineStore'

export function useFinanceCalculator() {
  const { published, stackableRules } = useEngineStore()

  const [data, setData] = useState(() => {
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
      manualOverrideReason: '' as string,
      baseCost: 1000,
      customerCnpj: '',
      discountPercentage: 0,
    }
  })

  useEffect(() => {
    // Kept to not break the linter
  }, [published])

  const update = (updates: Partial<typeof data>) => setData((prev) => ({ ...prev, ...updates }))

  const isPublished = !!published

  const cubedWeight = data.useCubing ? data.volume * data.cubageFactor : 0
  const taxableWeight = Math.max(data.weight, cubedWeight)

  let tollTotal = 0
  let tasFee = 0
  let zmrcFee = 0

  let rulesSum = 0
  const appliedRules: Array<StackableRule & { calculatedValue: number }> = []
  const ignoredRules: Array<StackableRule & { reason: string }> = []

  stackableRules.forEach((r) => {
    if (!r.isActive) {
      ignoredRules.push({ ...r, reason: 'Regra Desativada' })
      return
    }

    const triggerValue =
      r.trigger === 'nfValue' ? data.nfValue : r.trigger === 'weight' ? data.weight : 0

    if (r.trigger !== 'fixed') {
      const minMatch = triggerValue >= r.minRange
      const maxMatch = r.maxRange === null || triggerValue <= r.maxRange
      if (!minMatch || !maxMatch) {
        ignoredRules.push({ ...r, reason: 'Fora da Faixa de Atuação' })
        return
      }
    }

    let calculatedValue = 0
    if (r.type === 'fixed') {
      calculatedValue = r.value
    } else if (r.type === 'percentage') {
      const baseVal =
        r.trigger === 'nfValue'
          ? data.nfValue
          : r.trigger === 'weight'
            ? data.weight
            : data.baseCost
      calculatedValue = (baseVal * r.value) / 100
    }

    rulesSum += calculatedValue
    appliedRules.push({ ...r, calculatedValue })
  })

  const calculatedOriginalValue = data.baseCost + rulesSum
  const discountValue = (calculatedOriginalValue * data.discountPercentage) / 100
  const calculatedFinalValue = calculatedOriginalValue - discountValue

  const finalValue =
    data.manualOverrideFinalValue !== null ? data.manualOverrideFinalValue : calculatedFinalValue

  const totalFracionado = finalValue
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
    calculatedOriginalValue,
    discountValue,
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
    rulesSum,
    appliedRules,
    ignoredRules,

    // Legacy fallbacks for old tabs that might depend on them
    activeVars: [],
    activeRules: [],
    fixedSum: 0,
    percentageSum: 0,
  }
}
