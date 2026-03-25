import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Code2, Clock } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import { cn } from '@/lib/utils'

export function FinanceIntegTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const ediDict: Record<string, string> = {
    '01': 'Entrega Realizada Normalmente',
    '02': 'Destinatário Ausente',
    '03': 'Recusa do Recebedor',
    '09': 'Avaria na Carga (Pendente Acareação)',
  }

  const ncmDict: Record<string, string> = {
    '3808': 'Produtos Químicos (Requer Licença Especial MOPP)',
    '8708': 'Autopeças (Carga Seca Padrão)',
    '2106': 'Alimentos (Controle de Temperatura Restrito)',
  }

  return (
    <Card className="border-emerald-100 shadow-sm bg-white/90">
      <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
          <Code2 className="w-5 h-5 text-emerald-600" /> Integrações, EDI e APIs
        </CardTitle>
        <CardDescription>
          Padrões PROCEDA (NOTFIS/CONEMB), APIs Geográficas e Sinistralidade.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Código de Ocorrência EDI (Leitura CONEMB)
            </Label>
            <Input
              value={calc.data.ediCode}
              onChange={(e) => calc.update({ ediCode: e.target.value })}
              placeholder="Ex: 01"
              className="font-mono bg-slate-50 border-emerald-200"
            />
          </div>
          <div className="bg-slate-900 p-4 rounded-lg shadow-inner text-emerald-400 font-mono text-sm min-h-[80px] flex items-center">
            {ediDict[calc.data.ediCode] ? (
              <span>
                {'> '} {ediDict[calc.data.ediCode]}
              </span>
            ) : (
              <span className="text-slate-500">{'> '} Código EDI não mapeado na base PROCEDA.</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Consulta NCM (Carga Específica)
            </Label>
            <Input
              value={calc.data.ncm}
              onChange={(e) => calc.update({ ncm: e.target.value })}
              placeholder="Ex: 3808"
              className="font-mono bg-slate-50 border-emerald-200"
            />
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg min-h-[80px] flex items-center">
            <span className="font-semibold text-emerald-800 text-sm">
              {ncmDict[calc.data.ncm] || 'Produto padrão, sem restrições específicas mapeadas.'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              CEP Destino (Análise de Sinistralidade/Roubo)
            </Label>
            <Input
              value={calc.data.zipCode}
              onChange={(e) => calc.update({ zipCode: e.target.value })}
              placeholder="00000-000"
              className="font-mono bg-slate-50 border-emerald-200"
            />
          </div>
          <div
            className={cn(
              'p-4 rounded-lg flex items-center text-sm font-semibold shadow-inner border',
              calc.riskLevel.includes('Alto')
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200',
            )}
          >
            Nível de Risco Identificado: {calc.riskLevel}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Simulação de API (Maps / Transit Time)
            </Label>
            <div className="h-10 px-3 bg-slate-100 rounded-md border border-slate-200 flex items-center text-sm font-mono text-slate-500">
              GET /api/routing?dist={calc.data.distance}&rod={calc.data.rodizio}
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg min-h-[80px] flex items-center gap-3 text-indigo-900">
            <Clock className="w-6 h-6 text-indigo-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                Transit Time Estimado
              </p>
              <p className="text-xl font-black">{calc.transitTime} Horas</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
