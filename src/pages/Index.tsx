import { Users, TrendingUp, CheckCircle2, DollarSign, Clock } from 'lucide-react'
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

  // Filter leads based on role (Comercial sees only their own data)
  const visibleLeads =
    state.role === 'Comercial'
      ? state.leads.filter((l) => l.owner === state.currentUser.name)
      : state.leads

  const prospectionCount = visibleLeads.filter((l) => l.pipeline === 'Prospection').length
  const nutritionCount = visibleLeads.filter((l) => l.pipeline === 'Nutrition').length
  const totalValue = visibleLeads.reduce((acc, curr) => acc + curr.value, 0)

  const chartConfig = {
    pipeline: { label: 'Pipeline', color: '#8b5cf6' }, // Violet
    commercial: { label: 'Prospecção', color: '#2563eb' }, // Blue
    nutrition: { label: 'Nutrição', color: '#f59e0b' }, // Amber
    financeRev: { label: 'Receita', color: '#10b981' }, // Emerald
    financeExp: { label: 'Despesas', color: '#ef4444' }, // Red/Alert
    operation: { label: 'Operação', color: '#64748b' }, // Blue-Grey
    marketing: { label: 'Marketing', color: '#f59e0b' }, // Amber
  } satisfies ChartConfig

  const barData = [
    { stage: '1º Contato', count: 4, fill: 'var(--color-pipeline)' },
    { stage: 'Qualificação', count: 7, fill: 'var(--color-pipeline)' },
    { stage: 'Negociação', count: 3, fill: 'var(--color-pipeline)' },
    { stage: 'Ganho', count: 8, fill: 'var(--color-pipeline)' },
  ]

  const pieData = [
    { name: 'commercial', value: prospectionCount || 1, fill: 'var(--color-commercial)' },
    { name: 'nutrition', value: nutritionCount || 1, fill: 'var(--color-nutrition)' },
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
    { week: 'S1', operation: 45, marketing: 12 },
    { week: 'S2', operation: 52, marketing: 15 },
    { week: 'S3', operation: 38, marketing: 18 },
    { week: 'S4', operation: 65, marketing: 22 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Executivo</h1>
        <p className="text-muted-foreground">
          Visão geral unificada por áreas de negócio da Transzecão.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50/30 border-blue-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900">Leads Prospecção</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-950">{prospectionCount}</div>
            <p className="text-xs text-blue-700/80">Ativos no funil de vendas</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/30 border-amber-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">Leads Nutrição</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-950">{nutritionCount}</div>
            <p className="text-xs text-amber-700/80">Aguardando aquecimento</p>
          </CardContent>
        </Card>
        <Card className="bg-violet-50/30 border-violet-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-violet-900">Em Negociação</CardTitle>
            <DollarSign className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-950">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-violet-700/80">Valor potencial em andamento</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/30 border-emerald-100/50 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-900">
              T. Conversão Média
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-950">28 Dias</div>
            <p className="text-xs text-emerald-700/80">Tempo total (Contato ao Ganho)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Funil de Vendas (Comercial)</CardTitle>
            <CardDescription>Evolução dos negócios no pipeline (Prospecção)</CardDescription>
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

        <Card className="col-span-3 shadow-sm bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Distribuição de Leads</CardTitle>
            <CardDescription>Comercial vs Marketing (Nutrição)</CardDescription>
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

        {['Master', 'Financeiro', 'Diretoria', 'Supervisor'].includes(state.role) && (
          <Card className="col-span-4 shadow-sm bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">Performance Financeira</CardTitle>
              <CardDescription>
                Evolução de receitas de frete e despesas operacionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={financeData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
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
        )}

        {['Master', 'Diretoria', 'Supervisor', 'Coleta'].includes(state.role) && (
          <Card className="col-span-3 shadow-sm bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Métricas Operacionais</CardTitle>
              <CardDescription>Acompanhamento de volume semanal (Coleta)</CardDescription>
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
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
