import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'

export function FinancePricingTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  return (
    <Card className="border-emerald-100 shadow-sm bg-white/90">
      <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
          <Scale className="w-5 h-5 text-emerald-600" /> Parâmetros de Carga (Fórmulas e Break-even)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Fator de Cubagem (KG/M³)
          </Label>
          <Input
            type="number"
            value={calc.data.cubageFactor}
            onChange={(e) => calc.update({ cubageFactor: Number(e.target.value) })}
            className="border-emerald-200 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Peso Físico (KG)
          </Label>
          <Input
            type="number"
            value={calc.data.weight}
            onChange={(e) => calc.update({ weight: Number(e.target.value) })}
            className="border-emerald-200 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Volume Total (M³)
          </Label>
          <Input
            type="number"
            value={calc.data.volume}
            step="0.1"
            onChange={(e) => calc.update({ volume: Number(e.target.value) })}
            className="border-emerald-200 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Valor da Nota Fiscal (R$)
          </Label>
          <Input
            type="number"
            value={calc.data.nfValue}
            onChange={(e) => calc.update({ nfValue: Number(e.target.value) })}
            className="border-emerald-200 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Distância (KM)
          </Label>
          <Input
            type="number"
            value={calc.data.distance}
            onChange={(e) => calc.update({ distance: Number(e.target.value) })}
            className="border-emerald-200 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="md:col-span-3 pt-2 border-t border-slate-100 flex items-center gap-4">
          <Switch checked={calc.data.useTda} onCheckedChange={(v) => calc.update({ useTda: v })} />
          <Label className="font-semibold text-slate-700 cursor-pointer">
            Aplicar Taxa de Dificuldade de Entrega (TDA/TDE)
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
