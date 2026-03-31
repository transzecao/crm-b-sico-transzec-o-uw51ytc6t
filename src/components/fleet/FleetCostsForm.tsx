import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createFleetCost } from '@/services/fleet_costs'
import { getVehicles } from '@/services/vehicles'
import pb from '@/lib/pocketbase/client'
import { Save, Calculator } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function FleetCostsForm() {
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehicleId, setVehicleId] = useState('')
  const [monthYear, setMonthYear] = useState('')
  const [fixedCosts, setFixedCosts] = useState({
    salaryDriver: 0,
    salaryHelper: 0,
    insurance: 0,
    ipva: 0,
    depreciation: 0,
    tracking: 0,
    warehouse: 0,
  })
  const [varCosts, setVarCosts] = useState({
    fuel: 0,
    arla: 0,
    maintenance: 0,
    tires: 0,
    washing: 0,
  })
  const [km, setKm] = useState({ initial: 0, final: 0 })

  useEffect(() => {
    getVehicles()
      .then(setVehicles)
      .catch(() => {})
  }, [])

  const totalFixed = Object.values(fixedCosts).reduce((a, b) => a + b, 0)
  const totalVar = Object.values(varCosts).reduce((a, b) => a + b, 0)
  const totalKm = Math.max(0, km.final - km.initial)
  const totalCost = totalFixed + totalVar
  const cpk = totalKm > 0 ? totalCost / totalKm : 0
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  const handleSave = async () => {
    if (!monthYear)
      return toast({
        title: 'Aviso',
        description: 'Preencha o Mês de Referência.',
        variant: 'destructive',
      })
    try {
      const userId = pb.authStore.record?.id
      if (!userId)
        return toast({
          title: 'Aviso',
          description: 'Usuário não autenticado.',
          variant: 'destructive',
        })

      await createFleetCost({
        user_id: userId,
        vehicle_id: vehicleId || undefined,
        month_year: monthYear,
        fixed_salary_driver: fixedCosts.salaryDriver,
        fixed_salary_helper: fixedCosts.salaryHelper,
        fixed_insurance: fixedCosts.insurance,
        fixed_ipva: fixedCosts.ipva,
        fixed_depreciation: fixedCosts.depreciation,
        fixed_tracking: fixedCosts.tracking,
        fixed_warehouse: fixedCosts.warehouse,
        var_fuel: varCosts.fuel,
        var_arla: varCosts.arla,
        var_maintenance: varCosts.maintenance,
        var_tires: varCosts.tires,
        var_washing: varCosts.washing,
        km_initial: km.initial,
        km_final: km.final,
      })
      toast({ title: 'Sucesso', description: 'Controle salvo com sucesso!' })
      setMonthYear('')
      setVehicleId('')
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar.', variant: 'destructive' })
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start animate-fade-in">
      <div className="lg:col-span-8 space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-100/50 border-b border-slate-200">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Tabelas de Custos</CardTitle>
                <CardDescription>Insira os valores mensais e quilometragem.</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="h-10 px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-32 bg-white"
                >
                  <option value="">Frota Geral</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="MM/AAAA"
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                  className="w-full md:w-28 text-center font-bold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries({
                salaryDriver: 'Salário Motorista',
                salaryHelper: 'Salário Ajudante',
                insurance: 'Seguro/12',
                ipva: 'IPVA/12',
                depreciation: 'Depreciação',
                tracking: 'Rastreamento',
                warehouse: 'Galpão/Rateio',
              }).map(([k, label]) => (
                <div key={k} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={fixedCosts[k as keyof typeof fixedCosts] || ''}
                    onChange={(e) =>
                      setFixedCosts((p) => ({ ...p, [k]: Number(e.target.value) || 0 }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries({
                fuel: 'Combustível',
                arla: 'Arla 32',
                maintenance: 'Manutenção',
                tires: 'Pneus',
                washing: 'Lavagem',
              }).map(([k, label]) => (
                <div key={k} className="space-y-1">
                  <Label className="text-xs text-amber-700">{label}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={varCosts[k as keyof typeof varCosts] || ''}
                    onChange={(e) =>
                      setVarCosts((p) => ({ ...p, [k]: Number(e.target.value) || 0 }))
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
        <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden">
          <div className="bg-primary text-white p-5 flex items-center justify-between border-b border-primary/50">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg leading-tight tracking-wide">Resumo Operacional</h3>
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-700">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  KM Inicial
                </Label>
                <Input
                  type="number"
                  className="bg-slate-800 border-slate-600 text-white font-mono"
                  value={km.initial || ''}
                  onChange={(e) => setKm((p) => ({ ...p, initial: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  KM Final
                </Label>
                <Input
                  type="number"
                  className="bg-slate-800 border-slate-600 text-white font-mono"
                  value={km.final || ''}
                  onChange={(e) => setKm((p) => ({ ...p, final: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                <span className="text-slate-300 font-medium">Quilometragem Total</span>
                <span className="font-bold text-white bg-slate-800 px-2 py-1 rounded">
                  {totalKm.toLocaleString('pt-BR')} km
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                <span className="text-slate-300 font-medium">Custos Fixos</span>
                <span className="font-medium text-slate-200">{fmt(totalFixed)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                <span className="text-slate-300 font-medium">Custos Variáveis</span>
                <span className="font-medium text-slate-200">{fmt(totalVar)}</span>
              </div>
              <div className="flex flex-col gap-1 pt-4">
                <span className="text-sm font-bold text-primary-foreground/70 uppercase tracking-widest">
                  CUSTO POR KM (CPK)
                </span>
                <span className="text-4xl font-black text-primary-foreground tracking-tight">
                  {fmt(cpk)}
                </span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-700">
              <Button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 py-6 text-lg"
              >
                <Save className="w-5 h-5" /> Salvar Controle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
