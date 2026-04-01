import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FleetAlerts() {
  const { calculations } = useFleetCalculator()
  const alerts = calculations.alerts || []

  if (alerts.length === 0) return null

  return (
    <div id="alertContainer" className="space-y-3 mb-6">
      {alerts.map((alert) => {
        let bgColor = ''
        let borderColor = ''
        let textColor = ''
        let Icon = 'ℹ️'

        switch (alert.type) {
          case 'critical':
          case 'error':
            bgColor = 'bg-[#f8d7da]'
            borderColor = 'border-l-[#dc3545]'
            textColor = 'text-[#721c24]'
            Icon = '❌'
            break
          case 'warning':
            bgColor = 'bg-[#fff3cd]'
            borderColor = 'border-l-[#ffc107]'
            textColor = 'text-[#856404]'
            Icon = '⚠️'
            break
          case 'success':
            bgColor = 'bg-[#d4edda]'
            borderColor = 'border-l-[#28a745]'
            textColor = 'text-[#155724]'
            Icon = '✅'
            break
          case 'info':
          default:
            bgColor = 'bg-blue-50'
            borderColor = 'border-l-blue-500'
            textColor = 'text-blue-800'
            Icon = 'ℹ️'
            break
        }

        return (
          <div
            key={alert.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-r-md border-l-4 shadow-sm animate-fade-in-up',
              bgColor,
              borderColor,
              textColor,
            )}
            style={{ animationDuration: '0.3s' }}
          >
            <span className="text-xl leading-none shrink-0 mt-0.5">{Icon}</span>
            <div>
              <h4 className="font-bold text-sm">{alert.title}</h4>
              <p className="text-sm mt-1 opacity-90">{alert.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
