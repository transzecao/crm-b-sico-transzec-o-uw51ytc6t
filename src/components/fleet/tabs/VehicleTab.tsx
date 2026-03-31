import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { cn } from '@/lib/utils'

export function VehicleTab() {
  const { data, addVehicle, updateVehicle, removeVehicle } = useFleetCalculator()
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Módulo de Veículos</h3>
        <Button onClick={addVehicle}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Veículo
        </Button>
      </div>
      <div className="space-y-4">
        {data.vehicles.map((v, i) => (
          <Collapsible
            key={v.id}
            open={openStates[v.id]}
            onOpenChange={() => toggle(v.id)}
            className="border bg-white rounded-lg shadow-sm"
          >
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggle(v.id)}
            >
              <span className="font-bold text-slate-800">
                {v.plate || `Veículo ${i + 1}`}{' '}
                <span className="text-slate-400 text-sm font-normal">({v.id})</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900"
                  asChild
                >
                  <div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        openStates[v.id] && 'rotate-180',
                      )}
                    />
                  </div>
                </Button>
              </div>
            </div>
            <CollapsibleContent className="px-4 pb-4 border-t pt-4 space-y-4 bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>
                    Placa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={v.plate}
                    onChange={(e) => updateVehicle(v.id, { plate: e.target.value.toUpperCase() })}
                    placeholder="ABC-1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marca/Modelo</Label>
                  <Input
                    value={v.model}
                    onChange={(e) => updateVehicle(v.id, { model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ano</Label>
                  <Input
                    type="number"
                    value={v.year}
                    onChange={(e) => updateVehicle(v.id, { year: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={v.type}
                    onValueChange={(t: any) => updateVehicle(v.id, { type: t })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baú">Baú</SelectItem>
                      <SelectItem value="Plataforma">Plataforma</SelectItem>
                      <SelectItem value="Graneleiro">Graneleiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Valor Compra (R$) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={v.purchaseValue}
                    onChange={(e) => updateVehicle(v.id, { purchaseValue: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Revenda (5 anos) (R$) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={v.resaleValue}
                    onChange={(e) => updateVehicle(v.id, { resaleValue: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>IPVA Anual (R$)</Label>
                  <Input
                    type="number"
                    value={v.ipva}
                    onChange={(e) => updateVehicle(v.id, { ipva: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Licenc. + DPVAT Anual (R$)</Label>
                  <Input
                    type="number"
                    value={v.licenciamento}
                    onChange={(e) => updateVehicle(v.id, { licenciamento: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seguro Casco Anual (R$)</Label>
                  <Input
                    type="number"
                    value={v.seguroCasco}
                    onChange={(e) => updateVehicle(v.id, { seguroCasco: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>RCTR-C Anual (R$)</Label>
                  <Input
                    type="number"
                    value={v.rctrc}
                    onChange={(e) => updateVehicle(v.id, { rctrc: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>RCF-DC Anual (R$)</Label>
                  <Input
                    type="number"
                    value={v.rcfdc}
                    onChange={(e) => updateVehicle(v.id, { rcfdc: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Consumo Diesel (km/L) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={v.consumo}
                    onChange={(e) => updateVehicle(v.id, { consumo: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço Diesel (R$/L)</Label>
                  <Input
                    type="number"
                    value={v.dieselPrice}
                    onChange={(e) => updateVehicle(v.id, { dieselPrice: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custo Pneus Jogo (R$)</Label>
                  <Input
                    type="number"
                    value={v.pneusJogo}
                    onChange={(e) => updateVehicle(v.id, { pneusJogo: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    KM Pneus Estimado <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={v.kmPneus}
                    onChange={(e) => updateVehicle(v.id, { kmPneus: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Manutenção Mensal (R$)</Label>
                  <Input
                    type="number"
                    value={v.manutencao}
                    onChange={(e) => updateVehicle(v.id, { manutencao: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Limpeza Mensal (R$)</Label>
                  <Input
                    type="number"
                    value={v.limpeza}
                    onChange={(e) => updateVehicle(v.id, { limpeza: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Averbação Mensal (R$)</Label>
                  <Input
                    type="number"
                    value={v.averbacao}
                    onChange={(e) => updateVehicle(v.id, { averbacao: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Consulta Cadas. Mensal (R$)</Label>
                  <Input
                    type="number"
                    value={v.consulta}
                    onChange={(e) => updateVehicle(v.id, { consulta: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Satélite Mensal (R$)</Label>
                  <Input
                    type="number"
                    value={v.satelite}
                    onChange={(e) => updateVehicle(v.id, { satelite: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-end pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`arla-${v.id}`}
                      checked={v.usaArla}
                      onCheckedChange={(c) => updateVehicle(v.id, { usaArla: !!c })}
                    />
                    <Label htmlFor={`arla-${v.id}`} className="cursor-pointer">
                      Usa Arla 32 (5%)
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
                <div className="text-sm text-slate-500 font-medium">
                  Depreciação e custos varáveis são calculados com base no KM do Vínculo.
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeVehicle(v.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Remover
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
