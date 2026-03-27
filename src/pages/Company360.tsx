import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Layers,
  MessageSquareWarning,
  ShieldCheck,
  DollarSign,
  Reply,
} from 'lucide-react'
import useCrmStore, { Interaction } from '@/stores/useCrmStore'
import { InteractionsTimeline } from '@/components/InteractionsTimeline'
import { BrainAnalysis } from '@/components/BrainAnalysis'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function Company360() {
  const { id } = useParams()
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const company = state.companies.find((c) => c.id === id) || state.companies[0]
  const interactions = state.interactions.filter((i) => i.companyId === company?.id)

  const canSimulate = ['Acesso Master', 'Supervisor Comercial', 'Funcionário Comercial'].includes(
    state.role,
  )

  if (!company) {
    return <div className="p-8 text-center font-medium text-slate-500">Empresa não encontrada.</div>
  }

  const simulateObjection = () => {
    if (!canSimulate) return toast({ title: 'Acesso Negado', variant: 'destructive' })

    const newInteraction: Interaction = {
      id: Math.random().toString(36).substring(7),
      companyId: company.id,
      type: 'email',
      content:
        'Agradeço muito a apresentação enviada, mas no momento eu já tenho parceiro logístico consolidado que nos atende bem em todas as rotas e não pretendo trocar.',
      date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      author: 'Cliente (Inbound)',
      subject: 'Re: Apresentação Comercial Transzecão',
    }

    updateState({
      interactions: [...state.interactions, newInteraction],
    })

    toast({
      title: 'Objeção Recebida! (Simulação Inbound)',
      description: 'O cliente respondeu ao e-mail. A IA The Brain está reprocessando os dados...',
    })
  }

  const simulateInbound = (price: boolean) => {
    if (!canSimulate) return toast({ title: 'Acesso Negado', variant: 'destructive' })

    const lead = state.leads.find((l) => l.companyId === company.id)
    if (lead) {
      updateState({
        leads: state.leads.map((l) =>
          l.id === lead.id
            ? {
                ...l,
                pipeline: 'Prospection',
                stage: price ? 'Negociação' : 'Primeiro contato',
              }
            : l,
        ),
      })
      toast({
        title: 'Inbound Recebido',
        description: `Lead reativado e movido para ${price ? 'Negociação' : 'Primeiro contato'} na Prospecção.`,
      })
    } else {
      toast({
        title: 'Nenhum Lead Ativo',
        description: 'Crie um lead para esta empresa primeiro.',
      })
    }
  }

  const isCnpjValid = company.cnpj.replace(/\D/g, '').length === 14

  const addressStr =
    `${company.logradouro || company.endereco}, ${company.numero || ''}, ${company.cidade || ''}`
      .replace(/,\s*,/g, ',')
      .replace(/,\s*$/, '')
      .trim()
  const mapQuery = encodeURIComponent(
    addressStr.length > 5 ? addressStr : company.cidade || company.nomeFantasia || 'Brasil',
  )

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" asChild className="hover:bg-slate-100 text-slate-500">
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="bg-primary p-2.5 rounded-xl text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {company.nomeFantasia || company.razaoSocial}
            </h1>
            <p className="text-sm text-primary font-bold uppercase tracking-wider mt-0.5">
              Visão 360º da Conta
            </p>
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2">
          {canSimulate && (
            <>
              <Button
                onClick={simulateObjection}
                className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 shadow-sm font-semibold"
                variant="outline"
                size="sm"
              >
                <MessageSquareWarning className="w-4 h-4 mr-1.5" /> Objeção "Parceiro"
              </Button>
              <Button
                onClick={() => simulateInbound(false)}
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm font-semibold"
                variant="outline"
                size="sm"
              >
                <Reply className="w-4 h-4 mr-1.5" /> Inbound Comum
              </Button>
              <Button
                onClick={() => simulateInbound(true)}
                className="bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 shadow-sm font-semibold"
                variant="outline"
                size="sm"
              >
                <DollarSign className="w-4 h-4 mr-1.5" /> Inbound Preço
              </Button>
            </>
          )}
          <Button
            asChild
            className="bg-white border-primary/30 text-primary hover:bg-primary/5 shadow-sm font-bold"
            variant="outline"
            size="sm"
          >
            <Link to={`/empresa/${company.id}/editar`}>Ficha</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <BrainAnalysis interactions={interactions} company={company} />

          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-900 font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> Localização (Google My Maps)
              </CardTitle>
            </CardHeader>
            <div className="h-[300px] w-full bg-slate-100">
              <iframe
                title="Google My Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              ></iframe>
            </div>
          </Card>

          <InteractionsTimeline interactions={interactions} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white sticky top-20">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-900 font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-secondary" /> Resumo da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5 text-sm">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1 tracking-widest">
                  CNPJ
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block">
                    {company.cnpj}
                  </span>
                  {isCnpjValid ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 py-0.5"
                    >
                      <ShieldCheck className="w-3 h-3 mr-1" /> Validado
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-rose-50 text-rose-700 border-rose-200 py-0.5"
                    >
                      Inválido
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1.5 tracking-widest">
                  Segmento
                </span>
                <Badge
                  variant="outline"
                  className="bg-white border-slate-200 text-slate-700 font-bold"
                >
                  {company.segmento || 'Não definido'}
                </Badge>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1.5 tracking-widest">
                  Clusters
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {company.clusters?.map((c) => (
                    <Badge
                      key={c}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold"
                    >
                      <MapPin className="w-3 h-3 mr-1" /> {c}
                    </Badge>
                  ))}
                  {(!company.clusters || company.clusters.length === 0) && (
                    <span className="text-slate-400 italic text-xs">Nenhum mapeado</span>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1.5 tracking-widest">
                  Pipeline Atual
                </span>
                <Badge
                  className={cn(
                    'text-xs py-1 px-3',
                    company.pipeline === 'Pipeline de Prospecção' ||
                      company.pipeline === 'Prospection'
                      ? 'bg-primary text-white'
                      : 'bg-green-600 text-white',
                  )}
                >
                  {company.pipeline === 'Prospection'
                    ? 'Prospecção'
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
