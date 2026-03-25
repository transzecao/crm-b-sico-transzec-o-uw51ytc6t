import { useState } from 'react'

export function useFinanceCalculator() {
  const [data, setData] = useState({
    weight: 120,
    volume: 0.8,
    cubageFactor: 300,
    nfValue: 5000,
    distance: 150,
    useTda: true,
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

  const cubedWeight = data.volume * data.cubageFactor
  const taxableWeight = Math.max(data.weight, cubedWeight)

  let baseWeightCost = 0
  if (taxableWeight <= 5) baseWeightCost = 50
  else if (taxableWeight <= 10) baseWeightCost = 75
  else if (taxableWeight <= 20) baseWeightCost = 100
  else baseWeightCost = 100 + (taxableWeight - 20) * 2

  const adValorem = data.nfValue * 0.005

  const isHighRisk =
    data.zipCode.startsWith('01') || data.zipCode.startsWith('02') || data.zipCode.startsWith('03')
  const riskLevel = isHighRisk ? 'Alto (Escolta Sugerida)' : 'Padrão'
  const grisBase = data.nfValue * 0.003
  const grisExtra = isHighRisk ? data.nfValue * 0.002 : 0
  const gris = grisBase + grisExtra

  const dispatchFee = 66.08
  const tdaFee = data.useTda ? 45.0 : 0

  const tolls: Record<string, number> = {
    anhanguera: 12.5,
    bandeirantes: 12.4,
    imigrantes: 36.8,
    dutra: 18.2,
  }
  const tollTotal = (tolls[data.route] || 0) * data.axles
  const zmrcFee = data.zmrc ? baseWeightCost * 0.2 : 0

  const totalFracionado =
    baseWeightCost + adValorem + gris + dispatchFee + tdaFee + tollTotal + zmrcFee
  const lotacaoCost = 1200 + data.distance * 4.5
  const isLotacaoBetter = totalFracionado > lotacaoCost

  const originC = data.originCity.toLowerCase().trim()
  const destC = data.destCity.toLowerCase().trim()
  const isSameCity = originC === destC && data.originState === data.destState
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

  return {
    data,
    update,
    cubedWeight,
    taxableWeight,
    baseWeightCost,
    adValorem,
    gris,
    dispatchFee,
    tdaFee,
    tollTotal,
    zmrcFee,
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
