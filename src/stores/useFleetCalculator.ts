import { useState, useEffect } from 'react'
import { getFleetSettings } from '@/services/fleet_costs'

const initialState = {
  // Driver
  baseSalary: 2500,
  vrDaily: 30,
  vtComplement: 150,
  foodBasket: 150,
  lifeInsurance: 50,
  toxicologyAnnual: 120,

  // Vehicle
  ipvaAnnual: 2400,
  hullInsuranceAnnual: 3600,
  vehiclePurchasePrice: 150000,
  vehicleResalePrice: 90000,
  dieselPrice: 6.2,
  dieselConsumption: 5,
  tireUnitCost: 1500,
  tireLifeKm: 60000,
  arlaPercentage: 5,
  maintenance: 500,
  cleaning: 200,
  rctrcAnnual: 1200,
  rcfdcAnnual: 1000,
  averbacao: 300,
  consultaCadastro: 100,
  tracking: 150,

  // HQ
  iptuAnnual: 6000,
  rent: 2000,
  water: 300,
  electricity: 800,
  internet: 200,
  telephone: 150,
  avcbAnnual: 600,
  propertyInsuranceAnnual: 1200,
  docks: 300,

  // Taxes
  revenue: 20000,
  simplesRate: 12,
  cteCount: 200,
  cteUnitCost: 2,
  fiscalizacaoAnnual: 600,
  deadKm: 100,

  // General
  estimatedKm: 10000,
  workingDays: 22,

  // Settings/Thresholds
  maxCpk: 4.5,
  minMargin: 15,
  yellowMargin: 25,
  maxDas: 20,
}

let globalState = { ...initialState }
const listeners = new Set<(state: typeof globalState) => void>()

export function useFleetCalculator() {
  const [state, setState] = useState(globalState)

  useEffect(() => {
    listeners.add(setState)
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const loadSettings = async () => {
    const settings = await getFleetSettings()
    if (settings) {
      update({
        maxCpk: settings.max_cpk,
        minMargin: settings.min_margin,
        yellowMargin: settings.yellow_margin,
        maxDas: settings.max_das,
        dieselConsumption: settings.fuel_consumption,
        dieselPrice: settings.fuel_price,
        workingDays: settings.working_days,
      })
    }
  }

  const update = (updates: Partial<typeof globalState>) => {
    globalState = { ...globalState, ...updates }
    listeners.forEach((l) => l(globalState))
  }

  const s = state

  // Driver calculations
  const hazardPay = s.baseSalary * 0.3
  const fgts = s.baseSalary * 0.08
  const thirteenth = s.baseSalary / 12
  const vacation = thirteenth * 1.333
  const pis = s.baseSalary * 0.01
  const rat = s.baseSalary * 0.02
  const vrTotal = s.vrDaily * s.workingDays
  const toxicologyMonthly = s.toxicologyAnnual / 12
  const driverTotal =
    s.baseSalary +
    hazardPay +
    fgts +
    thirteenth +
    vacation +
    pis +
    rat +
    vrTotal +
    s.vtComplement +
    s.foodBasket +
    s.lifeInsurance +
    toxicologyMonthly

  // Vehicle calculations
  const ipvaMonthly = s.ipvaAnnual / 12
  const hullInsuranceMonthly = s.hullInsuranceAnnual / 12
  const depreciationMonthly = (s.vehiclePurchasePrice - s.vehicleResalePrice) / 60
  const dieselCost = s.estimatedKm > 0 ? (s.estimatedKm / s.dieselConsumption) * s.dieselPrice : 0
  const tireCost = s.estimatedKm > 0 ? (s.tireUnitCost / s.tireLifeKm) * s.estimatedKm * 6 : 0 // assuming 6 tires
  const arlaCost = dieselCost * (s.arlaPercentage / 100)
  const rctrcMonthly = s.rctrcAnnual / 12
  const rcfdcMonthly = s.rcfdcAnnual / 12
  const vehicleTotal =
    ipvaMonthly +
    hullInsuranceMonthly +
    depreciationMonthly +
    dieselCost +
    tireCost +
    arlaCost +
    s.maintenance +
    s.cleaning +
    rctrcMonthly +
    rcfdcMonthly +
    s.averbacao +
    s.consultaCadastro +
    s.tracking

  // HQ calculations
  const iptuMonthly = s.iptuAnnual / 12
  const avcbMonthly = s.avcbAnnual / 12
  const propertyInsuranceMonthly = s.propertyInsuranceAnnual / 12
  const hqTotal =
    iptuMonthly +
    s.rent +
    s.water +
    s.electricity +
    s.internet +
    s.telephone +
    avcbMonthly +
    propertyInsuranceMonthly +
    s.docks

  // Tax calculations
  const dasCost = s.revenue * (s.simplesRate / 100)
  const cteCost = s.cteCount * s.cteUnitCost
  const fiscalizacaoMonthly = s.fiscalizacaoAnnual / 12
  const taxesTotal = dasCost + cteCost + fiscalizacaoMonthly

  // Core Logic
  const totalBaseCost = driverTotal + vehicleTotal + hqTotal + taxesTotal
  const cpk = s.estimatedKm > 0 ? totalBaseCost / s.estimatedKm : 0
  const deadKmCost = s.deadKm * cpk
  const finalTotalCost = totalBaseCost + deadKmCost
  const finalCpk = s.estimatedKm > 0 ? finalTotalCost / s.estimatedKm : 0

  // Margins & Status
  const currentMargin = s.revenue > 0 ? ((s.revenue - finalTotalCost) / s.revenue) * 100 : 0

  let cpkStatus = 'green'
  if (finalCpk > s.maxCpk) cpkStatus = 'red'
  else if (finalCpk > s.maxCpk * 0.9) cpkStatus = 'yellow'

  let marginStatus = 'green'
  if (currentMargin < s.minMargin) marginStatus = 'red'
  else if (currentMargin < s.yellowMargin) marginStatus = 'yellow'

  return {
    data: state,
    update,
    loadSettings,
    calculations: {
      driverTotal,
      vehicleTotal,
      hqTotal,
      taxesTotal,
      totalBaseCost,
      deadKmCost,
      finalTotalCost,
      cpk,
      finalCpk,
      currentMargin,
      cpkStatus,
      marginStatus,
    },
  }
}
