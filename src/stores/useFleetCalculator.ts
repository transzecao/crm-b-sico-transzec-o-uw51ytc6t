import { useState, useEffect } from 'react'
import { getFleetSettings } from '@/services/fleet_costs'
import { isValidCpf, isValidPlate } from '@/utils/formatters'

export interface DriverEncargos {
  fgts: number
  ferias: number
  decimo: number
  pis: number
}

export interface Driver {
  id: string
  name: string
  cpf: string
  cnh: 'D' | 'E'
  baseSalary: number
  periculosidade: boolean
  vrDaily: number
  vtMensal: number
  cestaBasica: number
  seguroVida: number
  toxAnual: number
  rat: number
  encargos: DriverEncargos
}

export interface VehicleBreakdownOverrides {
  depreciation?: number
  diesel?: number
  tires?: number
}

export interface Vehicle {
  id: string
  plate: string
  model: string
  year: number
  type: 'Baú' | 'Plataforma' | 'Graneleiro'
  purchaseValue: number
  resaleValue: number
  ipva: number
  licenciamento: number
  seguroCasco: number
  rctrc: number
  rcfdc: number
  consumo: number
  dieselPrice: number
  pneusJogo: number
  kmPneus: number
  manutencao: number
  usaArla: boolean
  limpeza: number
  averbacao: number
  consulta: number
  satelite: number
  estimatedKm: number
  overrides: VehicleBreakdownOverrides
}

export interface Link {
  id: string
  driverId: string
  vehicleId: string
  km: number
}

export interface HQ {
  iptu: number
  aluguel: number
  agua: number
  luz: number
  internet: number
  telefone: number
  avcb: number
  seguroPatrimonial: number
  docas: number
}

export interface Taxes {
  targetMargin: number
  dasRate: number
  useFaixa: boolean
  faixa: string
  cteCost: number
  docsCount: number
  taxasFiscal: number
  deadKm: number
}

export interface Settings {
  workingDays: number
  maxCpk: number
  minMargin: number
  yellowMargin: number
  maxDas: number
  varCostMaxPercent?: number
  defaultFgts: number
  defaultDecimo: number
  defaultFerias: number
  defaultPis: number
}

export interface AlertData {
  id: string
  type: 'success' | 'warning' | 'critical' | 'info' | 'error'
  title: string
  message: string
}

export interface FleetState {
  drivers: Driver[]
  vehicles: Vehicle[]
  links: Link[]
  hq: HQ
  taxes: Taxes
  settings: Settings
}

export const createDriver = (settings?: Settings): Driver => {
  const baseSalary = 2500
  const s =
    settings ||
    ({
      defaultFgts: 8,
      defaultDecimo: 8.33,
      defaultFerias: 11.11,
      defaultPis: 1,
    } as Settings)

  return {
    id: `MOT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    name: '',
    cpf: '',
    cnh: 'D',
    baseSalary,
    periculosidade: false,
    vrDaily: 30,
    vtMensal: 0,
    cestaBasica: 150,
    seguroVida: 50,
    toxAnual: 120,
    rat: 1,
    encargos: {
      fgts: baseSalary * ((s.defaultFgts || 8) / 100),
      ferias: baseSalary * ((s.defaultFerias || 11.11) / 100),
      decimo: baseSalary * ((s.defaultDecimo || 8.33) / 100),
      pis: baseSalary * ((s.defaultPis || 1) / 100),
    },
  }
}

export const createVehicle = (): Vehicle => ({
  id: `VEI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  plate: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'Baú',
  purchaseValue: 150000,
  resaleValue: 90000,
  ipva: 2400,
  licenciamento: 500,
  seguroCasco: 3600,
  rctrc: 1200,
  rcfdc: 1000,
  consumo: 5,
  dieselPrice: 6.2,
  pneusJogo: 6000,
  kmPneus: 200000,
  manutencao: 500,
  usaArla: false,
  limpeza: 200,
  averbacao: 300,
  consulta: 100,
  satelite: 150,
  estimatedKm: 10000,
  overrides: {},
})

