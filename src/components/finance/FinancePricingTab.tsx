import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'

export function FinancePricingTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
          <Calculator className="w-5 h-5 text-secondary" /> Composição de Frete
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 border-r border-slate-100 pr-4">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
            Dados da Carga
          </h4>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-slate-500">Peso Físico (KG)</Label>
              <Input
                type="number"
                value={calc.data.weight}
                onChange={(e) => calc.update({ weight: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Volume (M³)</Label>
              <Input
                type="number"
                step="0.1"
                value={calc.data.volume}
                onChange={(e) => calc.update({ volume: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Fator de Cubagem</Label>
              <Input
                type="number"
                value={calc.data.cubageFactor}
                onChange={(e) => calc.update({ cubageFactor: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={calc.data.useCubing}
                onCheckedChange={(v) => calc.update({ useCubing: v })}
                className="data-[state=checked]:bg-primary"
              />
              <Label className="font-medium text-slate-700">Ativar Cubagem na fórmula</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
            Itens do Frete
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-500">Frete Peso Base (R$)</Label>
              <Input
                type="number"
                step="0.1"
                value={calc.data.weightFreight}
                onChange={(e) => calc.update({ weightFreight: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Frete Valor (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={calc.data.valueFreightPercent}
                onChange={(e) => calc.update({ valueFreightPercent: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">GRIS (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={calc.data.grisPercent}
                onChange={(e) => calc.update({ grisPercent: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Taxa Despacho (R$)</Label>
              <Input
                type="number"
                value={calc.data.dispatchFee}
                onChange={(e) => calc.update({ dispatchFee: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Switch
                checked={calc.data.useTolls}
                onCheckedChange={(v) => calc.update({ useTolls: v })}
                className="data-[state=checked]:bg-primary"
              />
              <Label className="font-medium text-slate-700">Incluir Pedágios na Rota</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={calc.data.useTas}
                onCheckedChange={(v) => calc.update({ useTas: v })}
                className="data-[state=checked]:bg-primary"
              />
              <Label className="font-medium text-slate-700">Aplicar TAS (Taxa Adm.)</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
