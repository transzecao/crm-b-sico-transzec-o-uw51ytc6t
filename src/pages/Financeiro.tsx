import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { Calculator, AlertTriangle } from 'lucide-react'

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
        title: 'ZMRC Ativada',
        description: 'Restrição de circulação detectada. Agravo incluído.',
        variant: 'destructive',
      })
    }
  }, [calc.data.zmrc])

  return (
    <div className="space-y-6 bg-slate-50 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary border border-primary/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Calculadora de Fretes
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Módulo Logístico Financeiro (Fórmulas e Clusters).
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4 w-full h-auto flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              <TabsTrigger
                value="pricing"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Frete & Regras
              </TabsTrigger>
              <TabsTrigger
                value="geo"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Clusters & Rotas
              </TabsTrigger>
              <TabsTrigger
                value="fiscal"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Fiscal e ANTT
              </TabsTrigger>
              <TabsTrigger
                value="integ"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Ocorrências EDI
              </TabsTrigger>
              <TabsTrigger
                value="kpi"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                KPIs Operacionais
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
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
            <div className="bg-primary text-white p-5 flex items-center gap-3 border-b border-primary/50">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">Resumo do Cálculo</h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                  <span>Peso Tarifável</span>
                  <span className="font-bold text-white">{calc.taxableWeight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Base da Fórmula</span>
                  <span className="font-semibold">{fmt(calc.finalValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pedágios Rota</span>
                  <span className="font-semibold">{fmt(calc.tollTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>TAS</span>
                  <span className="font-semibold">{fmt(calc.tasFee)}</span>
                </div>
                {calc.zmrcFee > 0 && (
                  <div className="flex justify-between items-center text-rose-400">
                    <span>Agravo ZMRC</span>
                    <span className="font-semibold">{fmt(calc.zmrcFee)}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Valor Final do Frete
                </span>
                <span className="text-3xl font-black text-primary-foreground tracking-tight">
                  {fmt(calc.totalFracionado)}
                </span>
              </div>

              {calc.isLotacaoBetter && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 inline mr-1 mb-0.5 text-amber-400" />
                  Custo via lotação dedicada seria mais vantajoso ({fmt(calc.lotacaoCost)}).
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
