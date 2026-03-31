import pb from '@/lib/pocketbase/client'

export interface FleetCostData {
  id?: string
  user_id: string
  vehicle_id?: string
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
  details?: any
  total_cost?: number
  estimated_km?: number
  cpk?: number
  expand?: {
    vehicle_id?: {
      plate: string
      model: string
    }
  }
}

export const createFleetCost = (data: FleetCostData) => {
  return pb.collection('fleet_costs').create(data)
}

export const getFleetCosts = () => {
  return pb
    .collection('fleet_costs')
    .getFullList<FleetCostData>({ sort: '-created', expand: 'vehicle_id' })
}

export const getFleetSettings = async () => {
  try {
    const records = await pb.collection('fleet_settings').getFullList()
    return records[0]
  } catch {
    return null
  }
}

export const getAuditLogs = async () => {
  try {
    return await pb
      .collection('settings_audit_logs')
      .getFullList({ sort: '-created', expand: 'user_id' })
  } catch {
    return []
  }
}

export const updateFleetSettings = async (id: string, data: any) => {
  return pb.collection('fleet_settings').update(id, data)
}
