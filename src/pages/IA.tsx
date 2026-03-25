import { BrainCircuit, Activity, Database, ShieldCheck, History, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'
import { Badge } from '@/components/ui/badge'

export default function IA() {
  const { state } = useCrmStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary border border-primary/20">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              The Brain (Inteligência Central)
            </h1>
            <p className="text-slate-500 font-medium mt-1">Motor Global de IA e Insights da Web.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
              <Activity className="w-5 h-5 text-secondary" /> Padrões Detectados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="text-sm text-slate-600 border-b border-slate-100 pb-3">
              <span className="font-black text-slate-800 block mb-1">Setor: Autopeças</span>
              Taxa de sucesso com "Teste Leve" subiu 40%. Estratégia atualizada.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
              <Database className="w-5 h-5 text-secondary" /> Fontes de Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-sm font-bold text-slate-700">Tabela ANTT (Frete)</span>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Sincronizado</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
              <ShieldCheck className="w-5 h-5 text-secondary" /> Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Badge variant="outline" className="bg-slate-50">
              Whitelists validados
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
