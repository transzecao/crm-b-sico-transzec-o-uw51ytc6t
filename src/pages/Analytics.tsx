import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  TrendingUp,
  AlertCircle,
  PieChart as PieChartIcon,
  Clock,
  Target,
  Filter,
} from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore from '@/stores/useCrmStore'

const analyticsConfig = {
  conversion: { label: 'Conversão (%)', color: '#10b981' },
  price: { label: 'Preço', color: '#e11d48' },
  fit: { label: 'FIT', color: '#94a3b8' },
  coverage: { label: 'Cobertura', color: '#d97706' },
  deadline: { label: 'Prazo', color: '#475569' },
  sla: { label: 'SLA/Avarias', color: '#64748b' },
  others: { label: 'Outros', color: '#cbd5e1' },
} satisfies ChartConfig

const conversionData = [
  { stage: '1º Contato', conversion: 100 },
  { stage: 'Qualificação', conversion: 65 },
  { stage: 'Negociação', conversion: 40 },
  { stage: 'Ganho', conversion: 22.4 },
]

const lossReasonsData = [
  { name: 'price', value: 35, fill: 'var(--color-price)' },
  { name: 'fit', value: 25, fill: 'var(--color-fit)' },
  { name: 'coverage', value: 20, fill: 'var(--color-coverage)' },
  { name: 'deadline', value: 10, fill: 'var(--color-deadline)' },
  { name: 'sla', value: 5, fill: 'var(--color-sla)' },
  { name: 'others', value: 5, fill: 'var(--color-others)' },
]

const distData = [
  { name: 'Ganhos', value: 35, fill: '#10b981' },
  { name: 'Perdidos', value: 50, fill: '#ef4444' },
  { name: 'Fora de FIT', value: 15, fill: '#94a3b8' },
]

const timePerStageData = [
  { stage: '1º Contato', days: 2, fill: '#3b82f6' },
  { stage: 'Qualificação', days: 5, fill: '#3b82f6' },
  { stage: 'Negociação', days: 14, fill: '#3b82f6' },
  { stage: 'Nutrição', days: 45, fill: '#f59e0b' },
]

export default function Analytics() {
  const { state } = useCrmStore()
  const [period, setPeriod] = useState('30d')

  // Example filtering logic visibility based on role
  const isGlobalView = ['Master', 'Supervisor', 'Diretoria'].includes(state.role)

  return (
    <div className="space-y-6 bg-slate-50/30 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-slate-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 text-slate-700 shadow-sm">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboards Analíticos
            </h1>
            <p className="text-slate-600 font-medium mt-1">
              Visão de conversões, tempo por etapa e motivos de perda operacionais.
              {!isGlobalView && ' (Visualizando apenas seus dados)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-white border-slate-200">
              <Filter className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="ytd">Ano atual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">22.4%</div>
            <p className="text-xs text-slate-500">Média geral dos funis</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Tempo Médio Conversão
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">28 Dias</div>
            <p className="text-xs text-slate-500">Do 1º Contato ao Ganho</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Distribuição (Ganho)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">35%</div>
            <p className="text-xs text-slate-500">Em relação ao total de leads</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Principal Ofensor
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Preço (35%)</div>
            <p className="text-xs text-slate-500">Maior motivo de perda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gráfico de Linha: Taxas de Conversão */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-emerald-900 bg-emerald-50/80 px-3 py-1.5 rounded-md border border-emerald-100 backdrop-blur-md shadow-sm z-10">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-sm tracking-wide">Taxa de Conversão por Etapa (%)</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6">
            <CardTitle className="sr-only">Conversão</CardTitle>
            <CardDescription className="text-slate-500">
              Evolução da retenção de leads ao longo do funil comercial.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6 flex-1 min-h-[300px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={conversionData}
                  margin={{ top: 20, right: 20, left: -20, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="stage"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    name="conversion"
                    stroke="var(--color-conversion)"
                    strokeWidth={4}
                    dot={{ r: 6, fill: 'var(--color-conversion)' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza: Motivos de Perda */}
        <Card className="flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-rose-900 bg-rose-50/80 px-3 py-1.5 rounded-md border border-rose-100 backdrop-blur-md shadow-sm z-10">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm tracking-wide">Motivos de Perda</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6 text-center">
            <CardTitle className="sr-only">Motivos</CardTitle>
            <CardDescription className="text-slate-500">
              Classificação obrigatória em Perdas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-2 flex-1 min-h-[300px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={lossReasonsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {lossReasonsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="flex-wrap mt-6 gap-2 px-4"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras: Tempo por Etapa */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-md border border-blue-100 backdrop-blur-md shadow-sm z-10">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm tracking-wide">Tempo Médio por Etapa (Dias)</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6">
            <CardTitle className="sr-only">Tempo por Etapa</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-6 flex-1">
            <ChartContainer config={analyticsConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timePerStageData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="days" radius={[0, 4, 4, 0]} maxBarSize={40}>
                    {timePerStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza: Distribuição */}
        <Card className="flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-slate-800 bg-slate-100/80 px-3 py-1.5 rounded-md border border-slate-200 backdrop-blur-md shadow-sm z-10">
            <Target className="w-5 h-5 text-slate-600" />
            <span className="font-bold text-sm tracking-wide">Distribuição Ganhos/Perdas</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6 text-center">
            <CardTitle className="sr-only">Distribuição</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-2 flex-1 min-h-[250px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={distData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {distData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="flex-wrap mt-6 gap-2 px-4"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
