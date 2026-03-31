import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFleetCosts, FleetCostData } from '@/services/fleet_costs'
import { getAICostAnalysis, AIAnalysisResponse } from '@/services/ai'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Download, Printer, BrainCircuit, FileText } from 'lucide-react'

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
    .map((d) => ({
      month: d.month_year,
      cpk: Number((d.cpk || (d.km_final > 0 ? (d.total_cost || 0) / d.km_final : 0)).toFixed(2)),
      plate: d.expand?.vehicle_id?.plate || 'Geral',
      total_cost: d.total_cost || 0,
      margin: d.details?.revenue
        ? Number((((d.details.revenue - (d.total_cost || 0)) / d.details.revenue) * 100).toFixed(2))
        : 0,
    }))
    .reverse()

  const latestDetails = data[0]?.details || {}
  const pieData = latestDetails.baseSalary
    ? [
        { name: 'Motorista', value: latestDetails.baseSalary * 1.5 },
        { name: 'Veículo', value: 5000 },
        { name: 'Sede', value: 2000 },
        { name: 'Impostos', value: 1500 },
      ]
    : [{ name: 'Dados', value: 100 }]

  const exportCSV = () => {
    const headers = ['Mês', 'Veículo', 'Custo Total', 'CPK', 'Margem (%)']
    const rows = chartData.map((d) => [d.month, d.plate, d.total_cost.toFixed(2), d.cpk, d.margin])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = encodeURI(csvContent)
    a.download = 'relatorio_cpk.csv'
    a.click()
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end gap-3 print:hidden">
        <Button
          variant="outline"
          onClick={exportCSV}
          className="border-green-600 text-green-700 hover:bg-green-50"
        >
          <Download className="w-4 h-4 mr-2" /> Exportar Excel
        </Button>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="border-red-600 text-red-700 hover:bg-red-50"
        >
          <FileText className="w-4 h-4 mr-2" /> Exportar PDF
        </Button>
      </div>

      {aiInsights && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <BrainCircuit className="w-5 h-5" /> Inteligência Artificial - Análise de Custos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-bold text-blue-500">Tendência</div>
              <p className="text-sm text-blue-900">{aiInsights.trend}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-blue-500">Recomendação</div>
              <p className="text-sm font-semibold text-blue-900">{aiInsights.recommendation}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-blue-500">Previsão CPK</div>
              <div className="text-2xl font-black text-blue-800">
                R$ {aiInsights.forecast_cpk.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução do CPK (R$)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length > 0 ? (
              <ChartContainer
                config={{ cpk: { label: 'CPK', color: '#3b82f6' } }}
                className="w-full h-full"
              >
                <ResponsiveContainer>
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

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{}} className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evolução da Margem Líquida (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length > 0 ? (
              <ChartContainer
                config={{ margin: { label: 'Margem (%)', color: '#10b981' } }}
                className="w-full h-full"
              >
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="margin" fill="var(--color-margin)" radius={[4, 4, 0, 0]} />
                  </BarChart>
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
    </div>
  )
}
