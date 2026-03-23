import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BrainCircuit, CheckCircle, Target, AlertTriangle, MessageSquareQuote } from 'lucide-react'

export function BrainAnalysis() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Card className="border-primary/50 shadow-md">
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
    <Card className="border-primary/50 shadow-md bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <BrainCircuit className="w-32 h-32 text-primary" />
      </div>
      <CardHeader className="pb-3 flex flex-row items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-primary" />
        <CardTitle className="text-primary text-lg">Análise d'O Cérebro (IA)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" /> Objetivos Atingidos
            </h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5">
              <li>Contato com decisor estabelecido.</li>
              <li>Mapeamento de frota concluído.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Objeção Principal
            </h4>
            <p className="text-sm text-muted-foreground bg-white dark:bg-black p-2 rounded-md border">
              "Já tenho parceiro logístico fechado para este ano."
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-primary/20 space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-1">
            <Target className="w-4 h-4 text-primary" /> Estratégia Sugerida: "Leve Teste"
          </h4>
          <div className="bg-background rounded-lg p-3 border shadow-sm">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <MessageSquareQuote className="w-3 h-3" /> Copy gerado para WhatsApp:
            </p>
            <p className="text-sm font-medium italic">
              "Olá [Nome], entendo perfeitamente que já possuam parceiro. O que acha de fazermos um
              'teste leve' em uma rota secundária, sem compromisso, apenas para você avaliar nossa
              SLA na prática de forma comparativa?"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
