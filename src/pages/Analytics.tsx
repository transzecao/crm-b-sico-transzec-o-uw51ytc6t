import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  TrendingUp,
  AlertCircle,
  PieChart as PieChartIcon,
  Clock,
  Filter,
  Table as TableIcon,
  Activity,
  Award,
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
  rate: { label: 'Conversão (%)', color: '#6366f1' },
  FIT: { label: 'FIT', color: '#4f46e5' },
  Preço: { label: 'Preço', color: '#e11d48' },
  Prazo: { label: 'Prazo', color: '#f59e0b' },
  Cobertura: { label: 'Cobertura', color: '#0ea5e9' },
  SLA: { label: 'SLA/Avarias', color: '#8b5cf6' },
  Outros: { label: 'Outros', color: '#94a3b8' },
} satisfies ChartConfig

const conversionData = [
  { stage: '1º Contato', rate: 100 },
  { stage: 'Qualificação', rate: 65 },
  { stage: 'Negociação', rate: 40 },
  { stage: 'Ganho', rate: 22.4 },
]

const lossReasonsData = [
  { name: 'FIT', value: 45, fill: 'var(--color-FIT)' },
  { name: 'Preço', value: 30, fill: 'var(--color-Preço)' },
  { name: 'Prazo', value: 10, fill: 'var(--color-Prazo)' },
  { name: 'Cobertura', value: 8, fill: 'var(--color-Cobertura)' },
  { name: 'SLA', value: 5, fill: 'var(--color-SLA)' },
  { name: 'Outros', value: 2, fill: 'var(--color-Outros)' },
]

const timePerStageData = [
  { stage: '1º Contato', days: 2, fill: '#6366f1' },
  { stage: 'Qualificação', days: 5, fill: '#8b5cf6' },
  { stage: 'Negociação', days: 14, fill: '#a855f7' },
  { stage: 'Nutrição', days: 45, fill: '#d946ef' },
]

export default function Analytics() {
  const { state } = useCrmStore()
  const [period, setPeriod] = useState('30d')

  const isGlobalView = ['Master', 'Supervisor Geral', 'Diretoria'].includes(state.role)

  return (
    <div className="space-y-6 bg-slate-50/30 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-slate-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl border border-indigo-200/80 text-indigo-700 shadow-sm">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboards Analíticos
            </h1>
            <p className="text-slate-600 font-medium mt-1">
              Métricas executivas atualizadas em tempo real.
              {!isGlobalView && ' (Visão restrita ao próprio funil e dados gerais)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-white border-slate-200 shadow-sm">
              <Filter className="w-4 h-4 mr-2 text-indigo-500" />
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md border-none relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Activity className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-100">
              Leads em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">142</div>
            <p className="text-xs text-indigo-200 mt-1 font-medium">+12% vs. período anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md border-none relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <TrendingUp className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-100">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">22.4%</div>
            <p className="text-xs text-blue-200 mt-1 font-medium">De Prospect para Ganho</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-md border-none relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Award className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-violet-100">
              Metas Alcançadas
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">80%</div>
            <p className="text-xs text-violet-200 mt-1 font-medium">
              8 de 10 clientes fechados no mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col bg-white/90 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm lg:col-span-2">
          <div className="absolute top-4 left-5 flex items-center gap-2 text-indigo-900 bg-indigo-50/80 px-3 py-1.5 rounded-md border border-indigo-100 backdrop-blur-md shadow-sm z-10">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-sm tracking-wide">Evolução de Conversão por Etapa</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6 text-center">
            <CardTitle className="sr-only">Conversão</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-6 flex-1 min-h-[300px]">
            <ChartContainer config={analyticsConfig} className="h-full w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={conversionData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="stage"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#6366f1"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col bg-white/90 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm lg:col-span-1">
          <div className="absolute top-4 left-5 flex items-center gap-2 text-rose-900 bg-rose-50/80 px-3 py-1.5 rounded-md border border-rose-100 backdrop-blur-md shadow-sm z-10">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm tracking-wide">Motivos de Perda</span>
          </div>
          <CardHeader className="pt-20 pb-0 px-6 text-center">
            <CardTitle className="sr-only">Motivos</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-2 flex-1 min-h-[300px]">
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

        <Card className="flex flex-col bg-white/90 border-slate-200 shadow-sm backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <TableIcon className="w-5 h-5 text-indigo-500" /> Tabela Estratégica de Motivos de
              Perda
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Motivo Identificado</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">
                    Volume (Leads)
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700">
                    Representatividade (%)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lossReasonsData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-indigo-50/30 transition-colors">
                    <TableCell className="font-medium flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-800">
                      {item.value * 2} leads
                    </TableCell>
                    <TableCell className="text-right text-slate-500 font-medium">
                      {item.value}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1 flex flex-col bg-white/90 border-slate-200 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-4 left-5 flex items-center gap-2 text-violet-900 bg-violet-50/80 px-3 py-1.5 rounded-md border border-violet-100 backdrop-blur-md shadow-sm z-10">
            <Clock className="w-5 h-5 text-violet-600" />
            <span className="font-bold text-sm tracking-wide">Ciclo Médio (Dias)</span>
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
      </div>
    </div>
  )
}
