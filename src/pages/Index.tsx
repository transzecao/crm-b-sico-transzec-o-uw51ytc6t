import { useState } from 'react'
import {
  Users,
  TrendingUp,
  DollarSign,
  Filter,
  Search,
  MoreHorizontal,
  Activity,
  Award,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { formatCurrency } from '@/utils/formatters'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
  const totalValue = visibleLeads.reduce((acc, curr) => acc + curr.value, 0)

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
        <h1 className="text-3xl font-bold tracking-tight text-indigo-950">Dashboard Comercial</h1>
        <p className="text-indigo-600/80 font-medium mt-1">
          Acompanhamento central de prospecção.{' '}
          {isRestrictedView ? 'Visão do seu funil.' : 'Visão Geral da Companhia.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Activity className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-100">
              Leads em Andamento
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">{prospectionCount}</div>
            <p className="text-xs text-indigo-200 mt-1 font-medium">Ativos no funil de vendas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <TrendingUp className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-100">
              Taxa de Conversão
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black">22.4%</div>
            <p className="text-xs text-blue-200 mt-1 font-medium">Média Histórica</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Award className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-violet-100">
              Metas Alcançadas
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight">80%</div>
            <p className="text-xs text-violet-200 mt-1 font-medium">
              Volume da carteira: {formatCurrency(totalValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-indigo-100 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-indigo-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-50/30">
          <div>
            <CardTitle className="text-lg text-indigo-950 font-bold">
              Tabela de Leads e Oportunidades
            </CardTitle>
            <CardDescription className="font-medium">
              Gerencie os contatos ativos na sua base.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[220px] bg-white border-indigo-100 focus-visible:ring-indigo-500/50"
              />
            </div>
            <Select value={pipelineFilter} onValueChange={setPipelineFilter}>
              <SelectTrigger className="w-[160px] bg-white border-indigo-100">
                <Filter className="w-4 h-4 mr-2 text-indigo-500" />
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
            <TableHeader className="bg-indigo-50/50">
              <TableRow className="border-indigo-100">
                <TableHead className="font-bold text-indigo-900">Nome / Empresa</TableHead>
                <TableHead className="font-bold text-indigo-900">Pipeline</TableHead>
                <TableHead className="font-bold text-indigo-900">Status (Etapa)</TableHead>
                <TableHead className="font-bold text-indigo-900">Último Contato</TableHead>
                <TableHead className="font-bold text-indigo-900">Score</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="hover:bg-indigo-50/30 transition-colors border-indigo-50/50"
                >
                  <TableCell className="font-bold text-indigo-950">{lead.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        lead.pipeline === 'Prospection'
                          ? 'bg-violet-100 text-violet-700 border-violet-200 font-bold'
                          : 'bg-amber-100 text-amber-700 border-amber-200 font-bold'
                      }
                    >
                      {lead.pipeline === 'Prospection' ? 'Prospecção' : 'Nutrição'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{lead.stage}</TableCell>
                  <TableCell className="text-slate-500 text-sm font-medium">
                    {lead.updatedAt}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('font-bold', getScoreColor(lead.score))}>
                      {getScoreLabel(lead.score)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/empresa/${lead.companyId}/360`}>
                      <button
                        className="p-2 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors"
                        title="Ver 360º"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">
                    Nenhum lead encontrado com os filtros atuais.
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
