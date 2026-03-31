import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  ComposedChart,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Trash2, FileJson, Camera, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export function FleetDashboard() {
  const { toast } = useToast()
  const [history, setHistory] = useState<any[]>([])

  const loadHistory = () => {
    const historyStr = localStorage.getItem('cpkHistoricoCalculos')
    if (historyStr) {
      setHistory(JSON.parse(historyStr))
    } else {
      setHistory([])
    }
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener('cpkHistoryUpdated', loadHistory)
    return () => window.removeEventListener('cpkHistoryUpdated', loadHistory)
  }, [])

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico local de cálculos?')) {
      localStorage.removeItem('cpkHistoricoCalculos')
      loadHistory()
      toast({
        title: 'Histórico limpo',
        description: 'O histórico de cálculos foi removido do navegador.',
      })
    }
  }

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2))
    const dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', 'historico_calculos_cpk.json')
    dlAnchorElem.click()
  }

  const exportChartAsPNG = (svgId: string, filename: string) => {
    const wrapper = document.getElementById(svgId)
    if (!wrapper) return
    const svgElement = wrapper.querySelector('svg')
    if (!svgElement) return

    const clone = svgElement.cloneNode(true) as SVGSVGElement
    const svgData = new XMLSerializer().serializeToString(clone)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = svgElement.clientWidth || 800
      canvas.height = svgElement.clientHeight || 400
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      const a = document.createElement('a')
      a.download = filename
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const exportAllPNGs = () => {
    exportChartAsPNG('chart-pie', 'grafico_composicao.png')
    setTimeout(() => exportChartAsPNG('chart-line', 'grafico_historico.png'), 500)
    setTimeout(() => exportChartAsPNG('chart-bar', 'grafico_fixo_variavel.png'), 1000)
    setTimeout(() => exportChartAsPNG('chart-doughnut', 'grafico_granular.png'), 1500)
    toast({ title: 'Download Iniciado', description: 'Baixando os gráficos em formato PNG.' })
  }

  const latest = history.length > 0 ? history[history.length - 1] : null

  const pieData =
    latest && latest.costs
      ? [
          { name: 'Motoristas', value: latest.costs.drivers || 0 },
          {
            name: 'Veículos',
            value:
              (latest.costs.depreciation || 0) +
              (latest.costs.insurance || 0) +
              (latest.costs.diesel || 0) +
              (latest.costs.tires || 0) +
              (latest.costs.otherVariable || 0),
          },
          { name: 'Sede', value: latest.costs.hq || 0 },
          {
            name: 'Impostos/Taxas',
            value: (latest.costs.structuralTaxes || 0) + (latest.dasCost || 0),
          },
        ]
      : []

  const lineData = history.slice(-10).map((h, i) => ({
    name: h.date ? format(new Date(h.date), 'dd/MM HH:mm') : `Calc ${i + 1}`,
    cpk: Number(h.cpk.toFixed(2)),
    margin: Number(h.margin.toFixed(2)),
  }))

  const fixedCosts =
    latest && latest.costs
      ? latest.costs.drivers +
        latest.costs.hq +
        latest.costs.structuralTaxes +
        latest.costs.depreciation +
        latest.costs.insurance
      : 0
  const variableCosts =
    latest && latest.costs
      ? latest.costs.diesel + latest.costs.tires + latest.costs.deadKm + latest.costs.otherVariable
      : 0

  const barData = latest
    ? [
        {
          name: 'Custos Totais',
          Fixo: Number(fixedCosts.toFixed(2)),
          Variável: Number(variableCosts.toFixed(2)),
        },
      ]
    : []

  const doughnutData =
    latest && latest.costs
      ? [
          { name: 'Motoristas', value: latest.costs.drivers || 0 },
          { name: 'Depreciação', value: latest.costs.depreciation || 0 },
          { name: 'Combustível', value: latest.costs.diesel || 0 },
          { name: 'Pneus', value: latest.costs.tires || 0 },
          { name: 'Seguros', value: latest.costs.insurance || 0 },
          { name: 'Sede', value: latest.costs.hq || 0 },
          { name: 'DAS', value: latest.dasCost || 0 },
          { name: 'CT-e/Taxas', value: latest.costs.structuralTaxes || 0 },
        ].filter((d) => d.value > 0)
      : []

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  const DOUGHNUT_COLORS = [
    '#3b82f6',
    '#8b5cf6',
    '#ef4444',
    '#f97316',
    '#14b8a6',
    '#64748b',
    '#ec4899',
    '#06b6d4',
  ]

  if (!latest) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
        <h3 className="text-lg font-medium text-slate-900">Nenhum cálculo histórico</h3>
        <p className="max-w-sm text-center mt-2">
          Realize um cálculo na aba "Calculadora CPK" para visualizar o dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-wrap gap-3 justify-end bg-white p-4 rounded-xl border shadow-sm print:hidden">
        <Button
          variant="outline"
          onClick={exportAllPNGs}
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Camera className="w-4 h-4 mr-2" /> Exportar PNGs
        </Button>
        <Button
          variant="outline"
          onClick={exportJSON}
          className="border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <FileJson className="w-4 h-4 mr-2" /> Exportar JSON
        </Button>
        <Button
          variant="outline"
          onClick={clearHistory}
          className="border-red-200 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Limpar Histórico
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Composição de Custos</CardTitle>
            <CardDescription>Visão macro da estrutura de custos (%)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]" id="chart-pie">
            <ChartContainer config={{}} className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Performance</CardTitle>
            <CardDescription>
              Evolução de CPK (R$) vs Margem Líquida (%) - Últimos 10
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]" id="chart-line">
            <ChartContainer
              config={{
                cpk: { label: 'CPK', color: '#3b82f6' },
                margin: { label: 'Margem', color: '#10b981' },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer>
                <ComposedChart
                  data={lineData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cpk"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    name="CPK (R$)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="margin"
                    stroke="#10b981"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    name="Margem (%)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos Fixos vs Variáveis</CardTitle>
            <CardDescription>Comparação absoluta de incidência financeira</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]" id="chart-bar">
            <ChartContainer
              config={{
                Fixo: { label: 'Custo Fixo', color: '#64748b' },
                Variável: { label: 'Custo Variável', color: '#f59e0b' },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Fixo"
                    stackId="a"
                    fill="#64748b"
                    radius={[4, 0, 0, 4]}
                    barSize={60}
                  />
                  <Bar
                    dataKey="Variável"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Granular</CardTitle>
            <CardDescription>
              Visão em 8 categorias detalhadas para análise de gargalos
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]" id="chart-doughnut">
            <ChartContainer config={{}} className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={doughnutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {doughnutData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
