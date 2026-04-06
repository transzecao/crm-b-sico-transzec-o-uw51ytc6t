import { useState, useEffect } from 'react'
import {
  Users,
  TrendingUp,
  Activity,
  Award,
  Filter,
  Search,
  MoreHorizontal,
  BrainCircuit,
  Bell,
  Mail,
  ClipboardCheck,
  ChevronRight,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import useCrmStore, { Role } from '@/stores/useCrmStore'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ConsultantPerformance } from '@/components/ConsultantPerformance'
import { calculateAIProbability } from '@/utils/aiPredict'

function PendingApprovalsShortcut({ role }: { role: string }) {
  const isAuthorized = ['Acesso Master', 'Supervisor Comercial'].includes(role)
  const [count, setCount] = useState(0)

  const fetchCount = async () => {
    try {
      const res = await pb
        .collection('leads')
        .getList(1, 1, { filter: "status = 'pending_approval'" })
      setCount(res.totalItems)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (isAuthorized) fetchCount()
  }, [isAuthorized])

  useRealtime('leads', () => {
    if (isAuthorized) fetchCount()
  })

  if (!isAuthorized) return null

  return (
    <Link to="/supervisor/approvals" className="block mb-6">
      <Card className="bg-slate-900 border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <CardContent className="flex items-center justify-between p-4 sm:p-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-xl group-hover:bg-blue-500/30 transition-colors border border-blue-500/20">
              <ClipboardCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Aprovações Pendentes</h3>
              <p className="text-slate-400 text-sm hidden sm:block">
                Gerencie novos cadastros aguardando liberação de acesso
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {count > 0 ? (
              <Badge className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 text-sm font-bold shadow-sm shadow-rose-500/20 animate-pulse">
                {count} aguardando
              </Badge>
            ) : (
              <Badge className="bg-slate-800 text-slate-400 border-slate-700 px-3 py-1 text-sm font-medium">
                0 aguardando
              </Badge>
            )}
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function SupervisorNotificationCenter({ role }: { role: Role }) {
  const isComercial = role === 'Supervisor Comercial' || role === 'Acesso Master'
  const isFinanceiro = role === 'Supervisor Financeiro' || role === 'Acesso Master'
  const isColeta = role === 'Supervisor Coleta' || role === 'Acesso Master'

  if (!isComercial && !isFinanceiro && !isColeta) return null

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {isComercial && (
        <Alert className="bg-purple-50 border-purple-200">
          <AlertTitle className="text-purple-800 font-bold flex items-center gap-2">
            <Bell className="w-4 h-4" /> Comercial
          </AlertTitle>
          <AlertDescription className="text-purple-700 text-xs mt-2">
            <strong>Saúde da Ferramenta:</strong> Pipeline 1 e 2 operando normalmente.
            <br />
            <strong>Atenção:</strong> 3 leads sem interação há mais de 2 dias.
          </AlertDescription>
        </Alert>
      )}
      {isFinanceiro && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800 font-bold flex items-center gap-2">
            <Bell className="w-4 h-4" /> Financeiro
          </AlertTitle>
          <AlertDescription className="text-blue-700 text-xs mt-2">
            <strong>Saúde da Ferramenta:</strong> Cotação com API ANTT instável nas últimas 2h.
            <br />
            <strong>Atenção:</strong> 5 novas cotações geradas com margem abaixo do padrão.
          </AlertDescription>
        </Alert>
      )}
      {isColeta && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800 font-bold flex items-center gap-2">
            <Bell className="w-4 h-4" /> Coleta
          </AlertTitle>
          <AlertDescription className="text-amber-700 text-xs mt-2">
            <strong>Saúde da Ferramenta:</strong> Roteirização e mapas OK.
            <br />
            <strong>Atenção:</strong> 2 rotas com desvio de percurso detectado hoje.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function LeadRecoveryAutomation() {
  const { state, logAccess } = useCrmStore()
  const { toast } = useToast()

  const criticalLeads = state.leads.filter(
    (l) =>
      l.pipeline === 'Prospection' &&
      l.stage !== 'Ganho' &&
      l.stage !== 'Perda' &&
      calculateAIProbability(l, state.interactions) < 40,
  )

  const triggerRecovery = (leadId: string) => {
    toast({
      title: 'Automação Disparada',
      description: 'Mensagem gerada por IA enviada via E-mail/WhatsApp oferecendo "Teste Leve".',
    })
    logAccess(`Disparou recuperação automática para Lead ${leadId}`)
  }

  if (criticalLeads.length === 0) return null

  return (
    <Card className="mb-6 border-rose-200 shadow-sm">
      <CardHeader className="bg-rose-50 border-b border-rose-100 pb-3">
        <CardTitle className="text-rose-800 text-sm font-bold flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" /> Automação de Recuperação de Leads (Probabilidade
          Crítica)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {criticalLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between bg-white p-3 rounded border border-rose-100 shadow-sm"
          >
            <div>
              <p className="font-bold text-slate-800 text-sm">{lead.title}</p>
              <p className="text-xs text-rose-600 font-semibold">
                Probabilidade IA: {calculateAIProbability(lead, state.interactions)}%
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-rose-700 border-rose-200 hover:bg-rose-50"
              onClick={() => triggerRecovery(lead.id)}
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Disparar Recuperação IA
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function Index() {
  const { state } = useCrmStore()
  const [pipelineFilter, setPipelineFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const isRestrictedView = [
    'Funcionário Comercial',
    'Funcionário Marketing',
    'Funcionário Coleta',
    'Funcionário Financeiro',
    'Funcionário Prospecção',
  ].includes(state.role)
  const visibleLeads = isRestrictedView
    ? state.leads.filter((l) => l.owner === state.currentUser.name)
    : state.leads

  const filteredLeads = visibleLeads.filter((l) => {
    const matchesPipeline =
      pipelineFilter === 'all' ||
      (pipelineFilter === 'prospection' && l.pipeline === 'Prospection') ||
      (pipelineFilter === 'nutrition' && l.pipeline === 'Nutrition')
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPipeline && matchesSearch
  })

  const prospectionCount = visibleLeads.filter((l) => l.pipeline === 'Prospection').length

  const getScoreColor = (score?: string) => {
    if (score === 'Hot') return 'bg-rose-100 text-rose-700 border-rose-200'
    if (score === 'Warm') return 'bg-amber-100 text-amber-700 border-amber-200'
    if (score === 'Cold') return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const getScoreLabel = (score?: string) => {
    if (score === 'Hot') return 'Quente'
    if (score === 'Warm') return 'Morno'
    if (score === 'Cold') return 'Frio'
    return 'N/A'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">
          Visão central do sistema e status das operações.
        </p>
      </div>

      <PendingApprovalsShortcut role={state.role} />

      <SupervisorNotificationCenter role={state.role} />
      {['Acesso Master', 'Supervisor Comercial', 'Funcionário Comercial'].includes(state.role) && (
        <LeadRecoveryAutomation />
      )}

      <ConsultantPerformance />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Activity className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/80">
              Leads Ativos
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">{prospectionCount}</div>
            <p className="text-xs text-white/60 mt-1 font-medium">Em funil de prospecção</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <TrendingUp className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/80">
              Taxa de Conversão
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">22.4%</div>
            <p className="text-xs text-white/60 mt-1 font-medium">Média Histórica</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Award className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/80">
              Metas Alcançadas
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight">80%</div>
            <p className="text-xs text-white/60 mt-1 font-medium">8 de 10 clientes fechados</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <CardTitle className="text-lg text-slate-800 font-bold">
              Leads e Oportunidades
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[220px] bg-white border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <Select value={pipelineFilter} onValueChange={setPipelineFilter}>
              <SelectTrigger className="w-[160px] bg-white border-slate-200">
                <Filter className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="Pipeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Funis</SelectItem>
                <SelectItem value="prospection">Prospecção</SelectItem>
                <SelectItem value="nutrition">Nutrição</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">Nome do Lead</TableHead>
                <TableHead className="font-bold text-slate-700">Pipeline</TableHead>
                <TableHead className="font-bold text-slate-700">Status</TableHead>
                <TableHead className="font-bold text-slate-700">Score</TableHead>
                <TableHead className="font-bold text-slate-700">
                  <div className="flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-500" /> Prob. IA
                  </div>
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const prob = calculateAIProbability(lead, state.interactions)
                return (
                  <TableRow key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-bold text-slate-900">{lead.title}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          lead.pipeline === 'Prospection'
                            ? 'bg-primary text-white font-bold hover:bg-primary'
                            : 'bg-green-600 text-white font-bold hover:bg-green-600'
                        }
                      >
                        {lead.pipeline === 'Prospection' ? 'Prospecção' : 'Nutrição'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{lead.stage}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('font-bold uppercase text-[10px]', getScoreColor(lead.score))}
                      >
                        {getScoreLabel(lead.score)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'font-bold font-mono text-[11px]',
                          prob >= 70
                            ? 'bg-emerald-100 text-emerald-700'
                            : prob >= 40
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        {prob}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/empresa/${lead.companyId}/360`}>
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
