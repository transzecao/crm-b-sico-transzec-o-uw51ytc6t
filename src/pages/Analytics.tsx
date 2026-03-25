import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  TrendingUp,
  AlertCircle,
  PieChart as PieChartIcon,
  Clock,
  Target,
  Filter,
  Table as TableIcon,
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useCrmStore from '@/stores/useCrmStore'

const analyticsConfig = {
  conversion: { label: 'Conversão (%)', color: '#10b981' },
  FIT: { label: 'FIT', color: '#6366f1' },
  Preço: { label: 'Preço', color: '#e11d48' },
  Prazo: { label: 'Prazo', color: '#f59e0b' },
  Cobertura: { label: 'Cobertura', color: '#0ea5e9' },
  SLA: { label: 'SLA/Avarias', color: '#8b5cf6' },
  Outros: { label: 'Outros', color: '#94a3b8' },
} satisfies ChartConfig

const conversionData = [
  { stage: '1º Contato', conversion: 100 },
  { stage: 'Qualificação', conversion: 65 },
  { stage: 'Negociação', conversion: 40 },
  { stage: 'Ganho', conversion: 22.4 },
]

const lossReasonsData = [
  { name: 'FIT', value: 45, fill: 'var(--color-FIT)' },
  { name: 'Preço', value: 30, fill: 'var(--color-Preço)' },
  { name: 'Prazo', value: 10, fill: 'var(--color-Prazo)' },
  { name: 'Cobertura', value: 8, fill: 'var(--color-Cobertura)' },
  { name: 'SLA', value: 5, fill: 'var(--color-SLA)' },
  { name: 'Outros', value: 2, fill: 'var(--color-Outros)' },
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
              Atualizado automaticamente toda sexta-feira.
              {!isGlobalView && ' (Visualizando apenas seus dados gerais e anonimizados)'}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gráfico de Pizza: Motivos de Perda */}
        <Card className="flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm lg:col-span-1">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-rose-900 bg-rose-50/80 px-3 py-1.5 rounded-md border border-rose-100 backdrop-blur-md shadow-sm z-10">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm tracking-wide">Motivos de Perda</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6 text-center">
            <CardTitle className="sr-only">Motivos</CardTitle>
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

        {/* Tabela de Motivos */}
        <Card className="flex flex-col bg-white/80 border-slate-200 shadow-sm backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <TableIcon className="w-5 h-5 text-slate-500" /> Tabela de Motivos de Perda
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Porcentagem (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lossReasonsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.value * 2} leads
                    </TableCell>
                    <TableCell className="text-right text-slate-500">{item.value}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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

        <Card className="flex flex-col bg-white/80 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-slate-800 bg-slate-100/80 px-3 py-1.5 rounded-md border border-slate-200 backdrop-blur-md shadow-sm z-10">
            <Target className="w-5 h-5 text-slate-600" />
            <span className="font-bold text-sm tracking-wide">Distribuição Geral</span>
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
