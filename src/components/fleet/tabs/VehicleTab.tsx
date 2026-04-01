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
import { Plus, Trash2, ChevronDown, Info } from 'lucide-react'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const InfoIcon = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger>
      <Info className="w-4 h-4 text-slate-400 inline ml-1 hover:text-primary transition-colors bi bi-question-circle-fill" />
    </TooltipTrigger>
    <TooltipContent side="top">
      <p className="max-w-[200px] text-xs text-center">{text}</p>
    </TooltipContent>
  </Tooltip>
)

export function VehicleTab() {
  const { data, addVehicle, updateVehicle, removeVehicle } = useFleetCalculator()
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; targetId: string | null }>({
    isOpen: false,
    targetId: null,
  })
  const [newField, setNewField] = useState({ name: '', value: 0 })

  const toggle = (id: string) => setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleAddField = () => {
    if (newField.name.trim() && modalConfig.targetId) {
      const vehicle = data.vehicles.find((v) => v.id === modalConfig.targetId)
      if (vehicle) {
        updateVehicle(vehicle.id, {
          customFields: { ...vehicle.customFields, [newField.name.trim()]: newField.value },
        })
      }
      setNewField({ name: '', value: 0 })
      setModalConfig({ isOpen: false, targetId: null })
    }
  }

  const handleRemoveField = (vehicleId: string, fieldName: string) => {
    const vehicle = data.vehicles.find((v) => v.id === vehicleId)
    if (vehicle && vehicle.customFields) {
      const newCustom = { ...vehicle.customFields }
      delete newCustom[fieldName]
      updateVehicle(vehicle.id, { customFields: newCustom })
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Módulo de Veículos</h3>
        <Button onClick={addVehicle}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Veículo
        </Button>
      </div>
      <div className="space-y-4">
        {data.vehicles.map((v, i) => {
          const autoDep = Math.max(0, (v.purchaseValue - v.resaleValue) / 60)
          const autoDiesel = ((v.estimatedKm || 10000) / v.consumo) * v.dieselPrice
          const autoTires = ((v.estimatedKm || 10000) * v.pneusJogo) / v.kmPneus

          return (
            <Collapsible
              key={v.id}
              open={openStates[v.id]}
              onOpenChange={() => toggle(v.id)}
              className="border bg-white rounded-lg shadow-sm overflow-hidden"
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
                    <Label className="flex items-center">
                      Valor Compra (R$) <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={v.purchaseValue}
                      onChange={(e) =>
                        updateVehicle(v.id, { purchaseValue: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Revenda (5 anos) (R$) <span className="text-red-500 ml-1">*</span>
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
                      onChange={(e) =>
                        updateVehicle(v.id, { licenciamento: Number(e.target.value) })
                      }
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
                    <Label className="flex items-center">RCTR-C Anual (R$)</Label>
                    <Input
                      type="number"
                      value={v.rctrc}
                      onChange={(e) => updateVehicle(v.id, { rctrc: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">RCF-DC Anual (R$)</Label>
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
                    <Label className="flex items-center">Custo Pneus Jogo (R$)</Label>
                    <Input
                      type="number"
                      value={v.pneusJogo}
                      onChange={(e) => updateVehicle(v.id, { pneusJogo: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      KM Pneus Estimado <span className="text-red-500 ml-1">*</span>
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
                      <Label htmlFor={`arla-${v.id}`} className="cursor-pointer flex items-center">
                        Usa Arla 32 (5%)
                        <InfoIcon text="Soma 5% sobre o custo do consumo de diesel." />
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2 bg-blue-50/50 p-2 rounded border border-blue-100">
                    <Label className="flex items-center text-blue-900">
                      KM Mensal Estimado
                      <InfoIcon text="Usado para projetar o impacto mensal de custos variáveis (Diesel e Pneus) nos encargos abaixo." />
                    </Label>
                    <Input
                      type="number"
                      className="bg-white"
                      value={v.estimatedKm}
                      onChange={(e) => updateVehicle(v.id, { estimatedKm: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Editable Charges Breakdown */}
                <div className="md:col-span-3 xl:col-span-4 encargos-auto bg-[#f8f9fa] p-[10px] rounded-[5px] border border-slate-200 mt-2">
                  <span className="text-sm font-bold text-slate-700 block mb-2">
                    Impacto Mensal Estimado (R$/mês)
                  </span>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Badge
                      variant="outline"
                      className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                    >
                      <span className="text-xs text-slate-500 font-semibold flex items-center">
                        Depreciação:
                        <InfoIcon text="Calculado pela diferença entre Valor de Compra e Revenda diluído em 60 meses." />
                      </span>
                      <span className="text-xs text-slate-400 ml-1">R$</span>
                      <Input
                        type="number"
                        className="w-24 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                        value={
                          v.overrides?.depreciation !== undefined
                            ? v.overrides.depreciation
                            : autoDep.toFixed(2)
                        }
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value)
                          updateVehicle(v.id, { overrides: { ...v.overrides, depreciation: val } })
                        }}
                        placeholder="Auto"
                      />
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                    >
                      <span className="text-xs text-slate-500 font-semibold flex items-center">
                        Diesel:
                        <InfoIcon text="Calculado com base no KM Estimado, Consumo e Preço do litro." />
                      </span>
                      <span className="text-xs text-slate-400 ml-1">R$</span>
                      <Input
                        type="number"
                        className="w-24 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                        value={
                          v.overrides?.diesel !== undefined
                            ? v.overrides.diesel
                            : autoDiesel.toFixed(2)
                        }
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value)
                          updateVehicle(v.id, { overrides: { ...v.overrides, diesel: val } })
                        }}
                        placeholder="Auto"
                      />
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                    >
                      <span className="text-xs text-slate-500 font-semibold flex items-center">
                        Pneus:
                        <InfoIcon text="Calculado com base na Vida Útil estimada do jogo de pneus e o KM rodado." />
                      </span>
                      <span className="text-xs text-slate-400 ml-1">R$</span>
                      <Input
                        type="number"
                        className="w-24 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                        value={
                          v.overrides?.tires !== undefined
                            ? v.overrides.tires
                            : autoTires.toFixed(2)
                        }
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value)
                          updateVehicle(v.id, { overrides: { ...v.overrides, tires: val } })
                        }}
                        placeholder="Auto"
                      />
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    Valores calculados automaticamente. Edite para fixar um valor manual (override)
                    para o cálculo do CPK, ou apague para voltar ao automático.
                  </p>
                </div>

                {/* Custom Fields */}
                {v.customFields && Object.keys(v.customFields).length > 0 && (
                  <div className="md:col-span-3 xl:col-span-4 mt-2 bg-[#f8f9fa] p-[10px] rounded-[5px] border border-slate-200">
                    <span className="text-sm font-bold text-slate-700 block mb-2">
                      Campos Personalizados (R$/mês)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Object.entries(v.customFields).map(([field, val]) => (
                        <div className="space-y-2 relative group" key={field}>
                          <Label className="flex items-center gap-2">
                            {field} (R$)
                            <button
                              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                              onClick={() => handleRemoveField(v.id, field)}
                              title="Remover campo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Label>
                          <Input
                            type="number"
                            className="bg-white"
                            value={val || 0}
                            onChange={(e) =>
                              updateVehicle(v.id, {
                                customFields: {
                                  ...v.customFields,
                                  [field]: Number(e.target.value),
                                },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4 border-2 border-dashed border-[#28a745] text-[#28a745] hover:bg-[#28a745] hover:text-white transition-all duration-300 transform hover:scale-[1.01]"
                  onClick={() => setModalConfig({ isOpen: true, targetId: v.id })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Campo Personalizado
                </Button>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
                  <div className="text-sm text-slate-500 font-medium">
                    Depreciação e custos varáveis são calculados com base no KM do Vínculo no
                    cálculo final.
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeVehicle(v.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remover
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>

      <Dialog
        open={modalConfig.isOpen}
        onOpenChange={(open) => !open && setModalConfig({ isOpen: false, targetId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Campo Personalizado - Veículo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Nome do Campo <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: Manutenção Adicional"
                value={newField.name}
                onChange={(e) => setNewField((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Inicial (R$)</Label>
              <Input
                type="number"
                value={newField.value}
                onChange={(e) =>
                  setNewField((prev) => ({ ...prev, value: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalConfig({ isOpen: false, targetId: null })}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddField} className="bg-[#28a745] hover:bg-green-700 text-white">
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
