import { useState } from 'react'
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
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  Clock,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

const conversionPerStageData = [
  { stage: '1º Contato', rate: 100 },
  { stage: 'Qualificação', rate: 65 },
  { stage: 'Negociação', rate: 42 },
  { stage: 'Ganho', rate: 22 },
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
  const { state } = useCrmStore()
  const { toast } = useToast()

  const [filterConsultant, setFilterConsultant] = useState('all')
  const [filterPipeline, setFilterPipeline] = useState('all')

  const isComercial = state.role === 'Funcionário Comercial'
  const isSupervisor = [
    'Acesso Master',
    'Supervisor Financeiro',
    'Supervisor Comercial',
    'Supervisor Coleta',
  ].includes(state.role)

  const currentConversion = conversionPerStageData[conversionPerStageData.length - 1].rate
  const isAlertActive = currentConversion < 25

  const handleSendReport = () => {
    toast({
      title: 'Relatório Semanal Agendado',
      description:
        'O resumo de Analytics será enviado para o e-mail da Diretoria todas as Segundas-feiras às 08:00.',
    })
  }

  const bottleneckLeads = state.leads
    .filter((l) => {
      if (l.stage === 'Ganho' || l.stage === 'Perda') return false
      if (filterConsultant !== 'all' && l.owner !== filterConsultant) return false
      if (filterPipeline !== 'all' && l.pipeline !== filterPipeline) return false
      return true
    })
    .sort((a, b) => (b.stalledDays || 0) - (a.stalledDays || 0))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & KPIs</h1>
            <p className="text-slate-500 font-medium">
              {isComercial ? 'Seu desempenho pessoal' : 'Visão global de métricas e conversões.'}
            </p>
          </div>
        </div>
        {isSupervisor && (
          <Button
            onClick={handleSendReport}
            className="bg-primary hover:bg-primary/90 text-white font-bold shadow-sm"
          >
            <Mail className="w-4 h-4 mr-2" /> Programar Report Automático
          </Button>
        )}
      </div>

      {isAlertActive && isSupervisor && (
        <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-800 shadow-sm">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">
            Atenção: Queda de Conversão de Fundo de Funil
          </AlertTitle>
          <AlertDescription className="font-medium">
            A taxa de conversão final está em {currentConversion}%. O patamar mínimo esperado é 25%.
            Verifique os motivos de perda recentes.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> Taxa de Conversão por Etapa
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionPerStageData} margin={{ left: -20, right: 20, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} unit="%" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Conversão (%)"
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" /> Tempo Médio por Etapa (Dias)
            </CardTitle>
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
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="days" name="Dias" fill="#0056B3" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg">Análise de Perda & Status dos Funis</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Motivo Principal</TableHead>
                    <TableHead className="text-right font-bold">Ocorrências</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Preço</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SLA/Prazo</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Já Tenho Parceiro</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">20</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cobertura</TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">10</TableCell>
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
                    <TableCell className="text-right font-bold">
                      {
                        state.leads.filter(
                          (l) =>
                            l.pipeline === 'Prospection' &&
                            l.stage !== 'Ganho' &&
                            l.stage !== 'Perda',
                        ).length
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-green-600">Nutrição</TableCell>
                    <TableCell className="text-right font-bold">
                      {state.leads.filter((l) => l.pipeline === 'Nutrition').length}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {isSupervisor && (
        <Card className="shadow-sm border-slate-200 mt-6" data-tour="tour-bottleneck">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Gargalos e Alertas (Tempo no
              Funil)
            </CardTitle>
            <div className="flex flex-wrap gap-3">
              <Select value={filterPipeline} onValueChange={setFilterPipeline}>
                <SelectTrigger className="w-[160px] bg-white h-9 border-slate-200 shadow-sm focus:ring-primary">
                  <SelectValue placeholder="Pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Funis</SelectItem>
                  <SelectItem value="Prospection">Prospecção</SelectItem>
                  <SelectItem value="Nutrition">Nutrição</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterConsultant} onValueChange={setFilterConsultant}>
                <SelectTrigger className="w-[160px] bg-white h-9 border-slate-200 shadow-sm focus:ring-primary">
                  <SelectValue placeholder="Consultor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Consultores</SelectItem>
                  {Array.from(new Set(state.leads.map((l) => l.owner))).map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Lead</TableHead>
                  <TableHead className="font-bold text-slate-700">Funil</TableHead>
                  <TableHead className="font-bold text-slate-700">Etapa Atual</TableHead>
                  <TableHead className="font-bold text-slate-700">Consultor</TableHead>
                  <TableHead className="font-bold text-slate-700">Tempo na Etapa</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottleneckLeads.map((lead) => {
                  const isStagnant = (lead.stalledDays || 0) >= 2
                  return (
                    <TableRow key={lead.id} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-slate-900">{lead.title}</TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {lead.pipeline === 'Prospection' ? 'Prospecção' : 'Nutrição'}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">{lead.stage}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{lead.owner}</TableCell>
                      <TableCell className="font-bold text-slate-700">
                        {lead.stalledDays || 0} dias
                      </TableCell>
                      <TableCell>
                        {isStagnant ? (
                          <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Estagnado
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200">
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-primary hover:bg-primary/10 hover:text-primary font-bold w-full"
                        >
                          <Link to={`/empresa/${lead.companyId}/360`}>Acessar</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {bottleneckLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                      Nenhum lead encontrado com os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
