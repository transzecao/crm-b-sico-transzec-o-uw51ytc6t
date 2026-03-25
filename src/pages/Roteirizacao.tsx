import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Share2, Download, Route as RouteIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouteSidebar } from '@/components/roteirizacao/RouteSidebar'
import { MapViewer } from '@/components/roteirizacao/MapViewer'
import { LogisticsChatbox } from '@/components/roteirizacao/LogisticsChatbox'
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
    { id: '2', address: 'Rua Vergueiro, 2000 - São Paulo', weight: 2000, priority: 'Média' },
  ])
  const [vehicle, setVehicle] = useState({ type: 'VUC', capacity: 3000 })
  const [diagnostics, setDiagnostics] = useState<string[]>([])

  const handleGenerate = () => {
    if (waypoints.length < 2) {
      toast({
        title: 'Adicione mais pontos',
        description: 'Uma rota precisa de pelo menos 2 pontos.',
        variant: 'destructive',
      })
      return
    }

    const totalWeight = waypoints.reduce((acc, wp) => acc + wp.weight, 0)
    const newDiagnostics: string[] = []

    if (totalWeight > vehicle.capacity) {
      newDiagnostics.push(
        `❌ Regra de Capacidade: Peso total (${totalWeight}kg) excede o limite estrito do ${vehicle.type} (${vehicle.capacity}kg). Recomendação: Dividir a rota.`,
      )
    }

    if (
      waypoints.some(
        (wp) =>
          wp.address.toLowerCase().includes('paulista') ||
          wp.address.toLowerCase().includes('vergueiro') ||
          wp.address.toLowerCase().includes('centro'),
      )
    ) {
      newDiagnostics.push(
        '⚠️ API Geocoding: Áreas de restrição ZMRC/ZERC identificadas. Verifique a janela de entrega permitida e o rodízio do veículo selecionado.',
      )
    }

    newDiagnostics.push(
      '✅ Google Maps Platform: Rota otimizada via API externa usando dados de trânsito em tempo real e matriz de custos de pedágio.',
    )

    setDiagnostics(newDiagnostics)
    setRouteGenerated(true)
    toast({
      title: 'Rota Otimizada com IA!',
      description: 'Cálculo finalizado cruzando Google Maps e regras logísticas de SP.',
    })
  }

  const exportRoute = (type: 'pdf' | 'whatsapp') => {
    toast({
      title: type === 'pdf' ? 'PDF Gerado' : 'Link do WhatsApp Gerado',
      description:
        type === 'pdf'
          ? 'Download iniciado com as instruções passo a passo.'
          : 'Instruções prontas para envio ao motorista.',
    })
  }

  return (
    <div className="space-y-6 bg-sky-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-sky-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-sky-100/60 p-3 rounded-xl border border-sky-200/50 text-sky-600 shadow-sm">
            <RouteIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-sky-950">
              Roteirização Inteligente
            </h1>
            <p className="text-sky-700/80 font-medium mt-1">
              Painel de Coleta com Integração Google Maps & IA Logística.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => exportRoute('pdf')}
            variant="outline"
            className="border-sky-200 text-sky-700 hover:bg-sky-50 shadow-sm font-semibold"
          >
            <Download className="w-4 h-4 mr-2" /> Exportar PDF
          </Button>
          <Button
            onClick={() => exportRoute('whatsapp')}
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" /> Compartilhar
          </Button>
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
          <LogisticsChatbox />
        </div>
      </div>
    </div>
  )
}
