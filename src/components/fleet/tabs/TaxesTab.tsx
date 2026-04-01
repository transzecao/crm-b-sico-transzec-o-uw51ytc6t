import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useFleetCalculator } from '@/stores/useFleetCalculator'

export function TaxesTab() {
  const { data, updateTaxes } = useFleetCalculator()
  const { taxes } = data

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newField, setNewField] = useState({ name: '', value: 0 })

  const handleFaixaChange = (faixa: string) => {
    let rate = 4
    if (faixa === 'Faixa 1') rate = 4
    else if (faixa === 'Faixa 2') rate = 7.3
    else if (faixa === 'Faixa 3') rate = 9.5
    else if (faixa === 'Faixa 4') rate = 10.7
    else if (faixa === 'Faixa 5') rate = 14.3
    updateTaxes({ faixa, dasRate: rate })
  }

  const handleAddField = () => {
    if (newField.name.trim()) {
      updateTaxes({
        customFields: { ...taxes.customFields, [newField.name.trim()]: newField.value },
      })
      setNewField({ name: '', value: 0 })
      setIsModalOpen(false)
    }
  }

  const handleRemoveField = (fieldName: string) => {
    if (taxes.customFields) {
      const newCustom = { ...taxes.customFields }
      delete newCustom[fieldName]
      updateTaxes({ customFields: newCustom })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Impostos, Taxas e Operação</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label className="text-primary font-bold">Margem de Lucro Alvo (%)</Label>
          <Input
            type="number"
            value={taxes.targetMargin}
            onChange={(e) => updateTaxes({ targetMargin: Number(e.target.value) })}
            className="font-bold text-lg h-12"
          />
          <p className="text-xs text-slate-500">Usado para projetar o faturamento necessário.</p>
        </div>

        <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-xl md:col-span-2 xl:col-span-3">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <Label className="text-base font-bold text-slate-800">
                Usar Faixa de Receita Simplificada?
              </Label>
              <p className="text-sm text-slate-500">
                Preenche automaticamente a alíquota do Simples Nacional.
              </p>
            </div>
            <Switch
              checked={taxes.useFaixa}
              onCheckedChange={(c) => updateTaxes({ useFaixa: c })}
            />
          </div>

          <div className="pt-2">
            {taxes.useFaixa ? (
              <div className="space-y-2 w-full md:w-2/3">
                <Label>Selecione a Faixa de Receita Anual (Anexo II)</Label>
                <Select value={taxes.faixa} onValueChange={handleFaixaChange}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faixa 1">Faixa 1 (até 180k) - 4.0%</SelectItem>
                    <SelectItem value="Faixa 2">Faixa 2 (180k a 360k) - 7.3%</SelectItem>
                    <SelectItem value="Faixa 3">Faixa 3 (360k a 720k) - 9.5%</SelectItem>
                    <SelectItem value="Faixa 4">Faixa 4 (720k a 1.8M) - 10.7%</SelectItem>
                    <SelectItem value="Faixa 5">Faixa 5 (1.8M a 3.6M) - 14.3%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2 w-full md:w-1/3">
                <Label>
                  Alíquota DAS Manual (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={taxes.dasRate}
                  onChange={(e) => updateTaxes({ dasRate: Number(e.target.value) })}
                  className="bg-white font-bold"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <h4 className="text-md font-bold text-slate-700 pt-4">Custos Documentais & Fiscais</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <div className="space-y-2">
          <Label>Custo CT-e/MDF-e (R$/doc)</Label>
          <Input
            type="number"
            value={taxes.cteCost}
            onChange={(e) => updateTaxes({ cteCost: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Qtd. Documentos Mensais</Label>
          <Input
            type="number"
            value={taxes.docsCount}
            onChange={(e) => updateTaxes({ docsCount: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Taxas de Fiscalização Anual (R$)</Label>
          <Input
            type="number"
            value={taxes.taxasFiscal}
            onChange={(e) => updateTaxes({ taxasFiscal: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            KM Morto Mensal (Sem carga)
            <Tooltip>
              <TooltipTrigger>
                <span className="text-slate-400 cursor-pointer hover:text-primary transition-colors">
                  (?)
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Kilometragem rodada sem carga, gera custo sem gerar receita.
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            type="number"
            value={taxes.deadKm}
            onChange={(e) => updateTaxes({ deadKm: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
      </div>

      {taxes.customFields && Object.keys(taxes.customFields).length > 0 && (
        <>
          <h4 className="text-md font-bold text-slate-700 pt-4">Campos Personalizados</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {Object.entries(taxes.customFields).map(([field, val]) => (
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
                    updateTaxes({
                      customFields: { ...taxes.customFields, [field]: Number(e.target.value) },
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
            <DialogTitle>Novo Campo Personalizado - Impostos/Taxas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Nome do Campo <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: Outras Taxas"
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