const defaultInitialState: FleetState = {
  drivers: [],
  vehicles: [],
  links: [],
  hq: {
    iptu: 6000,
    aluguel: 2000,
    agua: 300,
    luz: 800,
    internet: 200,
    telefone: 150,
    avcb: 500,
    seguroPatrimonial: 1200,
    docas: 300,
  },
  taxes: {
    targetMargin: 30,
    dasRate: 12,
    useFaixa: false,
    faixa: 'Faixa 1',
    cteCost: 2,
    docsCount: 200,
    taxasFiscal: 1000,
    deadKm: 100,
  },
  settings: {
    workingDays: 22,
    maxCpk: 4.5,
    minMargin: 15,
    yellowMargin: 25,
    maxDas: 20,
    defaultFgts: 8,
    defaultDecimo: 8.33,
    defaultFerias: 11.11,
    defaultPis: 1,
  },
}

const STORAGE_KEY = 'fleet_calc_state'

let globalState = defaultInitialState
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      globalState = { ...defaultInitialState, ...parsed }

      globalState.drivers = globalState.drivers.map((d) => {
        const e = d.encargos || { fgts: 8, ferias: 11.11, decimo: 8.33, pis: 1 }
        let newE = { ...e }
        if (newE.fgts <= 20) newE.fgts = (d.baseSalary || 2500) * (e.fgts / 100)
        if (newE.ferias <= 20) newE.ferias = (d.baseSalary || 2500) * (e.ferias / 100)
        if (newE.decimo <= 20) newE.decimo = (d.baseSalary || 2500) * (e.decimo / 100)
        if (newE.pis <= 5) newE.pis = (d.baseSalary || 2500) * (e.pis / 100)
        return { ...d, encargos: newE }
      })

      globalState.vehicles = globalState.vehicles.map((v) => ({
        ...v,
        estimatedKm: v.estimatedKm || 10000,
        overrides: v.overrides || {},
      }))
    } else {
      globalState.drivers = [createDriver(globalState.settings)]
      globalState.vehicles = [createVehicle()]
    }
  } catch (e) {
    console.error('Failed to load fleet calc state', e)
    globalState.drivers = [createDriver(globalState.settings)]
    globalState.vehicles = [createVehicle()]
  }
}

const listeners = new Set<(state: FleetState) => void>()

const updateGlobal = (updates: Partial<FleetState>) => {
  globalState = { ...globalState, ...updates }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState))
  }
  listeners.forEach((l) => l(globalState))
}

const validarDadosCompletos = (s: FleetState): string[] => {
  const errors: string[] = []
  if (s.drivers.length === 0) errors.push('Adicione pelo menos 1 motorista.')
  if (s.vehicles.length === 0) errors.push('Adicione pelo menos 1 veículo.')
  if (s.links.length === 0) errors.push('Adicione pelo menos 1 vínculo.')

  s.drivers.forEach((d, i) => {
    if (!d.name) errors.push(`Motorista ${i + 1}: Nome obrigatório.`)
    if (d.cpf && !isValidCpf(d.cpf)) errors.push(`Motorista ${i + 1}: CPF inválido.`)
    if (d.baseSalary <= 0) errors.push(`Motorista ${i + 1}: Salário Base deve ser maior que zero.`)
  })

  s.vehicles.forEach((v, i) => {
    if (v.plate && !isValidPlate(v.plate)) errors.push(`Veículo ${i + 1}: Placa inválida.`)
    if (v.purchaseValue <= 0) errors.push(`Veículo ${i + 1}: Valor de Compra inválido.`)
    if (v.resaleValue < 0) errors.push(`Veículo ${i + 1}: Valor de Revenda inválido.`)
    if (v.consumo < 1 || v.consumo > 20)
      errors.push(`Veículo ${i + 1}: Consumo deve estar entre 1 e 20 km/L.`)
    if (v.kmPneus < 5000 || v.kmPneus > 500000)
      errors.push(`Veículo ${i + 1}: KM Pneus estimado deve estar entre 5k e 500k.`)
  })

  if (s.hq.iptu < 0) errors.push('Sede: IPTU obrigatório ou inválido.')
  if (s.hq.aluguel < 0) errors.push('Sede: Aluguel obrigatório ou inválido.')
  if (s.taxes.dasRate < 0) errors.push('Impostos: Alíquota DAS inválida.')

  const totalKm = s.links.reduce((acc, l) => acc + l.km, 0)
  if (s.links.length > 0 && totalKm <= 0) {
    errors.push('O KM total mensal rodado deve ser maior que zero (Alerta Vermelho).')
  }

  return errors
}

