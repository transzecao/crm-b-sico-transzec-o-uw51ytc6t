import pb from '@/lib/pocketbase/client'

export interface FleetCostData {
  user_id: string
  month_year: string
  fixed_salary_driver: number
  fixed_salary_helper: number
  fixed_insurance: number
  fixed_ipva: number
  fixed_depreciation: number
  fixed_tracking: number
  fixed_warehouse: number
  var_fuel: number
  var_arla: number
  var_maintenance: number
  var_tires: number
  var_washing: number
  km_initial: number
  km_final: number
}

export const createFleetCost = (data: FleetCostData) => {
  return pb.collection('fleet_costs').create(data)
}

export const getFleetCosts = () => {
  return pb.collection('fleet_costs').getFullList({ sort: '-created' })
}
