import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Tooltip,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BarChart3, PieChart as PieIcon, TrendingUp, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const conversionData = [
  { week: 'Sem 1', rate: 24 },
  { week: 'Sem 2', rate: 22 },
  { week: 'Sem 3', rate: 21 },
  { week: 'Sem Atual', rate: 18 }, // Below 20% to trigger alert
]

const winLossFitData = [
  { name: 'Ganho', value: 30, fill: '#10B981' },
  { name: 'Perda', value: 50, fill: '#EF4444' },
  { name: 'Fora de FIT', value: 20, fill: '#6B7280' },
]

const timeData = [
  { stage: '1º Contato', days: 2 },
  { stage: 'Qualificação', days: 5 },
  { stage: 'Negociação', days: 14 },
]

export default function Analytics() {
  const currentConversion = conversionData[conversionData.length - 1].rate
  const isAlertActive = currentConversion < 20

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & KPIs</h1>
          <p className="text-slate-500 font-medium">
            Relatórios semanais interativos de fechamento.
          </p>
        </div>
      </div>

      {isAlertActive && (
        <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-800 shadow-sm">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">Atenção: Queda de Conversão</AlertTitle>
          <AlertDescription className="font-medium">
            A taxa de conversão média caiu para {currentConversion}% nesta semana. O patamar mínimo
            esperado é 20%. Verifique os motivos de perda recentes.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> Tendência de Conversão Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData} margin={{ left: -20, right: 20, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} unit="%" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#800020"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#800020' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-primary" /> Distribuição de Fechamento
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossFitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {winLossFitData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg">Tempo Médio por Etapa (Dias)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="stage"
                  type="category"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="days" fill="#0056B3" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg">Análise de Perda & Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Motivo Principal</TableHead>
                    <TableHead className="text-right font-bold">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Preço</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">45%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SLA/Prazo</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">25%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Já Tenho Parceiro</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">20%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cobertura</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">10%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Pipeline</TableHead>
                    <TableHead className="text-right font-bold">Leads Ativos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-primary">Prospecção</TableCell>
                    <TableCell className="text-right font-bold">142</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-green-600">Nutrição</TableCell>
                    <TableCell className="text-right font-bold">86</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
