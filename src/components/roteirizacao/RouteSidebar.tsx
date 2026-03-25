import { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MapPin,
  Plus,
  Trash2,
  Zap,
  AlertTriangle,
  Clock,
  Fuel,
  Navigation,
  ShieldCheck,
} from 'lucide-react'
import { Waypoint } from '@/pages/Roteirizacao'
import { Badge } from '@/components/ui/badge'

interface RouteSidebarProps {
  waypoints: Waypoint[]
  setWaypoints: Dispatch<SetStateAction<Waypoint[]>>
  vehicle: { type: string; capacity: number }
  setVehicle: Dispatch<SetStateAction<{ type: string; capacity: number }>>
  onGenerate: () => void
  routeGenerated: boolean
  diagnostics: string[]
}

export function RouteSidebar({
  waypoints,
  setWaypoints,
  vehicle,
  setVehicle,
  onGenerate,
  routeGenerated,
  diagnostics,
}: RouteSidebarProps) {
  const addWaypoint = () => {
    setWaypoints([
      ...waypoints,
      { id: Math.random().toString(), address: '', weight: 0, priority: 'Média' },
    ])
  }

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((w) => w.id !== id))
  }

  const updateWaypoint = (id: string, field: keyof Waypoint, value: string | number) => {
    setWaypoints(waypoints.map((w) => (w.id === id ? { ...w, [field]: value } : w)))
  }

  return (
    <div className="space-y-6">
      <Card className="border-sky-200 shadow-sm bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-sky-100 bg-sky-50/50">
          <CardTitle className="text-lg text-sky-950 font-bold flex items-center gap-2">
            <Navigation className="w-5 h-5 text-sky-500" /> Planejamento de Rota
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Veículo Destinado</span>
              <Badge variant="outline" className="text-[9px] bg-slate-50">
                <ShieldCheck className="w-3 h-3 mr-1" /> Regras Validadas
              </Badge>
            </Label>
            <Select
              value={vehicle.type}
              onValueChange={(val) => {
                const capacity = val === 'Fiorino' ? 1500 : val === 'VUC' ? 3000 : 5000
                setVehicle({ type: val, capacity })
              }}
            >
              <SelectTrigger className="bg-white border-slate-200 font-semibold text-sky-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiorino">Fiorino (Máx 1.500 kg)</SelectItem>
                <SelectItem value="VUC">VUC (Máx 3.000 kg)</SelectItem>
                <SelectItem value="2Eixos">Caminhão 2 Eixos (Máx 5.000 kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pontos de Coleta
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addWaypoint}
                className="h-7 px-2 text-sky-600 hover:bg-sky-50 font-bold"
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {waypoints.map((wp, index) => (
                <div
                  key={wp.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative group shadow-sm"
                >
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        wp.priority === 'Alta'
                          ? 'border-rose-200 text-rose-600 bg-rose-50'
                          : wp.priority === 'Média'
                            ? 'border-amber-200 text-amber-600 bg-amber-50'
                            : 'border-emerald-200 text-emerald-600 bg-emerald-50'
                      }
                    >
                      {wp.priority}
                    </Badge>
                    {waypoints.length > 1 && (
                      <button
                        onClick={() => removeWaypoint(wp.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    Parada {index + 1}
                  </span>
                  <Input
                    value={wp.address}
                    onChange={(e) => updateWaypoint(wp.id, 'address', e.target.value)}
                    placeholder="Endereço completo..."
                    className="h-8 text-sm mb-2 bg-white font-medium"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={wp.weight || ''}
                      onChange={(e) => updateWaypoint(wp.id, 'weight', Number(e.target.value))}
                      placeholder="Peso (kg)"
                      className="h-8 text-sm bg-white"
                    />
                    <Select
                      value={wp.priority}
                      onValueChange={(v) => updateWaypoint(wp.id, 'priority', v)}
                    >
                      <SelectTrigger className="h-8 bg-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta (Urgente)</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={onGenerate}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md active:scale-95 transition-all text-sm py-5"
          >
            <Zap className="w-5 h-5 mr-2" fill="currentColor" /> Processar na IA (Google Maps)
          </Button>
        </CardContent>
      </Card>

      {routeGenerated && (
        <Card className="border-emerald-200 shadow-md bg-emerald-50/40 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="py-3 px-4 border-b border-emerald-100 bg-emerald-100/50">
            <CardTitle className="text-sm text-emerald-900 font-bold flex items-center gap-2">
              Resumo da Rota Otimizada
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> Distância
                </span>
                <span className="text-lg font-black text-emerald-700">42 km</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Tempo Est.
                </span>
                <span className="text-lg font-black text-emerald-700">1h 15m</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5" /> Combustível
                </span>
                <span className="text-lg font-black text-emerald-700">R$ 38,50</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Pedágios
                </span>
                <span className="text-lg font-black text-emerald-700">R$ 0,00</span>
              </div>
            </div>

            {diagnostics.length > 0 && (
              <div className="space-y-2 mt-4">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Diagnóstico & APIs
                </span>
                {diagnostics.map((diag, i) => (
                  <div
                    key={i}
                    className={`text-xs p-2.5 rounded-md leading-relaxed font-semibold shadow-sm border ${
                      diag.includes('❌') || diag.includes('⚠️')
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {diag}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
