import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, MapPin } from 'lucide-react'
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
    return <div className="p-8">Empresa não encontrada.</div>
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 bg-white/80 p-4 rounded-xl border border-slate-200 shadow-sm">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/empresas">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {company.nomeFantasia || company.razaoSocial}
          </h1>
          <p className="text-sm text-slate-500 font-medium">Visão 360º da Conta Comercial</p>
        </div>
        <div className="ml-auto">
          <Button
            asChild
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Link to={`/empresa/${company.id}/editar`}>Editar Ficha</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <BrainAnalysis interactions={interactions} />
          <InteractionsTimeline />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white/80">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg text-slate-800">Resumo da Conta</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1 tracking-wider">
                  CNPJ
                </span>
                <span className="font-medium text-slate-900">{company.cnpj}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1 tracking-wider">
                  Segmento
                </span>
                <Badge variant="outline">{company.segmento || 'Não definido'}</Badge>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1 tracking-wider">
                  Clusters
                </span>
                <div className="flex flex-wrap gap-1">
                  {company.clusters?.map((c) => (
                    <Badge key={c} variant="secondary" className="bg-slate-100">
                      <MapPin className="w-3 h-3 mr-1" /> {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1 tracking-wider">
                  Pipeline Atual
                </span>
                <Badge
                  className={
                    company.pipeline === 'Pipeline de Prospecção' ? 'bg-violet-500' : 'bg-amber-500'
                  }
                >
                  {company.pipeline || 'Sem Pipeline'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
