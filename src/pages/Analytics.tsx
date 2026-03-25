import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, AlertCircle, PieChart as PieChartIcon, Clock, Target } from 'lucide-react'
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

const analyticsConfig = {
  sellerA: { label: 'Vendedor A', color: '#64748b' },
  sellerB: { label: 'Vendedor B', color: '#94a3b8' },
  price: { label: 'Preço', color: '#e11d48' },
  fit: { label: 'FIT', color: '#94a3b8' },
  coverage: { label: 'Cobertura', color: '#d97706' },
  deadline: { label: 'Prazo', color: '#475569' },
  sla: { label: 'SLA/Avarias', color: '#64748b' },
  others: { label: 'Outros', color: '#cbd5e1' },
} satisfies ChartConfig

const conversionData = [
  { month: 'Jan', sellerA: 25, sellerB: 15 },
  { month: 'Fev', sellerA: 28, sellerB: 18 },
  { month: 'Mar', sellerA: 32, sellerB: 22 },
  { month: 'Abr', sellerA: 24, sellerB: 25 },
  { month: 'Mai', sellerA: 38, sellerB: 28 },
]

const lossReasonsData = [
  { name: 'price', value: 35, fill: 'var(--color-price)' },
  { name: 'fit', value: 25, fill: 'var(--color-fit)' },
  { name: 'coverage', value: 20, fill: 'var(--color-coverage)' },
  { name: 'deadline', value: 10, fill: 'var(--color-deadline)' },
  { name: 'sla', value: 5, fill: 'var(--color-sla)' },
  { name: 'others', value: 5, fill: 'var(--color-others)' },
]

const timePerStageData = [
  { stage: '1º Contato', days: 2 },
  { stage: 'Qualificação', days: 5 },
  { stage: 'Negociação', days: 14 },
  { stage: 'Nutrição (Méd)', days: 45 },
]

export default function Analytics() {
  return (
    <div className="space-y-6 bg-slate-50/30 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-slate-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 text-slate-700 shadow-sm">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboards & KPIs (Semanal)
            </h1>
            <p className="text-slate-600 font-medium mt-1">
              Visão de conversões, tempo por etapa e motivos de perda operacionais.
            </p>
          </div>
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
              Distribuição (Perda)
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">45%</div>
            <p className="text-xs text-slate-500">Principal ofensor: Preço</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-slate-800 bg-slate-100/80 px-3 py-1.5 rounded-md border border-slate-200 backdrop-blur-md shadow-sm z-10">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            <span className="font-bold text-sm tracking-wide">
              Conversão por Vendedor (Semanal)
            </span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6">
            <CardTitle className="sr-only">Conversão</CardTitle>
            <CardDescription className="text-slate-500">
              Volume de negócios ganhos por semana/mês.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6 flex-1 min-h-[300px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conversionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="sellerA"
                    name="sellerA"
                    fill="var(--color-sellerA)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="sellerB"
                    name="sellerB"
                    fill="var(--color-sellerB)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

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

        <Card className="col-span-1 lg:col-span-3 flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-md border border-blue-100 backdrop-blur-md shadow-sm z-10">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm tracking-wide">Tempo Médio por Etapa (Dias)</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6">
            <CardTitle className="sr-only">Tempo por Etapa</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-6 flex-1">
            <ChartContainer config={analyticsConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timePerStageData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                    dataKey="days"
                    name="Dias"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
