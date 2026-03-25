import { useState } from 'react'

export function useFinanceCalculator() {
  const [data, setData] = useState({
    weight: 120,
    volume: 0.8,
    cubageFactor: 300,
    distance: 150,
    nfValue: 5000,

    // Formula Inputs (Rates per kg or fixed)
    weightFreight: 1.5,
    valueFreightPercent: 0.5,
    grisPercent: 0.3,
    dispatchFee: 66.08,

    // Toggles
    useCubing: true,
    useTolls: true,
    useTas: false,

    // UI/Map
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
    totalDel: 150,
    onTime: 142,
    stdCost: 18000,
    negCost: 15500,
    reDeliveryCost: 450,
  })

  const update = (updates: Partial<typeof data>) => setData((prev) => ({ ...prev, ...updates }))

  // Calculate Taxable Weight: Max(Real Weight, Cubed Weight)
  const cubedWeight = data.useCubing ? data.volume * data.cubageFactor : 0
  const taxableWeight = Math.max(data.weight, cubedWeight)

  // Freight Items (As specified in the AC: Additive factors per unit)
  const weightFreightTotal = data.weightFreight
  const valueFreightTotal = data.valueFreightPercent // treated as rate per unit based on AC
  const grisTotal = data.grisPercent // treated as rate per unit based on AC
  const dispatchFeeTotal = data.dispatchFee

  // Final Value Formula from AC: (Frete Peso + Frete Valor + GRIS + Taxa de Despacho) * Taxable Weight
  const finalValue =
    (weightFreightTotal + valueFreightTotal + grisTotal + dispatchFeeTotal) * taxableWeight

  // Additional fees
  const tolls: Record<string, number> = {
    anhanguera: 12.5,
    bandeirantes: 12.4,
    imigrantes: 36.8,
    dutra: 18.2,
  }
  const tollTotal = data.useTolls ? (tolls[data.route] || 0) * data.axles : 0
  const tasFee = data.useTas ? 45.0 : 0
  const zmrcFee = data.zmrc ? finalValue * 0.2 : 0

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
    data,
    update,
    cubedWeight,
    taxableWeight,
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
