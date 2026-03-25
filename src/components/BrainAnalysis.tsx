import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const canEditRules = ['Master', 'Supervisor'].includes(state.role)

  const defaultAnalysis = {
    achieved: [
      'Apresentação institucional enviada e lida.',
      'Contato inicial estabelecido com o decisor logístico.',
    ],
    objections: [
      {
        text: 'Nenhuma objeção explícita detectada recentemente.',
        rebuttal: 'Manter cadência de nutrição padrão focada em valor e SLA.',
      },
    ],
    fit: '85',
    fitText: 'Cluster alinhado com a malha da Transzecão. Segmento compatível.',
    nextSteps: [
      'Agendar call de alinhamento técnico de 15min.',
      'Apresentar case de sucesso no mesmo segmento.',
    ],
    copy: '"Olá [Nome], vimos que acompanhou nossa apresentação. Gostaria de agendar 15 minutos na próxima terça para mostrar como reduzimos o índice de avarias em 30% para clientes do seu segmento. Qual o melhor horário para você?"',
  }

  const [analysis, setAnalysis] = useState(defaultAnalysis)

  useEffect(() => {
    if (interactions.length === 0) return

    setLoading(true)
    const timer = setTimeout(() => {
      let foundPartnerObjection = false

      interactions.forEach((i) => {
        const text = (i.content + ' ' + (i.transcription || '')).toLowerCase()
        if (
          text.includes('já tenho parceiro') ||
          text.includes('parceiro logístico') ||
          text.includes('já possuímos parceiro') ||
          text.includes('já somos atendidos')
        ) {
          foundPartnerObjection = true
        }
      })

      if (foundPartnerObjection) {
        const strictCopy = `Obrigado por compartilhar! Gostaria de entender melhor como seu parceiro atual atende suas necessidades logísticas. Isso me ajuda a oferecer uma solução mais alinhada.\n\nPodemos testar uma rota específica (ex.: São Paulo–Campinas) com uma janela de entrega flexível (ex.: 2 dias úteis) e uma carga de teste (ex.: 5 unidades). Isso leva menos de 1 hora para validar.\n\nQual é a média de entregas por semana? E qual o custo médio por carga com seu parceiro atual?`

        setAnalysis({
          achieved: [
            'Apresentação institucional enviada e lida.',
            'Contato estabelecido com a diretoria.',
            'Objeção principal identificada (Concorrência Atual).',
          ],
          objections: [
            {
              text: '"Já tenho parceiro logístico consolidado."',
              rebuttal:
                'Aplicar framework de Validação de Parceiro + Teste Leve + Coleta de Dados.',
            },
          ],
          fit: '92',
          fitText:
            'Apesar do parceiro atual, o volume potencial e cluster são altamente estratégicos para a malha da Transzecão.',
          nextSteps: [
            'Enviar mensagem empática de validação do parceiro.',
            'Propor um "Teste Leve" em rota secundária.',
            'Solicitar dados básicos (volumetria/custo) para estudo comparativo.',
          ],
          copy: strictCopy,
        })

        const alreadyLogged = interactions.some(
          (i) =>
            i.author === 'The Brain (IA)' && i.subject === '⚡ Diagnóstico de Objeção Automático',
        )

        if (!alreadyLogged) {
          setTimeout(() => {
            const newInteraction: Interaction = {
              id: Math.random().toString(36).substring(7),
              companyId: interactions[0].companyId,
              type: 'note',
              author: 'The Brain (IA)',
              date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
              subject: '⚡ Diagnóstico de Objeção Automático',
              content: `Objeção Identificada: "Já tenho parceiro"\n\nEstratégia Sugerida:\nAplicar framework de Validação de Parceiro + Teste Leve + Coleta de Dados.\n\nSmart Copy gerada e disponível no painel The Brain:\n${strictCopy}`,
            }
            updateState({ interactions: [...state.interactions, newInteraction] })
            toast({
              title: 'Diagnóstico Salvo',
              description: 'O The Brain registrou a objeção automaticamente no histórico.',
            })
          }, 500)
        }
      } else {
        setAnalysis(defaultAnalysis)
      }
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [interactions])

  if (interactions.length === 0) return null
  if (loading)
    return (
      <Card className="border-indigo-200/50 shadow-sm bg-indigo-50/30 animate-in fade-in duration-500">
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
    <Card className="border-indigo-200/80 shadow-md bg-gradient-to-br from-indigo-50/80 to-white relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none">
        <BrainCircuit className="w-40 h-40 text-indigo-900" />
      </div>
      <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-indigo-100/50 bg-indigo-50/50">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-indigo-100 p-1.5 rounded-lg border border-indigo-200 shadow-sm shrink-0">
            <BrainCircuit className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <CardTitle className="text-indigo-900 text-lg font-bold tracking-tight">
              "The Brain" - Diagnóstico da IA
            </CardTitle>
            <p className="text-xs text-indigo-600/80 font-medium mt-0.5">
              Análise gerada com base nas últimas conversas e e-mails.
            </p>
          </div>
        </div>
        {canEditRules && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isEditing) toast({ title: 'Critérios de FIT e Diagnóstico atualizados!' })
              setIsEditing(!isEditing)
            }}
            className="text-indigo-700 border-indigo-200 bg-white shadow-sm shrink-0"
          >
            {isEditing ? <Save className="w-4 h-4 mr-1.5" /> : <Edit2 className="w-4 h-4 mr-1.5" />}
            {isEditing ? 'Salvar Análise' : 'Ajustar Parâmetros'}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-amber-50/40 p-3.5 rounded-lg border border-amber-200/50 shadow-inner">
              {isEditing ? (
                <Input
                  type="number"
                  value={analysis.fit}
                  onChange={(e) => setAnalysis({ ...analysis, fit: e.target.value })}
                  className="w-24 font-black text-amber-600 h-9 text-lg"
                />
              ) : (
                <div className="text-3xl font-black text-amber-600 tracking-tight shrink-0">
                  {analysis.fit}
                  <span className="text-lg text-amber-500/80">%</span>
                </div>
              )}
              {isEditing ? (
                <Input
                  value={analysis.fitText}
                  onChange={(e) => setAnalysis({ ...analysis, fitText: e.target.value })}
                  className="text-sm h-9 flex-1 bg-white"
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
              <MessageCircleQuestion className="w-3.5 h-3.5 text-rose-500" /> Detecção de Objeções
            </h4>
            <div className="space-y-3">
              {analysis.objections.map((obj, i) => (
                <div
                  key={i}
                  className="bg-white p-3.5 rounded-xl border border-rose-100 flex flex-col gap-3 shadow-sm"
                >
                  <div className="text-sm font-semibold text-rose-950 border-l-[3px] border-rose-400 pl-3 italic bg-rose-50/50 py-2 rounded-r-md">
                    {obj.text}
                  </div>
                  <div className="text-xs font-medium text-emerald-900 bg-emerald-50 px-3 py-2.5 rounded-md flex items-start gap-2.5 border border-emerald-100 shadow-inner">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                    <div>
                      <span className="uppercase text-[10px] font-bold tracking-widest text-emerald-700 block mb-0.5">
                        Sugestão de Contorno da IA
                      </span>
                      <span className="leading-relaxed">{obj.rebuttal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5 mt-3 border-t border-indigo-100/80 space-y-3">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" /> Smart Copy (Mensagem Gerada)
          </h4>
          <div className="bg-white rounded-xl p-5 border border-indigo-200 shadow-sm relative group transition-all hover:border-indigo-300">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 h-8 px-3 shadow-sm"
                onClick={() => {
                  navigator.clipboard.writeText(analysis.copy)
                  toast({
                    title: 'Copy Copiada!',
                    description: 'Pronta para colar no WhatsApp ou Email.',
                  })
                }}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Copiar
              </Button>
            </div>

            <p className="text-[11px] font-bold text-indigo-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Texto sugerido para o cliente
            </p>

            {isEditing ? (
              <Textarea
                value={analysis.copy}
                onChange={(e) => setAnalysis({ ...analysis, copy: e.target.value })}
                className="text-sm font-medium text-slate-700 italic leading-relaxed min-h-[150px] bg-indigo-50/30"
              />
            ) : (
              <p className="text-sm font-medium text-slate-700 italic leading-relaxed pr-24 whitespace-pre-wrap">
                {analysis.copy}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
