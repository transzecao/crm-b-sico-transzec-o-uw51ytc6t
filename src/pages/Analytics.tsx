import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, AlertCircle, PieChart as PieChartIcon } from 'lucide-react'
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
} from 'recharts'

const analyticsConfig = {
  sellerA: { label: 'Vendedor A', color: '#2563eb' },
  sellerB: { label: 'Vendedor B', color: '#60a5fa' },
  sellerC: { label: 'Vendedor C', color: '#93c5fd' },
  price: { label: 'Preço', color: '#e11d48' },
  timing: { label: 'Timing', color: '#94a3b8' },
  competition: { label: 'Concorrência', color: '#d97706' },
  sla: { label: 'SLA/Prazo', color: '#475569' },
  others: { label: 'Outros', color: '#cbd5e1' },
} satisfies ChartConfig

const performanceData = [
  { month: 'Jan', sellerA: 12, sellerB: 8, sellerC: 5 },
  { month: 'Fev', sellerA: 15, sellerB: 10, sellerC: 6 },
  { month: 'Mar', sellerA: 18, sellerB: 12, sellerC: 9 },
  { month: 'Abr', sellerA: 14, sellerB: 15, sellerC: 11 },
  { month: 'Mai', sellerA: 20, sellerB: 18, sellerC: 14 },
]

const lossReasonsData = [
  { name: 'price', value: 35, fill: 'var(--color-price)' },
  { name: 'timing', value: 25, fill: 'var(--color-timing)' },
  { name: 'competition', value: 20, fill: 'var(--color-competition)' },
  { name: 'sla', value: 15, fill: 'var(--color-sla)' },
  { name: 'others', value: 5, fill: 'var(--color-others)' },
]

export default function Analytics() {
  return (
    <div className="space-y-6 bg-blue-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-blue-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100/60 p-3 rounded-xl border border-blue-200/50 text-blue-600 shadow-sm">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">
              Inteligência de Dados
            </h1>
            <p className="text-blue-700/80 font-medium mt-1">
              Métricas de performance comercial e análise de perdas em tempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 flex flex-col bg-white/70 border-blue-100 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-md border border-blue-100 backdrop-blur-md shadow-sm z-10">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm tracking-wide">Performance por Vendedor</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6">
            <CardTitle className="sr-only">Performance por Vendedor</CardTitle>
            <CardDescription className="text-blue-700/70">
              Volume de propostas convertidas por mês segmentado por representante.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6 flex-1 min-h-[350px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
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
                  <Bar
                    dataKey="sellerC"
                    name="sellerC"
                    fill="var(--color-sellerC)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col bg-white/70 border-blue-100 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-rose-900 bg-rose-50/80 px-3 py-1.5 rounded-md border border-rose-100 backdrop-blur-md shadow-sm z-10">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm tracking-wide">Motivos de Perda</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6 text-center">
            <CardTitle className="sr-only">Motivos de Perda</CardTitle>
            <CardDescription className="text-blue-700/70">
              Distribuição histórica dos principais motivos de perda de negócios.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-2 flex-1 min-h-[350px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[280px]">
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
                  />
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
