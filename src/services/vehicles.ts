import pb from '@/lib/pocketbase/client'

export interface VehicleData {
  id?: string
  plate: string
  model: string
  km_critical_limit: number
  maintenance_frequency_months: number
  last_maintenance_date: string
  next_maintenance_date: string
  status: 'active' | 'maintenance' | 'inactive'
}

export const getVehicles = () => pb.collection('vehicles').getFullList<VehicleData>()
export const createVehicle = (data: Partial<VehicleData>) => pb.collection('vehicles').create(data)
export const updateVehicle = (id: string, data: Partial<VehicleData>) =>
  pb.collection('vehicles').update(id, data)
export const deleteVehicle = (id: string) => pb.collection('vehicles').delete(id)
