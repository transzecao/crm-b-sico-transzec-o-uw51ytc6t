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
import { useToast } from '@/hooks/use-toast'

export function BrainAnalysis({ interactions }: { interactions: Interaction[] }) {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const defaultAnalysis = {
    achieved: [
      'Apresentação institucional enviada e lida.',
      'Contato estabelecido com decisor (Diretor Comercial).',
    ],
    critical: ['Falta mapeamento claro de volumetria mensal e SLA do contrato atual.'],
    objections: ['"Já possuímos parceiro logístico consolidado."'],
    fit: '85%',
    fitText: 'Estrutura pronta para campos pré-definidos. Cluster alinhado com Transzecão.',
    nextSteps: [
      'Agendar call de alinhamento técnico de 15min.',
      'Solicitar fatura recente para simulação comparativa.',
    ],
    signals: {
      advance: 'Abertura para receber material.',
      retreat: '"Aguardando feedback" indica possível lentidão no processo.',
    },
    copy: '"Olá [Nome], vi que receberam nossa apresentação. Sei que a rotina é corrida e já tem parceiro, mas queria propor um teste rápido. Se me passarem uma fatura recente, mostro na prática como otimizamos custo/prazo para seu cluster. O que acha?"',
  }

  const [analysis, setAnalysis] = useState(defaultAnalysis)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const latest = interactions[0]
      if (
        latest &&
        latest.type === 'whatsapp' &&
        latest.content
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes('ja tenho parceiro')
      ) {
        setAnalysis({
          achieved: ['Contato inicial realizado e objeção identificada.'],
          critical: ['Cliente mencionou que já possui parceiro concorrente.'],
          objections: ['Already has a partner -> suggest test in specific region.'],
          fit: '90%',
          fitText: 'Estrutura pronta para preenchimento de campos pré-definidos.',
          nextSteps: ['Propose test in Sumaré with a 48h window.'],
          signals: {
            advance: 'Cliente respondeu rapidamente.',
            retreat: 'Objeção direta de fornecedor atual.',
          },
          copy: '"Hello [Name], I saw that you already have a partner. Can we explore a specific route in Sumaré to reduce costs? Can I send you the details?"',
        })
      } else {
        setAnalysis(defaultAnalysis)
      }
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [interactions])

  if (interactions.length === 0) return null
  if (loading)
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
            The Brain (IA)
          </CardTitle>
          <p className="text-xs text-indigo-600/80 font-medium">
            Diagnóstico inteligente gerado em tempo real
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5 relative z-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 1) Achieved Goals
            </h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1 bg-emerald-50/30 p-2.5 rounded-md border border-emerald-100/50">
              {analysis.achieved.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> 3) Critical Points
            </h4>
            <div className="text-sm text-slate-600 bg-rose-50/30 p-2.5 rounded-md border border-rose-100/50 space-y-2">
              {analysis.critical.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-500" /> 4) Unresolved Objections
            </h4>
            <div className="text-sm text-slate-600 bg-orange-50/30 p-2.5 rounded-md border border-orange-100/50">
              {analysis.objections.map((item, i) => (
                <p key={i} className="italic font-medium text-orange-800">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> 5) FIT Evaluation
            </h4>
            <div className="flex items-center gap-3 bg-amber-50/30 p-2.5 rounded-md border border-amber-100/50">
              <div className="text-xl font-black text-amber-600">{analysis.fit}</div>
              <p className="text-xs text-slate-600 leading-tight">{analysis.fitText}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> 2) Next Steps
            </h4>
            <ul className="text-sm text-slate-600 list-none space-y-1.5 bg-blue-50/30 p-2.5 rounded-md border border-blue-100/50">
              {analysis.nextSteps.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-violet-500" /> 6) Advancement/Retreat
              Signals
            </h4>
            <div className="text-sm text-slate-600 bg-violet-50/30 p-2.5 rounded-md border border-violet-100/50 space-y-2">
              <p>
                <span className="text-emerald-600 font-bold">Avanço:</span>{' '}
                {analysis.signals.advance}
              </p>
              <p>
                <span className="text-rose-600 font-bold">Recuo:</span> {analysis.signals.retreat}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-indigo-100/60 space-y-3">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" /> 7) Next Message Copy Suggestion
          </h4>
          <div className="bg-white rounded-lg p-3.5 border border-indigo-100 shadow-sm relative group">
            <div
              className="absolute top-3 right-3 text-indigo-300 group-hover:text-indigo-500 transition-colors cursor-pointer"
              title="Copiar texto"
              onClick={() => {
                navigator.clipboard.writeText(analysis.copy)
                toast({ title: 'Copiado!' })
              }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-[11px] font-semibold text-indigo-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Sugestão Estratégica
            </p>
            <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
              {analysis.copy}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
