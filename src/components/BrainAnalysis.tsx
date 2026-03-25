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
} from 'lucide-react'
import { Interaction } from '@/stores/useCrmStore'

export function BrainAnalysis({ interactions }: { interactions: Interaction[] }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [interactions])

  if (interactions.length === 0) {
    return null
  }

  if (loading) {
    return (
      <Card className="border-indigo-200/50 shadow-sm bg-indigo-50/30">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-20 w-full" />
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
        <CardTitle className="text-indigo-900 text-lg font-bold tracking-tight">
          O Cérebro (IA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5 relative z-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Objetivos Alcançados
            </h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1 bg-white/60 p-2.5 rounded-md border border-indigo-50">
              <li>Apresentação enviada com sucesso.</li>
              <li>Contato inicial com diretoria estabelecido.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Objeções & Pontos Críticos
            </h4>
            <div className="text-sm text-slate-600 bg-rose-50/50 p-2.5 rounded-md border border-rose-100/50 space-y-2">
              <p>
                <span className="font-semibold text-rose-700">Objeção:</span> "Aguardando feedback"
                indica possível lentidão no processo decisório.
              </p>
              <p>
                <span className="font-semibold text-rose-700">Crítico:</span> Falta mapeamento claro
                de volumetria e SLA atual.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Avaliação de FIT
            </h4>
            <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-md border border-indigo-50">
              <div className="text-2xl font-black text-amber-600">85%</div>
              <p className="text-xs text-slate-600 leading-tight">
                Alto potencial. Perfil da empresa alinhado com operações de carga seca fracionada.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Próximos Passos
            </h4>
            <ul className="text-sm text-slate-600 list-none space-y-1.5 bg-blue-50/30 p-2.5 rounded-md border border-blue-100/50">
              <li className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Agendar
                call de alinhamento técnico.
              </li>
              <li className="flex items-start gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Solicitar
                histórico de faturamento para simulação.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-indigo-100/60 space-y-3">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" /> Estratégia Sugerida & Copy
          </h4>
          <div className="bg-white rounded-lg p-3.5 border border-indigo-100 shadow-sm relative group">
            <div className="absolute top-3 right-3 text-indigo-300 group-hover:text-indigo-500 transition-colors cursor-pointer">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-[11px] font-semibold text-indigo-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Sugestão para WhatsApp
            </p>
            <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
              "Olá [Nome], vi que receberam nossa apresentação. Sei que a rotina é corrida, então
              queria propor uma simulação sem compromisso. Se me passarem uma fatura recente, mostro
              na prática como a Transzecão otimizaria esse custo e prazo. O que acha?"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
