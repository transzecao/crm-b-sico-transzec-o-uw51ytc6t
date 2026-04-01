import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useFleetCalculator } from '@/stores/useFleetCalculator'

export function HQTab() {
  const { data, updateHQ } = useFleetCalculator()
  const { hq } = data

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newField, setNewField] = useState({ name: '', value: 0 })

  const handleAddField = () => {
    if (newField.name.trim()) {
      updateHQ({
        customFields: { ...hq.customFields, [newField.name.trim()]: newField.value },
      })
      setNewField({ name: '', value: 0 })
      setIsModalOpen(false)
    }
  }

  const handleRemoveField = (fieldName: string) => {
    if (hq.customFields) {
      const newCustom = { ...hq.customFields }
      delete newCustom[fieldName]
      updateHQ({ customFields: newCustom })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
        Custos Fixos da Sede (Headquarters)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <div className="space-y-2">
          <Label>
            IPTU Anual (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={hq.iptu}
            onChange={(e) => updateHQ({ iptu: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Seguro Patrimonial Anual (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={hq.seguroPatrimonial}
            onChange={(e) => updateHQ({ seguroPatrimonial: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            AVCB Anual (R$)
            <Tooltip>
              <TooltipTrigger>
                <span className="text-slate-400 cursor-pointer hover:text-primary transition-colors">
                  (?)
                </span>
              </TooltipTrigger>
              <TooltipContent>Auto de Vistoria do Corpo de Bombeiros</TooltipContent>
            </Tooltip>
          </Label>
          <Input
            type="number"
            value={hq.avcb}
            onChange={(e) => updateHQ({ avcb: Number(e.target.value) })}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Aluguel Mensal (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={hq.aluguel}
            onChange={(e) => updateHQ({ aluguel: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Água Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.agua}
            onChange={(e) => updateHQ({ agua: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Luz Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.luz}
            onChange={(e) => updateHQ({ luz: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Internet Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.internet}
            onChange={(e) => updateHQ({ internet: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Telefone Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.telefone}
            onChange={(e) => updateHQ({ telefone: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Manutenção Docas Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.docas}
            onChange={(e) => updateHQ({ docas: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
      </div>

      {hq.customFields && Object.keys(hq.customFields).length > 0 && (
        <>
          <h4 className="text-md font-bold text-slate-700 pt-4">Campos Personalizados</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {Object.entries(hq.customFields).map(([field, val]) => (
              <div className="space-y-2 relative group" key={field}>
                <Label className="flex items-center gap-2">
                  {field} (R$)
                  <button
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    onClick={() => handleRemoveField(field)}
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Label>
                <Input
                  type="number"
                  value={val || 0}
                  onChange={(e) =>
                    updateHQ({
                      customFields: { ...hq.customFields, [field]: Number(e.target.value) },
                    })
                  }
                  className="bg-white"
                />
              </div>
            ))}
          </div>
        </>
      )}

      <Button
        variant="outline"
        className="w-full mt-4 border-2 border-dashed border-[#28a745] text-[#28a745] hover:bg-[#28a745] hover:text-white transition-all duration-300 transform hover:scale-[1.01]"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Campo Personalizado
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Campo Personalizado - Sede</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Nome do Campo <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: Serviços de Limpeza"
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
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
