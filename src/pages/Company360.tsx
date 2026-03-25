import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, MapPin, Layers } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { InteractionsTimeline } from '@/components/InteractionsTimeline'
import { BrainAnalysis } from '@/components/BrainAnalysis'
import { Badge } from '@/components/ui/badge'

export default function Company360() {
  const { id } = useParams()
  const { state } = useCrmStore()

  const company = state.companies.find((c) => c.id === id) || state.companies[0]
  const interactions =
    state.interactions.filter((i) => i.companyId === company?.id) || state.interactions

  if (!company) {
    return (
      <div className="p-8 text-center font-medium text-slate-500">
        Empresa não encontrada no banco de dados.
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
          <Layers className="w-48 h-48" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-indigo-50 text-indigo-500"
          >
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight leading-tight">
              {company.nomeFantasia || company.razaoSocial}
            </h1>
            <p className="text-sm text-indigo-600/80 font-semibold uppercase tracking-wider mt-0.5">
              Visão 360º da Conta
            </p>
          </div>
        </div>
        <div className="relative z-10 w-full sm:w-auto">
          <Button
            asChild
            className="w-full sm:w-auto bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm font-semibold"
            variant="outline"
          >
            <Link to={`/empresa/${company.id}/editar`}>Abrir Ficha Cadastral</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <BrainAnalysis interactions={interactions} />
          <InteractionsTimeline />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-indigo-100 shadow-sm bg-white/90 backdrop-blur-sm sticky top-20">
            <CardHeader className="pb-3 border-b border-indigo-50 bg-indigo-50/30">
              <CardTitle className="text-lg text-indigo-950 font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" /> Resumo da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5 text-sm">
              <div>
                <span className="text-indigo-400 font-bold uppercase text-[10px] block mb-1 tracking-widest">
                  CNPJ
                </span>
                <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">
                  {company.cnpj}
                </span>
              </div>
              <div>
                <span className="text-indigo-400 font-bold uppercase text-[10px] block mb-1.5 tracking-widest">
                  Segmento
                </span>
                <Badge
                  variant="outline"
                  className="bg-white border-indigo-200 text-indigo-700 font-bold"
                >
                  {company.segmento || 'Não definido'}
                </Badge>
              </div>
              <div>
                <span className="text-indigo-400 font-bold uppercase text-[10px] block mb-1.5 tracking-widest">
                  Clusters de Atuação
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {company.clusters?.map((c) => (
                    <Badge
                      key={c}
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors font-medium border border-indigo-100/50"
                    >
                      <MapPin className="w-3 h-3 mr-1" /> {c}
                    </Badge>
                  ))}
                  {(!company.clusters || company.clusters.length === 0) && (
                    <span className="text-slate-400 italic text-xs">Nenhum cluster mapeado</span>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-50">
                <span className="text-indigo-400 font-bold uppercase text-[10px] block mb-1.5 tracking-widest">
                  Pipeline Atual
                </span>
                <Badge
                  className={cn(
                    'text-xs py-1',
                    company.pipeline === 'Pipeline de Prospecção' ||
                      company.pipeline === 'Prospection'
                      ? 'bg-violet-600 hover:bg-violet-700'
                      : 'bg-amber-500 hover:bg-amber-600 text-amber-950',
                  )}
                >
                  {company.pipeline === 'Prospection'
                    ? 'Pipeline de Prospecção'
                    : company.pipeline || 'Sem Pipeline'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
