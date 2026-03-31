import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFleetCalculator } from '@/stores/useFleetCalculator'

export function TaxesTab() {
  const { data, updateTaxes } = useFleetCalculator()
  const { taxes } = data

  const handleFaixaChange = (faixa: string) => {
    let rate = 4
    if (faixa === 'Faixa 1') rate = 4
    else if (faixa === 'Faixa 2') rate = 7.3
    else if (faixa === 'Faixa 3') rate = 9.5
    else if (faixa === 'Faixa 4') rate = 10.7
    else if (faixa === 'Faixa 5') rate = 14.3
    updateTaxes({ faixa, dasRate: rate })
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
          <Label>KM Morto Mensal (Sem carga)</Label>
          <Input
            type="number"
            value={taxes.deadKm}
            onChange={(e) => updateTaxes({ deadKm: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  )
}
