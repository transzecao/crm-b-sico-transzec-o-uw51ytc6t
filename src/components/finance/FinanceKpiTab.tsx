import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, DollarSign } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'

export function FinanceKpiTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const otd =
    calc.data.totalDel > 0 ? ((calc.data.onTime / calc.data.totalDel) * 100).toFixed(1) : '0.0'
  const savings =
    calc.data.stdCost > 0
      ? (((calc.data.stdCost - calc.data.negCost) / calc.data.stdCost) * 100).toFixed(1)
      : '0.0'

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  return (
    <Card className="border-emerald-100 shadow-sm bg-white/90">
      <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
          <LineChart className="w-5 h-5 text-emerald-600" /> Monitoramento de Performance (KPIs)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">
            Cálculo de OTD (On-Time Delivery)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-semibold">
                Total Entregas
              </Label>
              <Input
                type="number"
                value={calc.data.totalDel}
                onChange={(e) => calc.update({ totalDel: Number(e.target.value) })}
                className="border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-semibold">No Prazo</Label>
              <Input
                type="number"
                value={calc.data.onTime}
                onChange={(e) => calc.update({ onTime: Number(e.target.value) })}
                className="border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex items-center justify-between shadow-inner">
            <span className="font-semibold text-indigo-900">Performance OTD Global</span>
            <span className="text-2xl font-black text-indigo-700">{otd}%</span>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">
            Cálculo de Freight Savings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-semibold">
                Tabela Padrão (R$)
              </Label>
              <Input
                type="number"
                value={calc.data.stdCost}
                onChange={(e) => calc.update({ stdCost: Number(e.target.value) })}
                className="border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-semibold">
                Custo Negociado (R$)
              </Label>
              <Input
                type="number"
                value={calc.data.negCost}
                onChange={(e) => calc.update({ negCost: Number(e.target.value) })}
                className="border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center justify-between shadow-inner">
            <span className="font-semibold text-emerald-900">Saving Realizado</span>
            <span className="text-2xl font-black text-emerald-700">{savings}%</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-5 pt-4 border-t border-slate-200">
          <h3 className="font-bold text-slate-800 pb-2">Análise de Reentrega / Devolução</h3>
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-semibold">
                Custo Médio Operacional de Reentrega (R$)
              </Label>
              <Input
                type="number"
                value={calc.data.reDeliveryCost}
                onChange={(e) => calc.update({ reDeliveryCost: Number(e.target.value) })}
                className="border-emerald-200 focus-visible:ring-emerald-500 max-w-[200px]"
              />
              <p className="text-xs text-slate-500">Provisionamento para ocorrências 02 e 03.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Custo de Falha Prox. Viagem
              </div>
              <span className="text-2xl font-black text-amber-700">
                {fmt(calc.data.reDeliveryCost)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
