import { useState } from 'react'
import {
  Users,
  TrendingUp,
  Activity,
  Award,
  Filter,
  Search,
  MoreHorizontal,
  BrainCircuit,
} from 'lucide-react'
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
import useCrmStore from '@/stores/useCrmStore'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ConsultantPerformance } from '@/components/ConsultantPerformance'
import { calculateAIProbability } from '@/utils/aiPredict'

export default function Index() {
  const { state } = useCrmStore()
  const [pipelineFilter, setPipelineFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const isRestrictedView = ['Comercial'].includes(state.role)
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Comercial</h1>
        <p className="text-slate-500 font-medium mt-1">
          Acompanhamento central de prospecção e metas.
        </p>
      </div>

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
