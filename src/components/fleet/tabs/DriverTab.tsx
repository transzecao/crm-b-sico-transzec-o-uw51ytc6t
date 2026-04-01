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
import { formatCpf } from '@/utils/formatters'
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

export function DriverTab() {
  const { data, addDriver, updateDriver, removeDriver, addCustomFieldDef } = useFleetCalculator()
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newFieldName, setNewFieldName] = useState('')

  const toggle = (id: string) => setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleAddField = () => {
    if (newFieldName.trim()) {
      addCustomFieldDef('driver', newFieldName.trim())
      setNewFieldName('')
      setIsModalOpen(false)
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Módulo de Motoristas</h3>
        <Button onClick={addDriver}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Motorista
        </Button>
      </div>
      <div className="space-y-4">
        {data.drivers.map((d, i) => (
          <Collapsible
            key={d.id}
            open={openStates[d.id]}
            onOpenChange={() => toggle(d.id)}
            className="border bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggle(d.id)}
            >
              <span className="font-bold text-slate-800">
                {d.name || `Motorista ${i + 1}`}{' '}
                <span className="text-slate-400 text-sm font-normal">({d.id})</span>
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
                        openStates[d.id] && 'rotate-180',
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
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={d.name}
                    onChange={(e) => updateDriver(d.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formatCpf(d.cpf)}
                    onChange={(e) => updateDriver(d.id, { cpf: formatCpf(e.target.value) })}
                    maxLength={14}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria CNH</Label>
                  <Select
                    value={d.cnh}
                    onValueChange={(v: 'D' | 'E') => updateDriver(d.id, { cnh: v })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="flex items-center">
                    Salário Base (R$) <span className="text-red-500 ml-1">*</span>
                    <InfoIcon text="Salário base mensal do motorista. Base para cálculo automático de encargos sociais e trabalhistas." />
                  </Label>
                  <Input
                    type="number"
                    value={d.baseSalary}
                    onChange={(e) => updateDriver(d.id, { baseSalary: Number(e.target.value) })}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Cálculos automáticos: FGTS ({data.settings.defaultFgts}%), 13º (
                    {data.settings.defaultDecimo}%), Férias (1/9 + 1/3), PIS (
                    {data.settings.defaultPis}%).
                  </p>
                </div>

                <div className="space-y-2 flex flex-col justify-end pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`peric-${d.id}`}
                      checked={d.periculosidade}
                      onCheckedChange={(c) => updateDriver(d.id, { periculosidade: !!c })}
                    />
                    <Label htmlFor={`peric-${d.id}`} className="cursor-pointer flex items-center">
                      Periculosidade (30%)
                      <InfoIcon text="Adicional de 30% aplicado sobre o salário base." />
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>VR Diário (R$)</Label>
                  <Input
                    type="number"
                    value={d.vrDaily}
                    onChange={(e) => updateDriver(d.id, { vrDaily: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>VT Mensal (R$)</Label>
                  <Input
                    type="number"
                    value={d.vtMensal}
                    onChange={(e) => updateDriver(d.id, { vtMensal: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cesta Básica (R$)</Label>
                  <Input
                    type="number"
                    value={d.cestaBasica}
                    onChange={(e) => updateDriver(d.id, { cestaBasica: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seguro Vida (R$)</Label>
                  <Input
                    type="number"
                    value={d.seguroVida}
                    onChange={(e) => updateDriver(d.id, { seguroVida: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exame Toxicológico Anual (R$)</Label>
                  <Input
                    type="number"
                    value={d.toxAnual}
                    onChange={(e) => updateDriver(d.id, { toxAnual: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">
                    RAT (%)
                    <InfoIcon text="Risco Ambiental do Trabalho. Alíquota aplicada sobre o salário base." />
                  </Label>
                  <Input
                    type="number"
                    value={d.rat}
                    onChange={(e) => updateDriver(d.id, { rat: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Editable Charges (Encargos) - Absolute Values */}
              <div className="md:col-span-3 xl:col-span-4 encargos-auto bg-[#f8f9fa] p-[10px] rounded-[5px] border border-slate-200 mt-2">
                <span className="text-sm font-bold text-slate-700 block mb-2">
                  Encargos Sociais e Trabalhistas (R$/mês)
                </span>
                <div className="flex flex-wrap gap-3 items-center">
                  <Badge
                    variant="outline"
                    className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                  >
                    <span className="text-xs text-slate-500 font-semibold">FGTS:</span>
                    <span className="text-xs text-slate-400">R$</span>
                    <Input
                      type="number"
                      className="w-20 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                      value={d.encargos?.fgts?.toFixed(2) || 0}
                      onChange={(e) =>
                        updateDriver(d.id, {
                          encargos: { ...d.encargos, fgts: Number(e.target.value) },
                        })
                      }
                    />
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                  >
                    <span className="text-xs text-slate-500 font-semibold">Férias:</span>
                    <span className="text-xs text-slate-400">R$</span>
                    <Input
                      type="number"
                      className="w-20 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                      value={d.encargos?.ferias?.toFixed(2) || 0}
                      onChange={(e) =>
                        updateDriver(d.id, {
                          encargos: { ...d.encargos, ferias: Number(e.target.value) },
                        })
                      }
                    />
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                  >
                    <span className="text-xs text-slate-500 font-semibold">13º Salário:</span>
                    <span className="text-xs text-slate-400">R$</span>
                    <Input
                      type="number"
                      className="w-20 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                      value={d.encargos?.decimo?.toFixed(2) || 0}
                      onChange={(e) =>
                        updateDriver(d.id, {
                          encargos: { ...d.encargos, decimo: Number(e.target.value) },
                        })
                      }
                    />
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white px-2 py-1.5 flex items-center gap-1 border-slate-300"
                  >
                    <span className="text-xs text-slate-500 font-semibold">PIS:</span>
                    <span className="text-xs text-slate-400">R$</span>
                    <Input
                      type="number"
                      className="w-20 h-6 p-0 border-none bg-transparent text-center text-xs focus-visible:ring-1"
                      value={d.encargos?.pis?.toFixed(2) || 0}
                      onChange={(e) =>
                        updateDriver(d.id, {
                          encargos: { ...d.encargos, pis: Number(e.target.value) },
                        })
                      }
                    />
                  </Badge>
                </div>
              </div>

              {/* Custom Fields */}
              {data.customFieldDefs?.driver?.length > 0 && (
                <div className="md:col-span-3 xl:col-span-4 mt-2 bg-[#f8f9fa] p-[10px] rounded-[5px] border border-slate-200">
                  <span className="text-sm font-bold text-slate-700 block mb-2">
                    Campos Personalizados (R$/mês)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data.customFieldDefs.driver.map((field) => (
                      <div className="space-y-2" key={field}>
                        <Label>{field} (R$)</Label>
                        <Input
                          type="number"
                          className="bg-white"
                          value={d.customFields?.[field] || 0}
                          onChange={(e) =>
                            updateDriver(d.id, {
                              customFields: { ...d.customFields, [field]: Number(e.target.value) },
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
                <div className="text-sm text-slate-500 font-medium">
                  Cálculos reagem em tempo real na aba de resultados.
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeDriver(d.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Remover
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <Button
          variant="outline"
          className="btn-add-campo w-full border-dashed border-green-500 text-green-700 hover:bg-green-50"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Campo Personalizado
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Campo Personalizado - Motoristas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Campo</Label>
              <Input
                placeholder="Ex: Auxílio Combustível"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddField}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
