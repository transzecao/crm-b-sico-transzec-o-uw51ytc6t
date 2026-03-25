import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { Calculator, History, AlertTriangle } from 'lucide-react'

import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import { FinancePricingTab } from '@/components/finance/FinancePricingTab'
import { FinanceGeoTab } from '@/components/finance/FinanceGeoTab'
import { FinanceFiscalTab } from '@/components/finance/FinanceFiscalTab'
import { FinanceIntegTab } from '@/components/finance/FinanceIntegTab'
import { FinanceKpiTab } from '@/components/finance/FinanceKpiTab'

export default function Financeiro() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()
  const calc = useFinanceCalculator()

  const [tab, setTab] = useState('pricing')

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  useEffect(() => {
    if (calc.data.zmrc) {
      toast({
        title: 'Alerta Automático (Geográfico)',
        description: 'Área de Restrição ZMRC ativada. Operação exigirá veículo VUC.',
        variant: 'destructive',
      })
      logAction('Ativou alerta de restrição geográfica (ZMRC)')
    }
  }, [calc.data.zmrc])

  useEffect(() => {
    toast({
      title: 'Integração ARTESP / Rota',
      description: `Sincronização executada para ${calc.data.route.toUpperCase()}.`,
    })
    logAction(`Simulou atualização de rota e pedágio: ${calc.data.route}`)
  }, [calc.data.route])

  const logAction = (action: string) => {
    updateState({
      financeAuditLogs: [
        { date: new Date().toLocaleString('pt-BR'), user: state.currentUser.name, action },
        ...(state.financeAuditLogs || []),
      ].slice(0, 50),
    })
  }

  return (
    <div className="space-y-6 bg-emerald-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-emerald-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-emerald-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100/80 p-3 rounded-xl border border-emerald-200/50 text-emerald-700 shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
              Agente Financeiro IA
            </h1>
            <p className="text-emerald-700/80 font-medium mt-1">
              Inteligência de Pricing Logístico, Compliance e Integrações (Foco São Paulo).
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4 w-full h-auto flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-emerald-100">
              <TabsTrigger
                value="pricing"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Motor Pricing
              </TabsTrigger>
              <TabsTrigger
                value="geo"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Geografia e Rotas
              </TabsTrigger>
              <TabsTrigger
                value="fiscal"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Fiscal e Legal
              </TabsTrigger>
              <TabsTrigger
                value="integ"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Integração e EDI
              </TabsTrigger>
              <TabsTrigger
                value="kpi"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                KPIs Logísticos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="mt-0">
              <FinancePricingTab calc={calc} />
            </TabsContent>
            <TabsContent value="geo" className="mt-0">
              <FinanceGeoTab calc={calc} />
            </TabsContent>
            <TabsContent value="fiscal" className="mt-0">
              <FinanceFiscalTab calc={calc} />
            </TabsContent>
            <TabsContent value="integ" className="mt-0">
              <FinanceIntegTab calc={calc} />
            </TabsContent>
            <TabsContent value="kpi" className="mt-0">
              <FinanceKpiTab calc={calc} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden ring-1 ring-white/10">
            <div className="bg-emerald-600/20 text-emerald-50 p-5 flex items-center gap-3 border-b border-emerald-500/30">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">
                  Motor de Decisão (IA)
                </h3>
                <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">
                  Modalidade Sugerida:
                </p>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <span className="font-bold text-slate-300">Sugestão Ótima</span>
                <span className="font-black text-xl text-emerald-400">
                  {calc.isLotacaoBetter ? 'Lotação (Dedicado)' : 'Carga Fracionada'}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                  <span>Peso Tarifável (Cubado vs Físico)</span>
                  <span className="font-bold text-white">{calc.taxableWeight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frete Peso Base</span>
                  <span className="font-semibold">{fmt(calc.baseWeightCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ad Valorem (0.5%)</span>
                  <span className="font-semibold">{fmt(calc.adValorem)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>GRIS + Risco CEP</span>
                  <span className="font-semibold">{fmt(calc.gris)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de Despacho (CT-e)</span>
                  <span className="font-semibold">{fmt(calc.dispatchFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>TDA / TDE</span>
                  <span className="font-semibold">{fmt(calc.tdaFee)}</span>
                </div>
                <div className="flex justify-between items-center text-rose-300">
                  <span>Pedágios + Agravos ZMRC</span>
                  <span className="font-semibold">{fmt(calc.tollTotal + calc.zmrcFee)}</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent my-4" />

              <div className="bg-emerald-950/50 p-4 border border-emerald-800/50 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-1">
                  Custo Total Fracionado Estimado
                </span>
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  {fmt(calc.totalFracionado)}
                </span>
              </div>

              {calc.isLotacaoBetter && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs font-medium leading-relaxed">
                  <AlertTriangle className="w-4 h-4 inline mr-1 mb-0.5 text-amber-400" />O custo
                  fracionado simulado excede o custo de lotação padrão ({fmt(calc.lotacaoCost)}). O
                  modelo logístico recomenda a contratação de veículo dedicado (Carga Fechada) para
                  maximização de margem.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
                <History className="w-4 h-4 text-slate-500" /> Log de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[200px] overflow-y-auto p-5 space-y-4">
                {state.financeAuditLogs?.map((log, i) => (
                  <div
                    key={i}
                    className="text-xs border-l-[3px] border-emerald-400 pl-3 relative group hover:bg-slate-50 p-1.5 rounded-r-md transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">
                      {log.date}
                    </span>
                    <span className="font-bold text-emerald-900">{log.user}</span>{' '}
                    <span className="text-slate-600 font-medium leading-tight">{log.action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
