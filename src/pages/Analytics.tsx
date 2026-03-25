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
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react'

const conversionData = [
  { stage: '1º Contato', rate: 100 },
  { stage: 'Qualificação', rate: 65 },
  { stage: 'Negociação', rate: 40 },
  { stage: 'Ganho', rate: 22.4 },
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & KPIs</h1>
          <p className="text-slate-500 font-medium">
            Relatórios atualizados automaticamente (Última atualização: Sexta-feira)
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> Conversão por Etapa
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData} margin={{ left: -20, right: 20, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} unit="%" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#0056B3"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-primary" /> Distribuição Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tempo Médio (Dias)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
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
                <Bar dataKey="days" fill="#6A0EAE" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Motivos de Perda & Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Preço</TableCell>
                    <TableCell className="text-right">45%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SLA/Prazo</TableCell>
                    <TableCell className="text-right">25%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cobertura</TableCell>
                    <TableCell className="text-right">20%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pipeline</TableHead>
                    <TableHead className="text-right">Leads Ativos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-primary">Prospecção</TableCell>
                    <TableCell className="text-right">142</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-green-600">Nutrição</TableCell>
                    <TableCell className="text-right">86</TableCell>
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
