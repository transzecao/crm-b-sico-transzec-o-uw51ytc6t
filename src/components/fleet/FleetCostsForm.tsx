import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createFleetCost } from '@/services/fleet_costs'
import pb from '@/lib/pocketbase/client'
import { Save, Calculator, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { DriverTab } from './tabs/DriverTab'
import { VehicleTab } from './tabs/VehicleTab'
import { LinkTab } from './tabs/LinkTab'
import { HQTab } from './tabs/HQTab'
import { TaxesTab } from './tabs/TaxesTab'

export function FleetCostsForm() {
  const { toast } = useToast()
  const [monthYear, setMonthYear] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { data, errors, loadSettings, calculations } = useFleetCalculator()
  const {
    totalKm,
    driverTotal,
    vehicleTotal,
    hqTotal,
    baseTaxes,
    dasCost,
    faturamento,
    finalTotalCost,
    finalCpk,
    currentMargin,
    cpkStatus,
    marginStatus,
  } = calculations

  useEffect(() => {
    loadSettings()
  }, [])

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  const syncMastersToDB = async () => {
    try {
      // Upsert drivers
      for (const d of data.drivers) {
        const payload = {
          local_id: d.id,
          name: d.name,
          cpf: d.cpf,
          cnh: d.cnh,
          base_salary: d.baseSalary,
          periculosidade: d.periculosidade,
          vr_daily: d.vrDaily,
          vt_mensal: d.vtMensal,
          cesta_basica: d.cestaBasica,
          seguro_vida: d.seguroVida,
          tox_anual: d.toxAnual,
          rat: d.rat,
          encargos: d.encargos,
        }
        try {
          const existing = await pb
            .collection('drivers')
            .getFirstListItem(`local_id="${d.id}"`)
            .catch(() => null)
          if (existing) await pb.collection('drivers').update(existing.id, payload)
          else await pb.collection('drivers').create(payload)
        } catch (e) {}
      }

      // Upsert vehicles
      for (const v of data.vehicles) {
        const payload = {
          local_id: v.id,
          plate: v.plate,
          model: v.model,
          year: v.year,
          vehicle_type: v.type,
          purchase_value: v.purchaseValue,
          resale_value: v.resaleValue,
          ipva: v.ipva,
          licenciamento: v.licenciamento,
          seguro_casco: v.seguroCasco,
          rctrc: v.rctrc,
          rcfdc: v.rcfdc,
          consumo: v.consumo,
          diesel_price: v.dieselPrice,
          pneus_jogo: v.pneusJogo,
          km_pneus: v.kmPneus,
          manutencao: v.manutencao,
          usa_arla: v.usaArla,
          limpeza: v.limpeza,
          averbacao: v.averbacao,
          consulta: v.consulta,
          satelite: v.satelite,
          status: 'active',
        }
        try {
          const existing = await pb
            .collection('vehicles')
            .getFirstListItem(`local_id="${v.id}"`)
            .catch(() => null)
          if (existing) await pb.collection('vehicles').update(existing.id, payload)
          else await pb.collection('vehicles').create(payload)
        } catch (e) {}
      }

      // Upsert vinculos
      for (const l of data.links) {
        const payload = {
          local_id: l.id,
          driver_local_id: l.driverId,
          vehicle_local_id: l.vehicleId,
          km_mensal: l.km,
        }
        try {
          const existing = await pb
            .collection('vinculos')
            .getFirstListItem(`local_id="${l.id}"`)
            .catch(() => null)
          if (existing) await pb.collection('vinculos').update(existing.id, payload)
          else await pb.collection('vinculos').create(payload)
        } catch (e) {}
      }
    } catch (e) {
      console.error('Failed to sync masters', e)
    }
  }

  const handleSave = async () => {
    if (!monthYear)
      return toast({
        title: 'Aviso',
        description: 'Preencha o Mês de Referência (Ex: 10/2023).',
        variant: 'destructive',
      })
    if (errors.length > 0)
      return toast({
        title: 'Aviso',
        description: 'Corrija os erros de validação antes de salvar.',
        variant: 'destructive',
      })

    try {
      setIsSaving(true)
      const userId = pb.authStore.record?.id
      if (!userId)
        return toast({
          title: 'Erro',
          description: 'Usuário não autenticado.',
          variant: 'destructive',
        })

      await syncMastersToDB()

      await createFleetCost({
        user_id: userId,
        month_year: monthYear,
        fixed_salary_driver: driverTotal,
        fixed_salary_helper: 0,
        fixed_insurance: 0,
        fixed_ipva: 0,
        fixed_depreciation: 0,
        fixed_tracking: 0,
        fixed_warehouse: hqTotal,
        var_fuel: vehicleTotal, // simplified var logic mapping
        var_arla: 0,
        var_maintenance: 0,
        var_tires: 0,
        var_washing: 0,
        km_initial: 0,
        km_final: totalKm,
        details: {
          ...data,
          moduleTotals: { driverTotal, vehicleTotal, hqTotal, baseTaxes, dasCost },
          faturamento,
          margem: currentMargin,
        },
        total_cost: finalTotalCost,
        estimated_km: totalKm,
        cpk: finalCpk,
      })
      toast({
        title: 'Sucesso',
        description: 'Cálculo fechado. Masters e Histórico atualizados no banco de dados!',
      })
      setMonthYear('')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar no banco de dados.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'green') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'yellow') return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start animate-fade-in">
      <div className="lg:col-span-8 space-y-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b rounded-t-xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl">Calculadora Modular de Custos (CPK)</CardTitle>
                <CardDescription className="text-md">
                  Estrutura dinâmica e vinculada para precisão máxima na operação.
                </CardDescription>
              </div>
              <div className="flex gap-3 bg-white p-2 rounded-lg border shadow-sm">
                <Input
                  placeholder="MM/AAAA"
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                  className="w-32 text-center font-bold border-none shadow-none focus-visible:ring-0 text-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="drivers" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-slate-100/50 h-auto p-0 overflow-x-auto flex-nowrap">
                <TabsTrigger
                  value="drivers"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white rounded-none px-6 py-4 flex-shrink-0"
                >
                  Motoristas ({data.drivers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="vehicles"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white rounded-none px-6 py-4 flex-shrink-0"
                >
                  Veículos ({data.vehicles.length})
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:bg-white rounded-none px-6 py-4 font-bold flex-shrink-0"
                >
                  Vínculos ({data.links.length})
                </TabsTrigger>
                <TabsTrigger
                  value="hq"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white rounded-none px-6 py-4 flex-shrink-0"
                >
                  Sede Administrativa
                </TabsTrigger>
                <TabsTrigger
                  value="taxes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white rounded-none px-6 py-4 flex-shrink-0"
                >
                  Impostos & Taxas
                </TabsTrigger>
              </TabsList>

              <div className="p-6 bg-white min-h-[500px]">
                <TabsContent value="drivers" className="m-0">
                  <DriverTab />
                </TabsContent>
                <TabsContent value="vehicles" className="m-0">
                  <VehicleTab />
                </TabsContent>
                <TabsContent value="links" className="m-0">
                  <LinkTab />
                </TabsContent>
                <TabsContent value="hq" className="m-0">
                  <HQTab />
                </TabsContent>
                <TabsContent value="taxes" className="m-0">
                  <TaxesTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
        <Card className="border-none shadow-xl bg-slate-900 text-white rounded-xl overflow-hidden">
          <CardHeader className="bg-primary p-5 border-b border-primary/50 flex flex-row items-center gap-3">
            <Calculator className="w-6 h-6 text-primary-foreground" />
            <CardTitle className="text-xl text-primary-foreground">
              Painel de Custos (Real-Time)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {errors.length > 0 && (
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-800 text-red-100 rounded-lg"
              >
                <AlertTriangle className="h-5 w-5" color="currentColor" />
                <AlertTitle className="text-white font-bold ml-2">
                  Validação Requerida ({errors.length})
                </AlertTitle>
                <AlertDescription className="text-xs space-y-1.5 mt-2 ml-2 opacity-90">
                  {errors.slice(0, 3).map((e, i) => (
                    <div key={i}>• {e}</div>
                  ))}
                  {errors.length > 3 && (
                    <div className="font-bold mt-1 text-red-200">
                      ...e mais {errors.length - 3} itens.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                KM Mensal Total (Vínculos)
              </Label>
              <div className="text-3xl font-black text-emerald-400">
                {totalKm.toLocaleString('pt-BR')}{' '}
                <span className="text-lg font-medium text-emerald-600">km</span>
              </div>
            </div>

            <div className="space-y-3.5 text-sm font-medium">
              <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                <span className="text-slate-400">Total Motoristas</span>
                <span className="text-slate-100">{fmt(driverTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                <span className="text-slate-400">Total Veículos (Dep + Var)</span>
                <span className="text-slate-100">{fmt(vehicleTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                <span className="text-slate-400">Total Sede (Fixo)</span>
                <span className="text-slate-100">{fmt(hqTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                <span className="text-slate-400">Impostos Base (CT-e/Fiscal)</span>
                <span className="text-slate-100">{fmt(baseTaxes)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                <span className="text-slate-400">DAS Simples Nacional</span>
                <span className="text-slate-100">{fmt(dasCost)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg mt-4 shadow-inner">
                <span className="text-slate-300 font-bold">Custo Base da Operação</span>
                <span className="text-xl font-black text-white">{fmt(finalTotalCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <StatusIcon status={cpkStatus} />
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase block mb-1">
                  Custo por KM
                </span>
                <span className="text-2xl font-black text-white tracking-tight">
                  {fmt(finalCpk)}
                </span>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <StatusIcon status={marginStatus} />
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase block mb-1">
                  Margem Líquida
                </span>
                <span className="text-2xl font-black text-white tracking-tight">
                  {currentMargin.toFixed(1)}%
                </span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={errors.length > 0 || isSaving}
              className="w-full h-14 text-lg font-bold gap-3 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-700 disabled:text-slate-500 shadow-lg shadow-emerald-900/20"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Salvando...' : 'Fechar Mês e Salvar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
