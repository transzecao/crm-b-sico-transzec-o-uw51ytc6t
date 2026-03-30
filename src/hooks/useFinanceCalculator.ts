import { useState, useEffect } from 'react'
import { useEngineStore } from '@/stores/useEngineStore'

export function useFinanceCalculator() {
  const { published, variables } = useEngineStore()

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
      baseCost: 1000,
    }
  })

  useEffect(() => {
    // Kept to not break the linter or any other legacy hooks running
  }, [published])

  const update = (updates: Partial<typeof data>) => setData((prev) => ({ ...prev, ...updates }))

  const isPublished = !!published

  const cubedWeight = data.useCubing ? data.volume * data.cubageFactor : 0
  const taxableWeight = Math.max(data.weight, cubedWeight)

  let tollTotal = 0
  let tasFee = 0
  let zmrcFee = 0

  let fixedSum = 0
  let percentageSum = 0
  const activeVars = variables.filter((v) => v.isActive)

  activeVars.forEach((v) => {
    if (v.type === 'fixed') {
      fixedSum += v.value
    } else if (v.type === 'percentage') {
      percentageSum += (data.baseCost * v.value) / 100
    }
  })

  const calculatedFinalValue = data.baseCost + fixedSum + percentageSum

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
    fixedSum,
    percentageSum,
    activeVars,
  }
}
