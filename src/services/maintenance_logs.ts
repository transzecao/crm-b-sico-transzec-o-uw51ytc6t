import pb from '@/lib/pocketbase/client'

export interface MaintenanceLog {
  id: string
  vehicle_id: string
  alert_type: string
  message_sent: string
  created: string
  expand?: {
    vehicle_id: {
      plate: string
      model: string
    }
  }
}

export const getMaintenanceLogs = () =>
  pb.collection('maintenance_logs').getFullList<MaintenanceLog>({
    sort: '-created',
    expand: 'vehicle_id',
  })