const calcularCustoMotorista = (d: Driver, workingDays: number): number => {
  const base = d.baseSalary + (d.periculosidade ? d.baseSalary * 0.3 : 0)
  const e = d.encargos || { fgts: 0, ferias: 0, decimo: 0, pis: 0 }

  const fgts = e.fgts || 0
  const decimoTerceiro = e.decimo || 0
  const ferias = e.ferias || 0
  const pis = e.pis || 0
  const ratVal = base * (d.rat / 100)
  const vrTotal = d.vrDaily * workingDays
  const toxAnualMensal = d.toxAnual / 12

  return (
    base +
    fgts +
    decimoTerceiro +
    ferias +
    pis +
    ratVal +
    vrTotal +
    d.vtMensal +
    d.cestaBasica +
    d.seguroVida +
    toxAnualMensal
  )
}

const calcularCustoVeiculo = (v: Vehicle, linkedKm: number) => {
  const effectiveKm = linkedKm > 0 ? linkedKm : v.estimatedKm || 10000

  const autoDep = Math.max(0, (v.purchaseValue - v.resaleValue) / 60)
  const dep = v.overrides?.depreciation !== undefined ? v.overrides.depreciation : autoDep

  const fixed = (v.ipva + v.licenciamento + v.seguroCasco + v.rctrc + v.rcfdc) / 12
  const insurance = (v.seguroCasco + v.rctrc + v.rcfdc) / 12

  const autoDiesel = effectiveKm > 0 ? (effectiveKm / v.consumo) * v.dieselPrice : 0
  const diesel = v.overrides?.diesel !== undefined ? v.overrides.diesel : autoDiesel

  const autoArla = v.usaArla ? autoDiesel * 0.05 : 0
  const arla = v.usaArla
    ? v.overrides?.diesel !== undefined
      ? v.overrides.diesel * 0.05
      : autoArla
    : 0

  const autoPneus = effectiveKm > 0 ? (v.pneusJogo / v.kmPneus) * effectiveKm : 0
  const pneus = v.overrides?.tires !== undefined ? v.overrides.tires : autoPneus

  const monthlyOps = v.manutencao + v.limpeza + v.averbacao + v.consulta + v.satelite

  const variable = diesel + arla + pneus + monthlyOps
  const total = dep + fixed + variable

  return { total, variable, dep, fixed, insurance, diesel, pneus, monthlyOps }
}

const calcularCustoSedeTotal = (hq: HQ): number => {
  return (
    (hq.iptu + hq.avcb + hq.seguroPatrimonial) / 12 +
    hq.aluguel +
    hq.agua +
    hq.luz +
    hq.internet +
    hq.telefone +
    hq.docas
  )
}

