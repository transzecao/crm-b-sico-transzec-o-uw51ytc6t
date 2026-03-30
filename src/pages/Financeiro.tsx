import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { Calculator, Edit2, Check, X, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import { FinancePricingTab } from '@/components/finance/FinancePricingTab'
import { FinanceGeoTab } from '@/components/finance/FinanceGeoTab'
import { FinanceFiscalTab } from '@/components/finance/FinanceFiscalTab'
import { FinanceIntegTab } from '@/components/finance/FinanceIntegTab'
import { FinanceKpiTab } from '@/components/finance/FinanceKpiTab'
import { FinanceDocsTab } from '@/components/finance/FinanceDocsTab'
import { FinanceEngineTab } from '@/components/finance/FinanceEngineTab'

export default function Financeiro() {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const calc = useFinanceCalculator()

  const [tab, setTab] = useState('pricing')
  const [isEditingFinalValue, setIsEditingFinalValue] = useState(false)
  const [overrideValue, setOverrideValue] = useState('')

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  const canEditParams = ['Acesso Master', 'Supervisor Financeiro'].includes(state.role)

  useEffect(() => {
    if (calc.data.zmrc) {
      toast({
        title: 'ZMRC Ativada',
        description: 'Restrição de circulação detectada. Agravo incluído.',
        variant: 'destructive',
      })
    }
  }, [calc.data.zmrc, toast])

  return (
    <div className="space-y-6 bg-slate-50 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl animate-fade-in-up">
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
              Módulo Logístico Financeiro (Fórmulas, Clusters e Engine).
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
                EDI
              </TabsTrigger>
              <TabsTrigger
                value="kpi"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                KPIs
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Documentos
              </TabsTrigger>
              {canEditParams && (
                <TabsTrigger
                  value="engine"
                  className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-600"
                >
                  Configurar Engine
                </TabsTrigger>
              )}
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
            <TabsContent value="docs" className="mt-0">
              <FinanceDocsTab />
            </TabsContent>
            {canEditParams && (
              <TabsContent value="engine" className="mt-0">
                <FinanceEngineTab />
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
            <div className="bg-primary text-white p-5 flex items-center gap-3 border-b border-primary/50">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">
                  Resumo Operacional
                </h3>
              </div>
            </div>

            <CardContent className="p-6 space-y-5">
              <div className="space-y-4 text-sm text-slate-300">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-700">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Custo Base (R$)
                    </label>
                    <Input
                      type="number"
                      value={calc.data.baseCost}
                      onChange={(e) => calc.update({ baseCost: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-600 text-white font-semibold h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Valor NF (R$)
                    </label>
                    <Input
                      type="number"
                      value={calc.data.nfValue}
                      onChange={(e) => calc.update({ nfValue: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-600 text-white font-semibold h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Breakdown de Variáveis Ativas
                  </div>
                  {calc.activeVars.length === 0 && calc.activeRules.length === 0 && (
                    <div className="text-slate-500 italic text-xs">
                      Nenhuma variável/regra ativa no motor.
                    </div>
                  )}
                  {calc.activeVars.map((v) => (
                    <div key={v.id} className="flex justify-between items-center text-xs">
                      <span className="truncate pr-2">
                        {v.name} {v.type === 'percentage' && `(${v.value}% s/ Base)`}
                      </span>
                      <span className="text-slate-100 font-medium shrink-0">
                        {v.type === 'fixed'
                          ? fmt(v.value)
                          : fmt((calc.data.baseCost * v.value) / 100)}
                      </span>
                    </div>
                  ))}
                  {calc.activeRules.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between items-center text-xs text-amber-200/90"
                    >
                      <span className="truncate pr-2">
                        {r.name} {r.type === 'percentage' && `(${r.value}% s/ NF)`}
                      </span>
                      <span className="font-medium shrink-0">
                        {r.type === 'fixed'
                          ? fmt(r.value)
                          : fmt((calc.data.nfValue * r.value) / 100)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Soma Fixos</span>
                    <span>{fmt(calc.fixedSum)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Soma % (s/ Base)</span>
                    <span>{fmt(calc.percentageSum)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Soma Regras NF</span>
                    <span>{fmt(calc.rulesSum)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center h-8 pt-2">
                  <span className="font-semibold text-white">Total Calculado</span>
                  <span className="font-bold text-white">{fmt(calc.calculatedFinalValue)}</span>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mt-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Valor Final do Frete
                  </span>
                  {calc.data.manualOverrideFinalValue !== null && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Alterado Manualmente
                    </span>
                  )}
                </div>

                {isEditingFinalValue ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      className="h-10 text-right text-slate-900 rounded font-bold text-lg flex-1"
                      value={overrideValue}
                      onChange={(e) => setOverrideValue(e.target.value)}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 shrink-0"
                      onClick={() => {
                        calc.update({ manualOverrideFinalValue: Number(overrideValue) })
                        setIsEditingFinalValue(false)
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300 shrink-0"
                      onClick={() => {
                        if (calc.data.manualOverrideFinalValue === null) {
                          setOverrideValue(String(calc.calculatedFinalValue))
                        }
                        setIsEditingFinalValue(false)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-3xl font-black text-primary-foreground tracking-tight">
                      {fmt(calc.finalValue)}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
                      onClick={() => {
                        setOverrideValue(String(calc.finalValue))
                        setIsEditingFinalValue(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {calc.data.manualOverrideFinalValue !== null && !isEditingFinalValue && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-slate-400 hover:text-white text-xs"
                      onClick={() => calc.update({ manualOverrideFinalValue: null })}
                    >
                      Restaurar valor calculado original
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
