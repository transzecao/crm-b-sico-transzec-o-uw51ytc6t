import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFleetCosts, FleetCostData } from '@/services/fleet_costs'
import { getAICostAnalysis, AIAnalysisResponse } from '@/services/ai'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Button } from '@/components/ui/button'
import { Download, Printer, BrainCircuit } from 'lucide-react'

export function FleetDashboard() {
  const [data, setData] = useState<FleetCostData[]>([])
  const [aiInsights, setAiInsights] = useState<AIAnalysisResponse | null>(null)

  useEffect(() => {
    getFleetCosts()
      .then(setData)
      .catch(() => {})
    getAICostAnalysis()
      .then(setAiInsights)
      .catch(() => {})
  }, [])

  const chartData = data
    .map((d) => {
      const fixed =
        d.fixed_salary_driver +
        d.fixed_salary_helper +
        d.fixed_insurance +
        d.fixed_ipva +
        d.fixed_depreciation +
        d.fixed_tracking +
        d.fixed_warehouse
      const variable = d.var_fuel + d.var_arla + d.var_maintenance + d.var_tires + d.var_washing
      const km = d.km_final - d.km_initial
      const cpk = km > 0 ? (fixed + variable) / km : 0
      return {
        month: d.month_year,
        cpk: Number(cpk.toFixed(2)),
        plate: d.expand?.vehicle_id?.plate || 'Geral',
      }
    })
    .reverse()

  const exportCSV = () => {
    const headers = ['Mês', 'Veículo', 'CPK']
    const rows = chartData.map((d) => [d.month, d.plate, d.cpk])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n')
    window.open(encodeURI(csvContent))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end gap-3 print:hidden">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Imprimir PDF
        </Button>
      </div>

      {aiInsights && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BrainCircuit className="w-5 h-5" /> Inteligência Artificial - Análise de Custos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-xs font-bold text-blue-500 uppercase">Tendência Detectada</div>
              <p className="text-sm text-blue-900">{aiInsights.trend}</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-blue-500 uppercase">Recomendação</div>
              <p className="text-sm font-semibold text-blue-900">{aiInsights.recommendation}</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-blue-500 uppercase">Previsão CPK Futuro</div>
              <div className="text-2xl font-black text-blue-800">
                R$ {aiInsights.forecast_cpk.toFixed(2)}{' '}
                <span className="text-xs font-normal">±{aiInsights.margin_error}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Evolução do Custo por Quilômetro (CPK)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {chartData.length > 0 ? (
            <ChartContainer
              config={{ cpk: { label: 'CPK', color: 'hsl(var(--primary))' } }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="cpk"
                    stroke="var(--color-cpk)"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              Sem dados suficientes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