const calcularCPK = (s: FleetState) => {
  const errors = validarDadosCompletos(s)
  const workingDays = s.settings.workingDays || 22

  const vehicleKms: Record<string, number> = {}
  let totalKm = 0
  s.links.forEach((l) => {
    vehicleKms[l.vehicleId] = (vehicleKms[l.vehicleId] || 0) + l.km
    totalKm += l.km
  })

  const driverTotal = s.drivers.reduce((acc, d) => acc + calcularCustoMotorista(d, workingDays), 0)

  let vehicleTotal = 0
  let totalVariableCosts = 0
  let vehicleDepreciationTotal = 0
  let vehicleInsuranceTotal = 0
  let vehicleDieselTotal = 0
  let vehicleTiresTotal = 0

  s.vehicles.forEach((v) => {
    const cost = calcularCustoVeiculo(v, vehicleKms[v.id] || 0)
    vehicleTotal += cost.total
    totalVariableCosts += cost.variable
    vehicleDepreciationTotal += cost.dep
    vehicleInsuranceTotal += cost.insurance
    vehicleDieselTotal += cost.diesel
    vehicleTiresTotal += cost.pneus
  })

  const hqTotal = calcularCustoSedeTotal(s.hq)
  const hqPerLink = s.links.length > 0 ? hqTotal / s.links.length : 0

  const baseTaxes = s.taxes.cteCost * s.taxes.docsCount + s.taxes.taxasFiscal / 12
  const totalBaseCost = driverTotal + vehicleTotal + hqTotal + baseTaxes

  const targetMargin = Math.max(0, Math.min(99, s.taxes.targetMargin || 30))
  const faturamento = totalBaseCost / (1 - targetMargin / 100)
  const dasCost = faturamento * (s.taxes.dasRate / 100)

  const baseCostWithDas = totalBaseCost + dasCost
  const baseCpk = totalKm > 0 ? baseCostWithDas / totalKm : 0

  const deadKmCost = s.taxes.deadKm * baseCpk
  const finalTotalCost = baseCostWithDas + deadKmCost
  const finalCpk = totalKm > 0 ? finalTotalCost / totalKm : 0

  const currentMargin = faturamento > 0 ? ((faturamento - finalTotalCost) / faturamento) * 100 : 0

  let cpkStatus = 'green'
  if (finalCpk > s.settings.maxCpk) cpkStatus = 'red'
  else if (finalCpk > s.settings.maxCpk * 0.9) cpkStatus = 'yellow'

  let marginStatus = 'green'
  if (currentMargin < s.settings.minMargin) marginStatus = 'red'
  else if (currentMargin < s.settings.yellowMargin) marginStatus = 'yellow'

  const alerts: AlertData[] = []

  if (s.links.length === 0) {
    alerts.push({
      id: 'no-links',
      type: 'error',
      title: 'Erro de Dados',
      message: '❌ Nenhum vínculo motorista-veículo criado.',
    })
  }

  if (finalCpk > s.settings.maxCpk) {
    alerts.push({
      id: 'cpk-red',
      type: 'critical',
      title: 'CPK Crítico',
      message: `CPK: R$ ${finalCpk.toFixed(2)}/km (Acima de R$ ${s.settings.maxCpk.toFixed(2)})`,
    })
  } else if (finalCpk > s.settings.maxCpk * 0.9) {
    alerts.push({
      id: 'cpk-yellow',
      type: 'warning',
      title: 'CPK em Alerta',
      message: `CPK: R$ ${finalCpk.toFixed(2)}/km (Próximo ao limite de R$ ${s.settings.maxCpk.toFixed(2)})`,
    })
  } else if (finalCpk > 0) {
    alerts.push({
      id: 'cpk-green',
      type: 'success',
      title: 'CPK Saudável',
      message: `CPK: R$ ${finalCpk.toFixed(2)}/km`,
    })
  }

  if (currentMargin < s.settings.minMargin) {
    alerts.push({
      id: 'margin-red',
      type: 'critical',
      title: 'Margem Crítica',
      message: `Margem: ${currentMargin.toFixed(2)}% (Abaixo de ${s.settings.minMargin}%)`,
    })
  } else if (currentMargin < s.settings.yellowMargin) {
    alerts.push({
      id: 'margin-yellow',
      type: 'warning',
      title: 'Margem em Alerta',
      message: `Margem: ${currentMargin.toFixed(2)}% (Abaixo de ${s.settings.yellowMargin}%)`,
    })
  } else if (currentMargin > 0) {
    alerts.push({
      id: 'margin-green',
      type: 'success',
      title: 'Margem Saudável',
      message: `Margem: ${currentMargin.toFixed(2)}%`,
    })
  }

  const varCostPercent = finalTotalCost > 0 ? (totalVariableCosts / finalTotalCost) * 100 : 0
  const varCostLimit = s.settings.varCostMaxPercent || 60
  if (varCostPercent > varCostLimit) {
    alerts.push({
      id: 'var-red',
      type: 'critical',
      title: 'Custos Variáveis Altos',
      message: `Custos Variáveis representam ${varCostPercent.toFixed(2)}% do custo total`,
    })
  } else if (varCostPercent > varCostLimit * 0.8) {
    alerts.push({
      id: 'var-yellow',
      type: 'warning',
      title: 'Custos Variáveis em Alerta',
      message: `Custos Variáveis representam ${varCostPercent.toFixed(2)}% do custo total`,
    })
  }

  const maxDas = s.settings.maxDas || 20
  const dasPercent = faturamento > 0 ? (dasCost / faturamento) * 100 : 0
  if (dasPercent > maxDas) {
    alerts.push({
      id: 'das-red',
      type: 'critical',
      title: 'DAS Crítico',
      message: `DAS: ${dasPercent.toFixed(2)}% do faturamento`,
    })
  } else if (dasPercent > maxDas * 0.8) {
    alerts.push({
      id: 'das-yellow',
      type: 'warning',
      title: 'DAS em Alerta',
      message: `DAS: ${dasPercent.toFixed(2)}% do faturamento`,
    })
  }

  if (typeof window !== 'undefined') {
    const resultToSave = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      cpk: finalCpk,
      margin: currentMargin,
      faturamento,
      dasCost,
      dasPercent,
      costs: {
        drivers: driverTotal,
        hq: hqTotal,
        structuralTaxes: baseTaxes,
        depreciation: vehicleDepreciationTotal,
        insurance: vehicleInsuranceTotal,
        diesel: vehicleDieselTotal,
        tires: vehicleTiresTotal,
        deadKm: deadKmCost,
        otherVariable:
          totalVariableCosts - vehicleDieselTotal - vehicleTiresTotal - vehicleInsuranceTotal,
      },
      fullState: {
        drivers: s.drivers,
        vehicles: s.vehicles,
        settings: s.settings,
        taxes: s.taxes,
      },
    }

    localStorage.setItem('ultimoResultadoCPK', JSON.stringify(resultToSave))
  }

  return {
    errors,
    alerts,
    totalKm,
    driverTotal,
    vehicleTotal,
    hqTotal,
    hqPerLink,
    baseTaxes,
    totalBaseCost,
    faturamento,
    dasCost,
    baseCpk,
    deadKmCost,
    finalTotalCost,
    finalCpk,
    currentMargin,
    cpkStatus,
    marginStatus,
    dataCalculo: new Date().toISOString(),
  }
}

