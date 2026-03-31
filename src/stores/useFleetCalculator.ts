import { useState, useEffect } from 'react'
import { getFleetSettings } from '@/services/fleet_costs'
import { isValidCpf, isValidPlate } from '@/utils/formatters'

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
}

export interface FleetState {
  drivers: Driver[]
  vehicles: Vehicle[]
  links: Link[]
  hq: HQ
  taxes: Taxes
  settings: Settings
}

export const createDriver = (): Driver => ({
  id: `MOT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  name: '',
  cpf: '',
  cnh: 'D',
  baseSalary: 2500,
  periculosidade: false,
  vrDaily: 30,
  vtMensal: 0,
  cestaBasica: 150,
  seguroVida: 50,
  toxAnual: 120,
  rat: 1,
})

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
})

const initialState: FleetState = {
  drivers: [createDriver()],
  vehicles: [createVehicle()],
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
  },
}

let globalState = { ...initialState }
const listeners = new Set<(state: FleetState) => void>()

// AC 1: Data Integrity Check
const validarDadosCompletos = (s: FleetState): string[] => {
  const errors: string[] = []
  if (s.drivers.length === 0) errors.push('Adicione pelo menos 1 motorista.')
  if (s.vehicles.length === 0) errors.push('Adicione pelo menos 1 veículo.')
  if (s.links.length === 0) errors.push('Adicione pelo menos 1 vínculo.')

  s.drivers.forEach((d, i) => {
    if (!d.name) errors.push(`Motorista ${i + 1}: Nome obrigatório.`)
    if (!isValidCpf(d.cpf)) errors.push(`Motorista ${i + 1}: CPF inválido.`)
    if (d.baseSalary <= 0) errors.push(`Motorista ${i + 1}: Salário Base deve ser maior que zero.`)
  })

  s.vehicles.forEach((v, i) => {
    if (!isValidPlate(v.plate)) errors.push(`Veículo ${i + 1}: Placa inválida.`)
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

// AC 2: Driver Cost Logic
const calcularCustoMotorista = (d: Driver, workingDays: number): number => {
  const base = d.baseSalary + (d.periculosidade ? d.baseSalary * 0.3 : 0)
  const fgts = base * 0.08
  const decimoTerceiro = base / 12
  const ferias = (base / 12) * 1.333
  const pis = base * 0.01
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

// AC 3: Vehicle Cost Logic
const calcularCustoVeiculo = (v: Vehicle, km: number): number => {
  const dep = (v.purchaseValue - v.resaleValue) / 60
  const fixed = (v.ipva + v.licenciamento + v.seguroCasco + v.rctrc + v.rcfdc) / 12
  const diesel = km > 0 ? (km / v.consumo) * v.dieselPrice : 0
  const arla = v.usaArla ? diesel * 0.05 : 0
  const pneus = km > 0 ? (v.pneusJogo / v.kmPneus) * km : 0
  const monthlyOps = v.manutencao + v.limpeza + v.averbacao + v.consulta + v.satelite

  return dep + fixed + diesel + arla + pneus + monthlyOps
}

// AC 4: Headquarters Cost Logic
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

// AC 5 & 6: Orchestration and Finalization
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
  const vehicleTotal = s.vehicles.reduce(
    (acc, v) => acc + calcularCustoVeiculo(v, vehicleKms[v.id] || 0),
    0,
  )
  const hqTotal = calcularCustoSedeTotal(s.hq)

  // HQ allocated per link (Insight)
  const hqPerLink = s.links.length > 0 ? hqTotal / s.links.length : 0

  const baseTaxes = s.taxes.cteCost * s.taxes.docsCount + s.taxes.taxasFiscal / 12
  const totalBaseCost = driverTotal + vehicleTotal + hqTotal + baseTaxes

  // Ensure margin is bounded to avoid div by zero
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

  return {
    errors,
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
        })
      }
    } catch (error) {
      console.error('Failed to load fleet settings', error)
    }
  }

  const update = (updates: Partial<FleetState>) => {
    globalState = { ...globalState, ...updates }
    listeners.forEach((l) => l(globalState))
  }

  const updateHQ = (updates: Partial<HQ>) => update({ hq: { ...globalState.hq, ...updates } })
  const updateTaxes = (updates: Partial<Taxes>) =>
    update({ taxes: { ...globalState.taxes, ...updates } })
  const updateSettings = (updates: Partial<Settings>) =>
    update({ settings: { ...globalState.settings, ...updates } })

  const addDriver = () => update({ drivers: [...globalState.drivers, createDriver()] })
  const updateDriver = (id: string, data: Partial<Driver>) =>
    update({ drivers: globalState.drivers.map((d) => (d.id === id ? { ...d, ...data } : d)) })
  const removeDriver = (id: string) =>
    update({
      drivers: globalState.drivers.filter((d) => d.id !== id),
      links: globalState.links.filter((l) => l.driverId !== id),
    })

  const addVehicle = () => update({ vehicles: [...globalState.vehicles, createVehicle()] })
  const updateVehicle = (id: string, data: Partial<Vehicle>) =>
    update({ vehicles: globalState.vehicles.map((v) => (v.id === id ? { ...v, ...data } : v)) })
  const removeVehicle = (id: string) =>
    update({
      vehicles: globalState.vehicles.filter((v) => v.id !== id),
      links: globalState.links.filter((l) => l.vehicleId !== id),
    })

  const addLink = (link: Omit<Link, 'id'>) =>
    update({
      links: [
        ...globalState.links,
        { id: `LNK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, ...link },
      ],
    })
  const removeLink = (id: string) => update({ links: globalState.links.filter((l) => l.id !== id) })

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
    calculations,
  }
}
