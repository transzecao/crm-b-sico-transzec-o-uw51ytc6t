import { Users, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  PieChart,
  Pie,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts'
import useCrmStore from '@/stores/useCrmStore'
import { formatCurrency } from '@/utils/formatters'

export default function Index() {
  const { state } = useCrmStore()

  const prospectionCount = state.leads.filter((l) => l.pipeline === 'Prospection').length
  const nutritionCount = state.leads.filter((l) => l.pipeline === 'Nutrition').length
  const totalValue = state.leads.reduce((acc, curr) => acc + curr.value, 0)

  const chartConfig = {
    pipeline: { label: 'Pipeline', color: '#9333ea' },
    commercial: { label: 'Prospecção', color: '#2563eb' },
    nutrition: { label: 'Nutrição', color: '#a855f7' },
    financeRev: { label: 'Receita', color: '#059669' },
    financeExp: { label: 'Despesas', color: '#e11d48' },
    operation: { label: 'Operação', color: '#475569' },
    marketing: { label: 'Marketing', color: '#d97706' },
    history: { label: 'Histórico', color: '#94a3b8' },
  } satisfies ChartConfig

  const barData = [
    { stage: '1º Contato', count: 4, fill: 'var(--color-pipeline)' },
    { stage: 'Qualificação', count: 7, fill: 'var(--color-pipeline)' },
    { stage: 'Negociação', count: 3, fill: 'var(--color-pipeline)' },
    { stage: 'Ganho', count: 8, fill: 'var(--color-pipeline)' },
  ]

  const pieData = [
    { name: 'commercial', value: prospectionCount, fill: 'var(--color-commercial)' },
    { name: 'nutrition', value: nutritionCount, fill: 'var(--color-nutrition)' },
  ]

  const financeData = [
    { month: 'Jan', financeRev: 12500, financeExp: 8000 },
    { month: 'Fev', financeRev: 15000, financeExp: 9500 },
    { month: 'Mar', financeRev: 22000, financeExp: 11000 },
    { month: 'Abr', financeRev: 18000, financeExp: 10500 },
    { month: 'Mai', financeRev: 25000, financeExp: 12000 },
    { month: 'Jun', financeRev: 31000, financeExp: 14000 },
  ]

  const operationsData = [
    { week: 'S1', operation: 45, marketing: 12, history: 3 },
    { week: 'S2', operation: 52, marketing: 15, history: 4 },
    { week: 'S3', operation: 38, marketing: 18, history: 2 },
    { week: 'S4', operation: 65, marketing: 22, history: 5 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h1>
        <p className="text-muted-foreground">Visão geral unificada das áreas do CRM.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50/30 border-blue-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900">Leads Prospecção</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-950">{prospectionCount}</div>
            <p className="text-xs text-blue-700/80">+20.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/30 border-purple-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Leads Nutrição</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-950">{nutritionCount}</div>
            <p className="text-xs text-purple-700/80">+5 novos essa semana</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/30 border-emerald-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-900">Em Negociação</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-950">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-emerald-700/80">Baseado no pipeline ativo</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/30 border-amber-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">T. Conversão</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-950">24.3%</div>
            <p className="text-xs text-amber-700/80">+2.4% acima da meta (Marketing)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Funil de Vendas</CardTitle>
            <CardDescription>Evolução dos negócios no pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <Bar dataKey="count" name="pipeline" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Leads</CardTitle>
            <CardDescription>Prospecção vs Nutrição</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} className="mt-4" />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Performance Financeira</CardTitle>
            <CardDescription>Evolução de receitas e despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-financeRev)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-financeRev)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value / 1000}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="financeRev"
                    name="financeRev"
                    stroke="var(--color-financeRev)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="financeExp"
                    name="financeExp"
                    stroke="var(--color-financeExp)"
                    strokeWidth={2}
                    fillOpacity={0.1}
                    fill="var(--color-financeExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Métricas Operacionais</CardTitle>
            <CardDescription>Acompanhamento de volume semanal</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={operationsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="week"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="operation"
                    name="operation"
                    stroke="var(--color-operation)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="marketing"
                    name="marketing"
                    stroke="var(--color-marketing)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="history"
                    name="history"
                    stroke="var(--color-history)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
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
