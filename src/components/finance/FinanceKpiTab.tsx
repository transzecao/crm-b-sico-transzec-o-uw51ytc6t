import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import useCrmStore from '@/stores/useCrmStore'

export function FinanceKpiTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const { state } = useCrmStore()
  const canEdit = ['Financeiro', 'Master'].includes(state.role)

  const otd =
    calc.data.totalDel > 0 ? ((calc.data.onTime / calc.data.totalDel) * 100).toFixed(1) : '0.0'
  const savings =
    calc.data.stdCost > 0
      ? (((calc.data.stdCost - calc.data.negCost) / calc.data.stdCost) * 100).toFixed(1)
      : '0.0'

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
          <LineChart className="w-5 h-5 text-secondary" /> KPIs Operacionais Financeiros
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">
            OTD (On-Time Delivery)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-bold">Total Entregas</Label>
              <Input
                disabled={!canEdit}
                type="number"
                value={calc.data.totalDel}
                onChange={(e) => calc.update({ totalDel: Number(e.target.value) })}
                className="border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-bold">No Prazo</Label>
              <Input
                disabled={!canEdit}
                type="number"
                value={calc.data.onTime}
                onChange={(e) => calc.update({ onTime: Number(e.target.value) })}
                className="border-slate-200 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center justify-between">
            <span className="font-bold text-primary">Performance OTD</span>
            <span className="text-2xl font-black text-secondary">{otd}%</span>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">
            Freight Savings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-bold">
                Tabela Padrão (R$)
              </Label>
              <Input
                disabled={!canEdit}
                type="number"
                value={calc.data.stdCost}
                onChange={(e) => calc.update({ stdCost: Number(e.target.value) })}
                className="border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-600 uppercase font-bold">
                Custo Negociado (R$)
              </Label>
              <Input
                disabled={!canEdit}
                type="number"
                value={calc.data.negCost}
                onChange={(e) => calc.update({ negCost: Number(e.target.value) })}
                className="border-slate-200 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg flex items-center justify-between">
            <span className="font-bold text-secondary">Saving Realizado</span>
            <span className="text-2xl font-black text-primary">{savings}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
