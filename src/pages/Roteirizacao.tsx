import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Share2, Download, Map as RouteIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouteSidebar } from '@/components/roteirizacao/RouteSidebar'
import { MapViewer } from '@/components/roteirizacao/MapViewer'
import { useToast } from '@/hooks/use-toast'

export type Waypoint = {
  id: string
  address: string
  weight: number
  priority: 'Alta' | 'Média' | 'Baixa'
}

export default function Roteirizacao() {
  const { toast } = useToast()
  const [routeGenerated, setRouteGenerated] = useState(false)
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: '1', address: 'Av. Paulista, 1000 - São Paulo', weight: 1500, priority: 'Alta' },
  ])
  const [vehicle, setVehicle] = useState({ type: 'VUC', capacity: 3000 })
  const [diagnostics, setDiagnostics] = useState<string[]>([])

  const handleGenerate = () => {
    setRouteGenerated(true)
    toast({ title: 'Rota Otimizada!' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <RouteIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Roteirização</h1>
            <p className="text-slate-500 font-medium mt-1">Módulo para equipe de Coleta.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6">
          <RouteSidebar
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            vehicle={vehicle}
            setVehicle={setVehicle}
            onGenerate={handleGenerate}
            routeGenerated={routeGenerated}
            diagnostics={diagnostics}
          />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
          <MapViewer waypoints={waypoints} routeGenerated={routeGenerated} />
        </div>
      </div>
    </div>
  )
}
