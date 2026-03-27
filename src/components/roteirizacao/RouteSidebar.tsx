import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus, Route, AlertTriangle, Send } from 'lucide-react'

export function RouteSidebar({
  waypoints,
  setWaypoints,
  vehicle,
  setVehicle,
  onGenerate,
  routeGenerated,
  diagnostics,
  onSendToLeadFlow,
  role,
}: any) {
  const addWaypoint = () => {
    setWaypoints([
      ...waypoints,
      { id: Math.random().toString(), address: '', weight: 0, priority: 'Média' },
    ])
  }

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((w: any) => w.id !== id))
  }

  const updateWaypoint = (id: string, field: string, value: any) => {
    setWaypoints(waypoints.map((w: any) => (w.id === id ? { ...w, [field]: value } : w)))
  }

  const canSendToFlow = ['Acesso Master', 'Funcionário Coleta'].includes(role)

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Route className="w-5 h-5 text-primary" /> Planejamento de Rota
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          <Label className="font-bold text-slate-700">Veículo Selecionado</Label>
          <Select
            value={vehicle.type}
            onValueChange={(v) => setVehicle({ type: v, capacity: v === 'VUC' ? 3000 : 10000 })}
          >
            <SelectTrigger className="focus:ring-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VUC">VUC (Veículo Urbano de Carga) - 3.000kg</SelectItem>
              <SelectItem value="Toco">Caminhão Toco - 10.000kg</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-bold text-slate-700">Pontos de Parada</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addWaypoint}
              className="h-7 px-2 text-xs border-primary/30 text-primary"
            >
              <Plus className="w-3 h-3 mr-1" /> Adicionar Ponto
            </Button>
          </div>

          {waypoints.map((wp: any, i: number) => (
            <div
              key={wp.id}
              className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3 relative group"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-rose-500 hover:bg-rose-100"
                  onClick={() => removeWaypoint(wp.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-slate-500">
                  Endereço do Ponto {i + 1}
                </Label>
                <Input
                  value={wp.address}
                  onChange={(e) => updateWaypoint(wp.id, 'address', e.target.value)}
                  className="h-8 text-sm focus-visible:ring-primary bg-white"
                  placeholder="Rua, Número, Bairro..."
                />
              </div>
              <div className="flex gap-3">
                <div className="space-y-1 flex-1">
                  <Label className="text-[10px] uppercase font-bold text-slate-500">
                    Peso (KG)
                  </Label>
                  <Input
                    type="number"
                    value={wp.weight}
                    onChange={(e) => updateWaypoint(wp.id, 'weight', Number(e.target.value))}
                    className="h-8 text-sm focus-visible:ring-primary bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onGenerate}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 shadow-sm"
        >
          Calcular Rota Otimizada
        </Button>

        {routeGenerated && canSendToFlow && (
          <Button
            onClick={onSendToLeadFlow}
            variant="secondary"
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-10 shadow-sm"
          >
            <Send className="w-4 h-4 mr-2" /> Enviar Coleta para Fluxo de Leads
          </Button>
        )}

        {diagnostics?.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-900 space-y-2 shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-2">
              <AlertTriangle className="w-4 h-4" /> Diagnóstico de Rota
            </div>
            {diagnostics.map((d: string, i: number) => (
              <p key={i} className="text-xs">
                {d}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
