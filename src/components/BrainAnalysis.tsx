import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BrainCircuit, CheckCircle2, Target, MessageCircle, Copy, HelpCircle } from 'lucide-react'
import { Interaction, Company } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

export function BrainAnalysis({
  interactions,
  company,
}: {
  interactions: Interaction[]
  company?: Company
}) {
  const { toast } = useToast()
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    const segment = company?.segmento || 'Mercado Geral'
    const hasPartnerObjection = interactions.some((i) =>
      i.content.toLowerCase().includes('parceiro'),
    )

    let objection = 'Nenhuma objeção detectada.'
    let strategy =
      'Apresentar apresentação corporativa padrão e buscar agendar uma call de alinhamento.'
    let diagnosticQuestions = ['Quais as principais rotas atuais?', 'Qual o volume médio mensal?']
    let fitScore = 65
    let copies = {
      whatsapp: `Olá! Vimos que atuam no segmento de ${segment}. Temos ajudado empresas similares a reduzir custos logísticos em até 15%. Toparia um bate-papo rápido de 10 minutos para apresentarmos nosso modelo?`,
      email: `Olá,\n\nNotamos o trabalho da ${company?.nomeFantasia || 'sua empresa'} em ${segment}. Nosso foco é otimizar rotas fracionadas e lotação garantindo SLA de 98%. Podemos agendar uma call breve na próxima semana?`,
      call: `(Roteiro)\n1. Apresentação rápida.\n2. Perguntar sobre o modelo de distribuição atual.\n3. Apresentar diferenciais logísticos para o setor de ${segment}.`,
    }

    if (hasPartnerObjection) {
      objection = 'Já tenho parceiro logístico consolidado.'
      strategy =
        'Recomendar "Teste Leve" com 1 carga fracionada na rota de São Paulo–Campinas. O risco de troca é mínimo e valida nosso SLA na prática.'
      diagnosticQuestions = [
        'Qual a média de entregas semanais?',
        'Qual o custo médio por carga nas rotas principais?',
      ]
      fitScore = 82
      copies = {
        whatsapp: `Olá! Entendo perfeitamente que a ${company?.nomeFantasia || 'sua empresa'} já possui parceria consolidada e time de confiança. Topariam um "Teste Leve" sem compromisso com apenas 1 carga (janela flexível) para validarem nosso SLA na prática?`,
        email: `Vimos que atuam em ${segment} e sabemos que já possuem um parceiro logístico. Nosso índice de sucesso com materiais do seu setor é altíssimo. Que tal um "Teste Leve" com apenas 1 demanda em uma rota específica? O risco para vocês é zero e valida nosso serviço.`,
        call: `(Roteiro)\n1. Reconheça e valorize a parceria logística atual deles.\n2. Faça as perguntas diagnósticas sugeridas pelo Cérebro.\n3. Ofereça o "Teste Leve" com apenas 1 volume de teste (sem compromisso contratual futuro).`,
      }
    }

    setAnalysis({
      objectives: ['1º contato estabelecido', 'Mapeada dor logística e status atual'],
      nextSteps: ['Agendar visita presencial', 'Apresentar tabela de Teste Leve'],
      objection,
      strategy,
      diagnosticQuestions,
      fitScore,
      copies,
    })
  }, [interactions, company])

  if (!analysis) return null

  return (
    <Card className="border-primary/20 bg-white shadow-md relative overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
          <BrainCircuit className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-slate-900 text-lg font-bold">
            The Brain (Diagnóstico IA)
          </CardTitle>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Visão 360º de Conta baseada no histórico de interações.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            FIT Score
          </div>
          <div className="text-2xl font-black text-secondary">
            {analysis.fitScore}
            <span className="text-sm text-slate-400 font-bold">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Objetivos Atingidos
            </h4>
            <ul className="space-y-2">
              {analysis.objectives.map((obj: string, i: number) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2 bg-emerald-50/50 p-2 rounded border border-emerald-100/50"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <Target className="w-4 h-4 text-secondary" /> Próximos Passos Sugeridos
            </h4>
            <ul className="space-y-2">
              {analysis.nextSteps.map((step: string, i: number) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2 bg-blue-50/50 p-2 rounded border border-blue-100/50"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border-l-[4px] border-red-500 p-4 rounded-r-lg">
          <span className="font-bold text-red-800 text-xs uppercase tracking-wider block mb-1">
            Objeção Mapeada: {analysis.objection}
          </span>
          <p className="text-red-900 font-semibold text-sm leading-relaxed mt-2">
            <strong>Estratégia:</strong> {analysis.strategy}
          </p>
          <div className="mt-3 pt-3 border-t border-red-200">
            <span className="font-bold text-red-800 text-xs uppercase tracking-wider flex items-center gap-1 mb-2">
              <HelpCircle className="w-3.5 h-3.5" /> Perguntas Diagnósticas
            </span>
            <ul className="list-disc list-inside pl-5 text-sm text-red-900 space-y-1">
              {analysis.diagnosticQuestions.map((q: string, idx: number) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-primary uppercase mb-3 flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Gerador de Copy Personalizado
          </h4>
          <Tabs defaultValue="whatsapp" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100">
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="email">E-mail</TabsTrigger>
              <TabsTrigger value="call">Roteiro Call</TabsTrigger>
            </TabsList>
            {['whatsapp', 'email', 'call'].map((type) => (
              <TabsContent key={type} value={type} className="relative mt-3">
                <Textarea
                  readOnly
                  value={analysis.copies[type as keyof typeof analysis.copies]}
                  className="text-sm font-medium text-slate-700 bg-slate-50 border-slate-200 resize-none min-h-[100px] shadow-inner pr-12"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 text-primary hover:bg-primary/10"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      analysis.copies[type as keyof typeof analysis.copies],
                    )
                    toast({ title: 'Copiado para a área de transferência!' })
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
