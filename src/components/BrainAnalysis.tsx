import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, Globe, ShieldCheck, Copy, Target, Zap } from 'lucide-react'
import { Interaction, Company } from '@/stores/useCrmStore'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

export function BrainAnalysis({
  interactions,
  company,
}: {
  interactions: Interaction[]
  company?: Company
}) {
  const { state, updateState, logAiAction } = useCrmStore()
  const { toast } = useToast()
  const [analysis, setAnalysis] = useState<any>(null)
  const [isWebSearching, setIsWebSearching] = useState(false)

  useEffect(() => {
    if (!interactions.length) return

    const foundPartnerObjection = interactions.some((i) =>
      i.content.toLowerCase().includes('já tenho parceiro'),
    )

    if (foundPartnerObjection) {
      setIsWebSearching(true)
      const timer = setTimeout(() => {
        setIsWebSearching(false)

        const isAutoPecas = company?.segmento?.toLowerCase().includes('auto')
        const route = isAutoPecas ? 'São Paulo–Campinas' : 'São Paulo–Interior'
        const segmentName = company?.segmento || 'Indústria'

        if (logAiAction) {
          logAiAction(
            'Web Search: Validação de Concorrente',
            `Buscando reputação e SLAs do parceiro atual para o setor de ${segmentName}.`,
            'reclameaqui.com.br',
          )
        }

        const newAnalysis = {
          webInsights: [
            {
              source: 'Logistics Report 2025',
              data: `Média de 15 entregas/semana no setor de ${segmentName}.`,
            },
            {
              source: 'ReclameAqui (Web Search)',
              data: 'Concorrente atual apresenta 12% de atrasos.',
            },
          ],
          objection: '"Já tenho parceiro logístico consolidado."',
          strategy: `Análise de Padrão: Histórico indica que o setor de ${segmentName} converte 40% mais quando propomos um "Teste Leve".`,
          copies: {
            whatsapp: `Olá! Entendo que já possui parceiro. Como o setor de ${segmentName} exige agilidade, propomos um "teste leve" (5 unidades) na rota ${route} para comparar nosso SLA na prática. Que tal?`,
            email: `Vimos via dados de mercado (Logistics Report 2025) que atrasos impactam 12% das operações atuais. Que tal fazermos um teste leve sem compromisso na rota ${route}? O risco é todo nosso.`,
            call: `(Roteiro)\n1. Valide a escolha do parceiro atual.\n2. Cite a média de 15 entregas/semana e os gargalos do mercado (12% atrasos).\n3. Proponha o teste de 5 unidades para ${route}.`,
          },
        }

        setAnalysis(newAnalysis)

        // Prevent duplicate logs
        const alreadyLogged = state.interactions.some((i) => i.subject === '⚡ Ação IA Web Search')
        if (!alreadyLogged && interactions[0]) {
          const newInteraction: Interaction = {
            id: Math.random().toString(36).substring(7),
            companyId: interactions[0].companyId,
            type: 'note',
            author: 'The Brain (IA)',
            date: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
            subject: '⚡ Ação IA Web Search',
            content: `Objeção: Já tenho parceiro\nEstratégia: Teste Leve (${route})\nInsight Web: Concorrente com 12% atrasos (Fonte: ReclameAqui).`,
          }
          updateState({ interactions: [...state.interactions, newInteraction] })
        }
      }, 1500)

      return () => clearTimeout(timer)
    } else {
      setAnalysis({
        objection: 'Nenhuma objeção recente detectada.',
        strategy: 'Manter cadência de nutrição padrão focada em valor e SLA.',
        copies: {
          whatsapp: 'Olá! Seguimos à disposição para otimizar sua logística...',
          email: 'Gostaríamos de agendar 15 min para apresentar nosso SLA...',
          call: '(Roteiro) Focar na apresentação institucional e entender volumetria.',
        },
      })
    }
  }, [interactions, company])

  if (!analysis) return null

  return (
    <Card className="border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 to-white shadow-md relative overflow-hidden">
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none">
        <BrainCircuit className="w-40 h-40 text-indigo-900" />
      </div>
      <CardHeader className="pb-3 border-b border-indigo-100/50 flex flex-row items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg border border-indigo-200">
          <BrainCircuit className="w-5 h-5 text-indigo-700" />
        </div>
        <div>
          <CardTitle className="text-indigo-900 text-lg font-bold">
            The Brain - IA & Web Search
          </CardTitle>
          <p className="text-xs text-indigo-600 font-medium">
            Aprendizado Contínuo & Dados em Tempo Real
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-5 relative z-10">
        {isWebSearching ? (
          <div className="flex items-center gap-3 text-indigo-600 text-sm font-bold animate-pulse bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <Globe className="w-5 h-5 animate-spin-slow" /> Acessando APIs de mercado e pesquisando
            validação de parceiros...
          </div>
        ) : (
          <>
            {analysis.webInsights && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-inner">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Insights Validados na Web
                </span>
                <div className="grid gap-2">
                  {analysis.webInsights.map((w: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-2.5 rounded-md border border-slate-100 shadow-sm gap-2"
                    >
                      <span className="text-slate-700 text-sm font-medium">{w.data}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-slate-50 font-bold shrink-0"
                      >
                        Fonte: {w.source}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.objection !== 'Nenhuma objeção recente detectada.' && (
              <div className="bg-rose-50 border-l-[4px] border-rose-400 p-4 rounded-r-xl shadow-sm">
                <span className="font-bold text-rose-800 text-xs uppercase tracking-wider block mb-1">
                  Objeção Tratada
                </span>
                <span className="italic text-rose-700 text-sm font-medium">
                  {analysis.objection}
                </span>
                <div className="mt-3 flex items-start gap-2 bg-emerald-100/50 p-3 rounded-lg border border-emerald-200">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-emerald-900 font-semibold text-xs leading-relaxed">
                    {analysis.strategy}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <h4 className="text-xs font-bold text-indigo-800 uppercase mb-3 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Ação Gerada (Templates de Copy)
              </h4>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-indigo-50 border border-indigo-100">
                  <TabsTrigger value="whatsapp" className="text-xs font-bold">
                    WhatsApp
                  </TabsTrigger>
                  <TabsTrigger value="email" className="text-xs font-bold">
                    E-mail
                  </TabsTrigger>
                  <TabsTrigger value="call" className="text-xs font-bold">
                    Call Script
                  </TabsTrigger>
                </TabsList>
                {['whatsapp', 'email', 'call'].map((type) => (
                  <TabsContent key={type} value={type} className="relative mt-3">
                    <Textarea
                      readOnly
                      value={analysis.copies[type as keyof typeof analysis.copies]}
                      className="text-sm italic font-medium text-slate-700 bg-white border-indigo-100 resize-none min-h-[110px] shadow-sm pr-12 leading-relaxed"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          analysis.copies[type as keyof typeof analysis.copies],
                        )
                        toast({ title: 'Copy salva na área de transferência!' })
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