export function useFleetCalculator() {
  const [state, setState] = useState(globalState)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getFleetSettings()
      if (settings) {
        updateSettings({
          maxCpk: settings.max_cpk,
          minMargin: settings.min_margin,
          yellowMargin: settings.yellow_margin,
          maxDas: settings.max_das,
          workingDays: settings.working_days,
          varCostMaxPercent: settings.var_cost_max_percent || 60,
          defaultFgts: settings.default_fgts || 8,
          defaultDecimo: settings.default_decimo || 8.33,
          defaultFerias: settings.default_ferias || 11.11,
          defaultPis: settings.default_pis || 1,
        })
        if (settings.das_rate) {
          updateTaxes({
            dasRate: settings.das_rate,
            cteCost: settings.cte_cost,
            docsCount: settings.docs_count,
            taxasFiscal: settings.taxas_fiscal,
            deadKm: settings.dead_km,
          })
        }
      }
    } catch (error) {
      console.error('Failed to load fleet settings', error)
    }
  }

  const updateHQ = (updates: Partial<HQ>) => updateGlobal({ hq: { ...globalState.hq, ...updates } })
  const updateTaxes = (updates: Partial<Taxes>) =>
    updateGlobal({ taxes: { ...globalState.taxes, ...updates } })
  const updateSettings = (updates: Partial<Settings>) =>
    updateGlobal({ settings: { ...globalState.settings, ...updates } })

  const addDriver = () =>
    updateGlobal({ drivers: [...globalState.drivers, createDriver(globalState.settings)] })

  const updateDriver = (id: string, data: Partial<Driver>) => {
    updateGlobal({
      drivers: globalState.drivers.map((d) => {
        if (d.id !== id) return d
        const newD = { ...d, ...data }

        // Auto-recalculate encargos when baseSalary changes
        if (data.baseSalary !== undefined) {
          const s = globalState.settings
          newD.encargos = {
            fgts: newD.baseSalary * ((s.defaultFgts || 8) / 100),
            decimo: newD.baseSalary * ((s.defaultDecimo || 8.33) / 100),
            ferias: newD.baseSalary * ((s.defaultFerias || 11.11) / 100),
            pis: newD.baseSalary * ((s.defaultPis || 1) / 100),
          }
        }
        return newD
      }),
    })
  }

  const removeDriver = (id: string) =>
    updateGlobal({
      drivers: globalState.drivers.filter((d) => d.id !== id),
      links: globalState.links.filter((l) => l.driverId !== id),
    })

  const addVehicle = () => updateGlobal({ vehicles: [...globalState.vehicles, createVehicle()] })
  const updateVehicle = (id: string, data: Partial<Vehicle>) =>
    updateGlobal({
      vehicles: globalState.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)),
    })
  const removeVehicle = (id: string) =>
    updateGlobal({
      vehicles: globalState.vehicles.filter((v) => v.id !== id),
      links: globalState.links.filter((l) => l.vehicleId !== id),
    })

  const addLink = (link: Omit<Link, 'id'>) =>
    updateGlobal({
      links: [
        ...globalState.links,
        { id: `LNK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, ...link },
      ],
    })
  const removeLink = (id: string) =>
    updateGlobal({ links: globalState.links.filter((l) => l.id !== id) })

  const setFullState = (newState: FleetState) => updateGlobal(newState)

  const calculations = calcularCPK(state)

  return {
    data: state,
    errors: calculations.errors,
    updateHQ,
    updateTaxes,
    updateSettings,
    addDriver,
    updateDriver,
    removeDriver,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addLink,
    removeLink,
    loadSettings,
    setFullState,
    calculations,
  }
}
