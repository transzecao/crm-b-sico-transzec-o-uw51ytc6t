import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { Calculator, Edit2, Check, X, InfoIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import { FinancePricingTab } from '@/components/finance/FinancePricingTab'
import { FinanceGeoTab } from '@/components/finance/FinanceGeoTab'
import { FinanceFiscalTab } from '@/components/finance/FinanceFiscalTab'
import { FinanceIntegTab } from '@/components/finance/FinanceIntegTab'
import { FinanceKpiTab } from '@/components/finance/FinanceKpiTab'
import { FinanceDocsTab } from '@/components/finance/FinanceDocsTab'
import { FinanceEngineTab } from '@/components/finance/FinanceEngineTab'
import { FinanceQuotesTab } from '@/components/finance/FinanceQuotesTab'
import { useEngineStore } from '@/stores/useEngineStore'
import { FileText, Download } from 'lucide-react'
import { formatCnpj } from '@/utils/formatters'
import pb from '@/lib/pocketbase/client'

export default function Financeiro() {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const calc = useFinanceCalculator()
  const { maxDiscountMargin, addInternalQuote } = useEngineStore()

  const [tab, setTab] = useState('engine')
  const [isEditingFinalValue, setIsEditingFinalValue] = useState(false)
  const [overrideValue, setOverrideValue] = useState('')
  const [overrideReason, setOverrideReason] = useState('')

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
              Gerenciamento de Fretes e Motor
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Configure as pilhas de cálculo financeiro e simule em tempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4 w-full h-auto flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              {canEditParams && (
                <TabsTrigger
                  value="engine"
                  className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white text-primary"
                >
                  Regras do Motor (DNA)
                </TabsTrigger>
              )}
              <TabsTrigger
                value="pricing"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Frete Básico
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
                value="quotes"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Cotações Geradas
              </TabsTrigger>
            </TabsList>

            {canEditParams && (
              <TabsContent value="engine" className="mt-0">
                <FinanceEngineTab />
              </TabsContent>
            )}
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
            <TabsContent value="quotes" className="mt-0">
              <FinanceQuotesTab />
            </TabsContent>
            <TabsContent value="docs" className="mt-0">
              <FinanceDocsTab />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
            <div className="bg-primary text-white p-5 flex items-center justify-between border-b border-primary/50">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">
                  Simulador de Frete
                </h3>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-bold uppercase tracking-wider animate-pulse">
                Ao Vivo
              </span>
            </div>

            <CardContent className="p-6 space-y-5">
              <div className="space-y-4 text-sm text-slate-300">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-700">
                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      CNPJ do Cliente (Para Cotação)
                    </label>
                    <Input
                      placeholder="00.000.000/0000-00"
                      value={calc.data.customerCnpj}
                      onChange={(e) => calc.update({ customerCnpj: formatCnpj(e.target.value) })}
                      className="bg-slate-800 border-slate-600 text-white font-mono h-10"
                      maxLength={18}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Valor NF Teste (R$)
                    </label>
                    <Input
                      type="number"
                      value={calc.data.nfValue}
                      onChange={(e) => calc.update({ nfValue: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-600 text-white font-semibold h-10"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Peso Teste (Kg)
                    </label>
                    <Input
                      type="number"
                      value={calc.data.weight}
                      onChange={(e) => calc.update({ weight: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-600 text-white font-semibold h-10"
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Custo Base (R$)
                      </label>
                      <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Desconto (Máx {maxDiscountMargin}%)
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        value={calc.data.baseCost}
                        onChange={(e) => calc.update({ baseCost: Number(e.target.value) })}
                        className="bg-slate-800 border-slate-600 text-white font-semibold h-10 flex-1"
                      />
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={calc.data.discountPercentage || ''}
                          onChange={(e) => {
                            let val = Number(e.target.value)
                            if (val > maxDiscountMargin) val = maxDiscountMargin
                            if (val < 0) val = 0
                            calc.update({ discountPercentage: val })
                          }}
                          className="bg-amber-950/30 border-amber-600/50 text-amber-400 font-bold h-10 pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1">
                    <InfoIcon className="w-3.5 h-3.5" /> Empilhamento de Regras
                  </div>

                  {calc.appliedRules.length === 0 && calc.ignoredRules.length === 0 && (
                    <div className="text-slate-500 italic text-xs px-1">
                      Nenhuma regra configurada no motor.
                    </div>
                  )}

                  {calc.appliedRules.map((r) => (
                    <Tooltip key={r.id}>
                      <TooltipTrigger asChild>
                        <div className="flex justify-between items-center text-xs text-green-400 cursor-help hover:bg-slate-800 p-1 -mx-1 rounded transition-colors">
                          <span className="truncate pr-2 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            {r.name} {r.type === 'percentage' && `(${r.value}% aplicado)`}
                          </span>
                          <span className="font-semibold shrink-0 text-green-300">
                            + {fmt(r.calculatedValue)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 text-xs w-64 shadow-xl">
                        <p className="font-bold text-white mb-1 tracking-wide">
                          Memorial Descritivo:
                        </p>
                        {r.logic || 'Nenhum memorial descritivo informado pelo gestor.'}
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {calc.ignoredRules.length > 0 && (
                    <div className="border-t border-slate-700/50 my-2 pt-2" />
                  )}

                  {calc.ignoredRules.map((r) => (
                    <Tooltip key={r.id}>
                      <TooltipTrigger asChild>
                        <div className="flex justify-between items-center text-xs text-slate-500 cursor-help hover:bg-slate-800 p-1 -mx-1 rounded transition-colors">
                          <span className="truncate pr-2 flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                            {r.name}
                          </span>
                          <span className="shrink-0 italic text-[10px] uppercase tracking-widest text-slate-400">
                            {r.reason}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 text-xs w-64 shadow-xl">
                        <p className="font-bold text-white mb-1 tracking-wide">
                          Memorial Descritivo:
                        </p>
                        {r.logic || 'Nenhum memorial descritivo informado pelo gestor.'}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-400">Valor Original</span>
                    <span className="font-medium text-slate-300">
                      {fmt(calc.calculatedOriginalValue)}
                    </span>
                  </div>
                  {calc.discountValue > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-amber-400">
                        Desconto Aplicado ({calc.data.discountPercentage}%)
                      </span>
                      <span className="font-medium text-amber-400">
                        - {fmt(calc.discountValue)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                    <span className="font-bold text-slate-200">Total Simulado</span>
                    <span className="font-bold text-white text-base">
                      {fmt(calc.calculatedFinalValue)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mt-2 relative overflow-hidden shadow-inner">
                {calc.data.manualOverrideFinalValue !== null && (
                  <div className="absolute top-0 right-0 left-0 bg-amber-500/20 text-amber-300 text-[10px] px-2 py-1 uppercase font-bold tracking-wider text-center border-b border-amber-500/20">
                    Sugerido Manualmente: {calc.data.manualOverrideReason}
                  </div>
                )}

                <div className="flex justify-between items-start mb-1 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Valor Final do Frete
                  </span>
                </div>

                {isEditingFinalValue ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="h-10 text-right text-slate-900 rounded font-bold text-lg flex-1 bg-white"
                        value={overrideValue}
                        onChange={(e) => setOverrideValue(e.target.value)}
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 shrink-0"
                        onClick={() => {
                          if (!overrideReason.trim()) {
                            toast({
                              title: 'Alteração Bloqueada',
                              description:
                                'Você deve informar o motivo no campo abaixo (Memorial de Sobrescrita).',
                              variant: 'destructive',
                            })
                            return
                          }
                          calc.update({
                            manualOverrideFinalValue: Number(overrideValue),
                            manualOverrideReason: overrideReason,
                          })
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
                          setIsEditingFinalValue(false)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Motivo / Justificativa da alteração..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="bg-slate-900 border-amber-500/50 focus-visible:ring-amber-500 text-white text-sm"
                    />
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
                        setOverrideReason(calc.data.manualOverrideReason || '')
                        setIsEditingFinalValue(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {calc.data.manualOverrideFinalValue !== null && !isEditingFinalValue && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-slate-400 hover:text-rose-400 text-xs"
                      onClick={() =>
                        calc.update({ manualOverrideFinalValue: null, manualOverrideReason: '' })
                      }
                    >
                      Remover ajuste e voltar ao Total Simulado
                    </Button>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-700 flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      if (!calc.data.customerCnpj || calc.data.customerCnpj.length < 14) {
                        toast({
                          title: 'Atenção',
                          description: 'Informe um CNPJ válido para gerar a cotação.',
                          variant: 'destructive',
                        })
                        return
                      }
                      const quoteId = `COT-${Math.floor(1000 + Math.random() * 9000)}`
                      const now = new Date()
                      addInternalQuote({
                        id: quoteId,
                        date: now.toLocaleDateString('pt-BR'),
                        time: now.toLocaleTimeString('pt-BR'),
                        customerCnpj: calc.data.customerCnpj,
                        employeeName: state.currentUser?.name || 'Sistema',
                        department: state.role,
                        originalValue: calc.calculatedOriginalValue,
                        discountValue: calc.discountValue,
                        finalValue: calc.finalValue,
                      })

                      pb.collection('documentos_cotacao')
                        .create({
                          origem: ['Funcionário Financeiro', 'Funcionario_Financeiro'].includes(
                            state.role,
                          )
                            ? 'Funcionario_Financeiro'
                            : [
                                  'Funcionário Coleta',
                                  'Funcionário_Coleta',
                                  'Funcionario_Coleta',
                                ].includes(state.role)
                              ? 'Coleta'
                              : state.role.includes('Comercial')
                                ? 'Comercial'
                                : 'Interno',
                          numero_cotacao: quoteId,
                          valor: calc.finalValue,
                          status: 'pendente',
                          cliente_id: state.currentUser?.id,
                        })
                        .catch(console.error)

                      toast({
                        title: 'Cotação Gerada e Salva',
                        description: `Cotação ${quoteId} salva no histórico com sucesso. Gerando PDF...`,
                      })
                      if (tab !== 'quotes') {
                        setTab('quotes')
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
                  >
                    <Download className="w-4 h-4" /> Gerar Cotação & PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
