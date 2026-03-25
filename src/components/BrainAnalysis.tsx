import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BrainCircuit,
  CheckCircle,
  Target,
  AlertTriangle,
  MessageSquareQuote,
  Zap,
  TrendingUp,
  FileText,
  ShieldAlert,
  ArrowRightLeft,
} from 'lucide-react'
import { Interaction } from '@/stores/useCrmStore'

export function BrainAnalysis({ interactions }: { interactions: Interaction[] }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [interactions])

  if (interactions.length === 0) return null

  if (loading) {
    return (
      <Card className="border-indigo-200/50 shadow-sm bg-indigo-50/30">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-indigo-200/80 shadow-md bg-gradient-to-br from-indigo-50/80 to-white relative overflow-hidden">
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none">
        <BrainCircuit className="w-40 h-40 text-indigo-900" />
      </div>
      <CardHeader className="pb-3 flex flex-row items-center gap-2 border-b border-indigo-100/50 bg-indigo-50/50">
        <div className="bg-indigo-100 p-1.5 rounded-lg border border-indigo-200 shadow-sm">
          <BrainCircuit className="w-5 h-5 text-indigo-700" />
        </div>
        <div>
          <CardTitle className="text-indigo-900 text-lg font-bold tracking-tight">
            O Cérebro (IA)
          </CardTitle>
          <p className="text-xs text-indigo-600/80 font-medium">
            Diagnóstico inteligente do histórico 360º
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5 relative z-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Objetivos Alcançados
            </h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1 bg-emerald-50/30 p-2.5 rounded-md border border-emerald-100/50">
              <li>Apresentação institucional enviada e lida.</li>
              <li>Contato estabelecido com decisor (Diretor Comercial).</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Pontos Críticos
            </h4>
            <div className="text-sm text-slate-600 bg-rose-50/30 p-2.5 rounded-md border border-rose-100/50 space-y-2">
              <p>Falta mapeamento claro de volumetria mensal e SLA do contrato atual.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-500" /> Objeções Não Quebradas
            </h4>
            <div className="text-sm text-slate-600 bg-orange-50/30 p-2.5 rounded-md border border-orange-100/50">
              <p className="italic font-medium text-orange-800">
                "Já possuímos parceiro logístico consolidado."
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Avaliação de FIT
            </h4>
            <div className="flex items-center gap-3 bg-amber-50/30 p-2.5 rounded-md border border-amber-100/50">
              <div className="text-xl font-black text-amber-600">85%</div>
              <p className="text-xs text-slate-600 leading-tight">
                Alto potencial. Cluster e tipo de carga alinhados com operações Transzecão.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Próximos Passos Sugeridos
            </h4>
            <ul className="text-sm text-slate-600 list-none space-y-1.5 bg-blue-50/30 p-2.5 rounded-md border border-blue-100/50">
              <li className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Agendar
                call de alinhamento técnico de 15min.
              </li>
              <li className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Solicitar
                fatura recente para simulação comparativa.
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-violet-500" /> Sinais de
              Progresso/Regresso
            </h4>
            <div className="text-sm text-slate-600 bg-violet-50/30 p-2.5 rounded-md border border-violet-100/50 space-y-2">
              <p>
                <span className="text-emerald-600 font-bold">Progresso:</span> Abertura para receber
                material.
              </p>
              <p>
                <span className="text-rose-600 font-bold">Atenção:</span> "Aguardando feedback"
                indica possível lentidão no processo decisório.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-indigo-100/60 space-y-3">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" /> Copy Pronta para Próxima Ação
          </h4>
          <div className="bg-white rounded-lg p-3.5 border border-indigo-100 shadow-sm relative group">
            <div
              className="absolute top-3 right-3 text-indigo-300 group-hover:text-indigo-500 transition-colors cursor-pointer"
              title="Copiar texto"
            >
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-[11px] font-semibold text-indigo-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Sugestão para WhatsApp
            </p>
            <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
              "Olá [Nome], vi que receberam nossa apresentação. Sei que a rotina é corrida e já tem
              parceiro, mas queria propor um teste rápido. Se me passarem uma fatura recente, mostro
              na prática como otimizamos custo/prazo para seu cluster. O que acha?"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
