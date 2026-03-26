import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Code2 } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import { cn } from '@/lib/utils'
import useCrmStore from '@/stores/useCrmStore'

export function FinanceIntegTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const { state } = useCrmStore()
  const canEdit = ['Financeiro', 'Master'].includes(state.role)

  const ediDict: Record<string, string> = {
    '01': 'Entrega Realizada Normalmente',
    '02': 'Destinatário Ausente',
    '03': 'Recusa do Recebedor',
    '09': 'Avaria na Carga',
  }

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
          <Code2 className="w-5 h-5 text-secondary" /> Integrações e Ocorrências EDI
        </CardTitle>
        <CardDescription>Padrões PROCEDA, APIs Geográficas e Riscos.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Código de Ocorrência EDI
            </Label>
            <Input
              disabled={!canEdit}
              value={calc.data.ediCode}
              onChange={(e) => calc.update({ ediCode: e.target.value })}
              placeholder="Ex: 01"
              className="font-mono border-slate-200"
            />
          </div>
          <div className="bg-slate-900 p-4 rounded-lg shadow-inner text-emerald-400 font-mono text-sm min-h-[80px] flex items-center">
            {ediDict[calc.data.ediCode] ? (
              <span>
                {'> '} {ediDict[calc.data.ediCode]}
              </span>
            ) : (
              <span className="text-slate-500">{'> '} Código não mapeado.</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              CEP Destino (Análise de Risco)
            </Label>
            <Input
              disabled={!canEdit}
              value={calc.data.zipCode}
              onChange={(e) => calc.update({ zipCode: e.target.value })}
              placeholder="00000-000"
              className="font-mono border-slate-200"
            />
          </div>
          <div
            className={cn(
              'p-4 rounded-lg flex items-center text-sm font-bold shadow-sm border',
              calc.riskLevel.includes('Alto')
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200',
            )}
          >
            Nível de Risco: {calc.riskLevel}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
