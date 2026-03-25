import { BrainCircuit, Cpu, Zap, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function IA() {
  return (
    <div className="space-y-6 bg-fuchsia-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-fuchsia-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-fuchsia-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-fuchsia-100/60 p-3 rounded-xl border border-fuchsia-200/50 text-fuchsia-600 shadow-sm">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-fuchsia-950">
              The Brain (IA Central)
            </h1>
            <p className="text-fuchsia-700/80 font-medium mt-1">
              Visão global da inteligência artificial aplicada ao CRM.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/80 shadow-sm border-fuchsia-100 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-fuchsia-900">
              <Cpu className="w-5 h-5 text-fuchsia-500" /> Modelos Ativos
            </CardTitle>
            <CardDescription>Resumo de processamento diário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center border-b border-fuchsia-50 pb-2">
              <span className="text-sm font-medium text-slate-600">Leads Analisados (Hoje)</span>
              <span className="font-bold text-fuchsia-700">142</span>
            </div>
            <div className="flex justify-between items-center border-b border-fuchsia-50 pb-2">
              <span className="text-sm font-medium text-slate-600">Recomendações Geradas</span>
              <span className="font-bold text-fuchsia-700">315</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Precisão Média de FIT</span>
              <span className="font-bold text-emerald-600">94.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-md border-none overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Zap className="w-48 h-48" />
          </div>
          <CardHeader>
            <CardTitle className="text-white/90">Eficácia das Copys Sugeridas</CardTitle>
            <CardDescription className="text-fuchsia-100">
              Taxa de resposta de leads utilizando mensagens geradas pela IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-4 flex items-end gap-6">
            <div className="bg-white/20 p-6 rounded-xl backdrop-blur-md border border-white/10 flex-1">
              <p className="text-sm uppercase tracking-wider font-semibold text-fuchsia-100 mb-1">
                Taxa de Abertura
              </p>
              <p className="text-4xl font-black">68%</p>
            </div>
            <div className="bg-white/20 p-6 rounded-xl backdrop-blur-md border border-white/10 flex-1">
              <p className="text-sm uppercase tracking-wider font-semibold text-fuchsia-100 mb-1">
                Conversão para Call
              </p>
              <p className="text-4xl font-black">24%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/70 p-8 rounded-xl border border-fuchsia-100 text-center text-fuchsia-800/60 font-medium">
        Mais recursos avançados de IA estarão disponíveis em breve. O módulo "The Brain" atua
        ativamente dentro da página 360º de cada Empresa.
      </div>
    </div>
  )
}
