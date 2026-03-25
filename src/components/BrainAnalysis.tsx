import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BrainCircuit,
  CheckCircle,
  Target,
  MessageSquareQuote,
  Zap,
  FileText,
  Edit2,
  Save,
  MessageCircleQuestion,
  ShieldCheck,
  ListChecks,
} from 'lucide-react'
import { Interaction } from '@/stores/useCrmStore'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

export function BrainAnalysis({ interactions }: { interactions: Interaction[] }) {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const canEditRules = ['Master', 'Supervisor'].includes(state.role)

  const defaultAnalysis = {
    achieved: [
      'Apresentação institucional enviada e lida.',
      'Contato inicial estabelecido com o Diretor Comercial.',
    ],
    objections: [
      {
        text: '"Já possuímos parceiro logístico consolidado."',
        rebuttal: 'Sugerir um teste leve com 1 carga fracionada para rota secundária.',
      },
    ],
    fit: '85',
    fitText:
      'Estrutura pronta para campos pré-definidos. Cluster alinhado com a malha da Transzecão.',
    nextSteps: [
      'Agendar call de alinhamento técnico de 15min.',
      'Solicitar fatura recente para simulação comparativa na nossa tabela.',
    ],
    copy: '"Olá [Nome], vi que receberam nossa apresentação. Sei que a rotina é corrida e já tem parceiro, mas queria propor um teste rápido. Se me passarem uma fatura recente, mostro na prática como otimizamos custo/prazo para seu cluster. O que acha?"',
  }

  const [analysis, setAnalysis] = useState(defaultAnalysis)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
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
        <div className="flex-1">
          <CardTitle className="text-indigo-900 text-lg font-bold tracking-tight">
            "O Cérebro" - Painel de Inteligência (IA)
          </CardTitle>
          <p className="text-xs text-indigo-600/80 font-medium">
            Diagnóstico baseado nas últimas interações, emails e ligações.
          </p>
        </div>
        {canEditRules && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isEditing) toast({ title: 'Critérios de FIT e Diagnóstico atualizados!' })
              setIsEditing(!isEditing)
            }}
            className="text-indigo-700 border-indigo-200 bg-white shadow-sm"
          >
            {isEditing ? <Save className="w-4 h-4 mr-1" /> : <Edit2 className="w-4 h-4 mr-1" />}
            {isEditing ? 'Salvar Análise' : 'Ajustar Critérios de FIT'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5 pt-5 relative z-10">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Objetivos Alcançados
            </h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1.5 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100/50 h-full">
              {analysis.achieved.map((item, i) => (
                <li key={i} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-blue-500" /> Próximos Passos (Sugeridos)
            </h4>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1.5 bg-blue-50/40 p-3 rounded-lg border border-blue-100/50 h-full">
              {analysis.nextSteps.map((item, i) => (
                <li key={i} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Avaliação de FIT (0-100)
            </h4>
            <div className="flex items-center gap-4 bg-amber-50/40 p-3.5 rounded-lg border border-amber-200/50 shadow-inner">
              {isEditing ? (
                <Input
                  type="number"
                  value={analysis.fit}
                  onChange={(e) => setAnalysis({ ...analysis, fit: e.target.value })}
                  className="w-24 font-black text-amber-600 h-9 text-lg"
                />
              ) : (
                <div className="text-3xl font-black text-amber-600 tracking-tight">
                  {analysis.fit}
                  <span className="text-lg">%</span>
                </div>
              )}
              {isEditing ? (
                <Input
                  value={analysis.fitText}
                  onChange={(e) => setAnalysis({ ...analysis, fitText: e.target.value })}
                  className="text-sm h-9 flex-1"
                />
              ) : (
                <p className="text-sm text-slate-700 font-medium leading-snug flex-1">
                  {analysis.fitText}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircleQuestion className="w-3.5 h-3.5 text-rose-500" /> Quebra de Objeções
            </h4>
            <div className="space-y-2">
              {analysis.objections.map((obj, i) => (
                <div
                  key={i}
                  className="bg-rose-50/30 p-3 rounded-lg border border-rose-100 flex flex-col gap-2"
                >
                  <div className="text-sm font-semibold text-rose-900 border-l-2 border-rose-400 pl-2 italic">
                    {obj.text}
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/50 px-3 py-2 rounded-md flex items-start gap-2 border border-emerald-200/50">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>
                      <span className="uppercase text-[10px] tracking-widest text-emerald-600 block mb-0.5">
                        Sugestão da IA:
                      </span>{' '}
                      {obj.rebuttal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-indigo-100/80 space-y-3">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" /> Ready Copy (Mensagem Personalizada)
          </h4>
          <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-sm relative group">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 h-8 px-2"
              title="Copiar texto"
              onClick={() => {
                navigator.clipboard.writeText(analysis.copy)
                toast({ title: 'Copy Copiada para a área de transferência!' })
              }}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Copiar
            </Button>

            <p className="text-[11px] font-bold text-indigo-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Mensagem Gerada para o Lead
            </p>
            <p className="text-sm font-medium text-slate-700 italic leading-relaxed pr-20">
              {analysis.copy}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
