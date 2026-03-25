import { useState } from 'react'
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  Activity,
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

export default function Index() {
  const { state } = useCrmStore()
  const [pipelineFilter, setPipelineFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const visibleLeads =
    state.role === 'Comercial'
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
  const nutritionCount = visibleLeads.filter((l) => l.pipeline === 'Nutrition').length
  const totalValue = visibleLeads.reduce((acc, curr) => acc + curr.value, 0)

  const getScoreColor = (score?: string) => {
    if (score === 'Hot') return 'bg-red-500 text-white border-red-600'
    if (score === 'Warm') return 'bg-orange-400 text-white border-orange-500'
    if (score === 'Cold') return 'bg-blue-400 text-white border-blue-500'
    return 'bg-slate-200 text-slate-800 border-slate-300'
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard de Leads</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhamento central de prospecção e nutrição comercial.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-violet-500 to-indigo-600 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Users className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-white/90">Leads Prospecção</CardTitle>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black">{prospectionCount}</div>
            <p className="text-xs text-white/80 mt-1">Ativos no funil de vendas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Activity className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-white/90">Leads Nutrição</CardTitle>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black">{nutritionCount}</div>
            <p className="text-xs text-white/80 mt-1">Aguardando aquecimento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <DollarSign className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-white/90">Em Negociação</CardTitle>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black tracking-tight">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-white/80 mt-1">Valor potencial em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 border-none shadow-md text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 p-4">
            <Clock className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-white/90">
              T. Conversão Média
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black">28 Dias</div>
            <p className="text-xs text-white/80 mt-1">Tempo total (Contato ao Ganho)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <CardTitle className="text-lg text-slate-800">
              Tabela de Leads e Oportunidades
            </CardTitle>
            <CardDescription>Gerencie todos os contatos ativos na sua base.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px] bg-white"
              />
            </div>
            <Select value={pipelineFilter} onValueChange={setPipelineFilter}>
              <SelectTrigger className="w-[160px] bg-white">
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
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
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Nome / Empresa</TableHead>
                <TableHead className="font-semibold text-slate-700">Pipeline</TableHead>
                <TableHead className="font-semibold text-slate-700">Status (Etapa)</TableHead>
                <TableHead className="font-semibold text-slate-700">Último Contato</TableHead>
                <TableHead className="font-semibold text-slate-700">Score</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{lead.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        lead.pipeline === 'Prospection'
                          ? 'bg-violet-50 text-violet-700 border-violet-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }
                    >
                      {lead.pipeline === 'Prospection' ? 'Prospecção' : 'Nutrição'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{lead.stage}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{lead.updatedAt}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getScoreColor(lead.score)}>
                      {getScoreLabel(lead.score)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
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
