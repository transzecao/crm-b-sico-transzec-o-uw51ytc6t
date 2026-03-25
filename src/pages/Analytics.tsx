import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, AlertCircle, PieChart, Activity } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6 bg-teal-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-teal-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-teal-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-teal-100/60 p-3 rounded-xl border border-teal-200/50 text-teal-600 shadow-sm">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-teal-950">
              Inteligência de Dados
            </h1>
            <p className="text-teal-700/80 font-medium mt-1">
              Relatórios gerenciais e métricas de conversão em tempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 min-h-[350px] flex items-center justify-center bg-teal-50/40 border-teal-100 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-teal-900 bg-white/60 px-3 py-1.5 rounded-md border border-teal-100 backdrop-blur-md shadow-sm">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-sm tracking-wide">Performance por Vendedor</span>
          </div>
          <div className="text-center text-teal-800/60 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-teal-100 flex items-center justify-center mb-4">
              <BarChart3 className="w-10 h-10 text-teal-300" />
            </div>
            <p className="text-base font-medium">Gráfico Analítico em construção...</p>
            <p className="text-xs mt-2 text-teal-600/60 max-w-xs">
              Os dados de conversão e volume de propostas serão sincronizados automaticamente.
            </p>
          </div>
        </Card>

        <Card className="min-h-[350px] flex items-center justify-center bg-teal-50/40 border-teal-100 shadow-sm relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-5 left-5 flex items-center gap-2 text-teal-900 bg-white/60 px-3 py-1.5 rounded-md border border-teal-100 backdrop-blur-md shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm tracking-wide">Motivos de Perda</span>
          </div>
          <div className="text-center text-teal-800/60 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-teal-100 flex items-center justify-center mb-4">
              <Activity className="w-10 h-10 text-teal-300" />
            </div>
            <p className="text-base font-medium">Gráfico de Histórico...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
