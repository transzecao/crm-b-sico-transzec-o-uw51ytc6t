import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createFleetCost } from '@/services/fleet_costs'
import pb from '@/lib/pocketbase/client'
import { Wallet, Save, Calculator, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ControleGastos() {
  const { toast } = useToast()

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
  const [km, setKm] = useState({
    initial: 0,
    final: 0,
  })

  const handleFixedChange = (field: keyof typeof fixedCosts, value: string) => {
    setFixedCosts((prev) => ({ ...prev, [field]: Number(value) || 0 }))
  }

  const handleVarChange = (field: keyof typeof varCosts, value: string) => {
    setVarCosts((prev) => ({ ...prev, [field]: Number(value) || 0 }))
  }

  const totalFixed = Object.values(fixedCosts).reduce((a, b) => a + b, 0)
  const totalVar = Object.values(varCosts).reduce((a, b) => a + b, 0)
  const totalKm = Math.max(0, km.final - km.initial)
  const totalCost = totalFixed + totalVar
  const cpk = totalKm > 0 ? totalCost / totalKm : 0

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  const handleSave = async () => {
    if (!monthYear) {
      toast({
        title: 'Aviso',
        description: 'Preencha o Mês de Referência.',
        variant: 'destructive',
      })
      return
    }

    try {
      const userId = pb.authStore.record?.id
      if (!userId) {
        toast({ title: 'Aviso', description: 'Usuário não autenticado.', variant: 'destructive' })
        return
      }

      await createFleetCost({
        user_id: userId,
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

      toast({ title: 'Sucesso', description: 'Controle de gastos salvo com sucesso!' })

      setMonthYear('')
      setFixedCosts({
        salaryDriver: 0,
        salaryHelper: 0,
        insurance: 0,
        ipva: 0,
        depreciation: 0,
        tracking: 0,
        warehouse: 0,
      })
      setVarCosts({ fuel: 0, arla: 0, maintenance: 0, tires: 0, washing: 0 })
      setKm({ initial: 0, final: 0 })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar. Tente novamente.',
        variant: 'destructive',
      })
      console.error(error)
    }
  }

  const fixedFields = [
    { key: 'salaryDriver', label: 'Salário Motorista + Encargos' },
    { key: 'salaryHelper', label: 'Salário Ajudante + Encargos' },
    { key: 'insurance', label: 'Seguro do Caminhão (Anual / 12)' },
    { key: 'ipva', label: 'IPVA / Licenciamento (Anual / 12)' },
    { key: 'depreciation', label: 'Depreciação Mensal' },
    { key: 'tracking', label: 'Rastreamento / Telemetria' },
    {
      key: 'warehouse',
      label: 'Proporção do Custo do Galpão',
      tooltip: 'Calculado como Total Galpão / Número de Caminhões na Frota',
    },
  ] as const

  const varFields = [
    { key: 'fuel', label: 'Combustível (Diesel)' },
    { key: 'arla', label: 'Arla 32' },
    { key: 'maintenance', label: 'Manutenção / Oficinas' },
    { key: 'tires', label: 'Pneus (Provisão)' },
    { key: 'washing', label: 'Lavagens e Lubrificação' },
  ] as const

  return (
    <div className="space-y-6 bg-slate-50 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary border border-primary/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Controle de Gastos da Frota
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Acompanhe os custos fixos, variáveis e o Custo por Quilômetro (CPK).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label className="whitespace-nowrap font-bold text-slate-700">Mês de Referência:</Label>
          <Input
            placeholder="MM/AAAA"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            className="w-32 text-center font-bold"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-slate-100/50 border-b border-slate-200">
              <CardTitle>Tabela 1 - Custos Fixos</CardTitle>
              <CardDescription>
                Gastos mensais que não dependem da quilometragem rodada.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-slate-700 pl-6">Descrição</TableHead>
                    <TableHead className="w-[200px] text-right font-bold text-slate-700 pr-6">
                      Valor Mensal (R$)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedFields.map((field) => (
                    <TableRow key={field.key}>
                      <TableCell className="pl-6 font-medium text-slate-600">
                        <div className="flex items-center gap-2">
                          {field.label}
                          {field.tooltip && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>{field.tooltip}</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        <Input
                          type="number"
                          step="0.01"
                          className="text-right font-mono"
                          value={fixedCosts[field.key] || ''}
                          onChange={(e) => handleFixedChange(field.key, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-slate-50">
                  <TableRow>
                    <TableCell className="pl-6 font-bold text-slate-900">
                      TOTAL CUSTOS FIXOS (A)
                    </TableCell>
                    <TableCell className="pr-6 text-right font-bold text-lg text-slate-900">
                      {fmt(totalFixed)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-slate-100/50 border-b border-slate-200">
              <CardTitle>Tabela 2 - Custos Variáveis</CardTitle>
              <CardDescription>
                Gastos que variam de acordo com o uso e quilometragem do veículo.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-slate-700 pl-6">Descrição</TableHead>
                    <TableHead className="w-[200px] text-right font-bold text-slate-700 pr-6">
                      Valor Mensal (R$)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {varFields.map((field) => (
                    <TableRow key={field.key}>
                      <TableCell className="pl-6 font-medium text-slate-600">
                        {field.label}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Input
                          type="number"
                          step="0.01"
                          className="text-right font-mono"
                          value={varCosts[field.key] || ''}
                          onChange={(e) => handleVarChange(field.key, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-slate-50">
                  <TableRow>
                    <TableCell className="pl-6 font-bold text-slate-900">
                      TOTAL CUSTOS VARIÁVEIS (B)
                    </TableCell>
                    <TableCell className="pr-6 text-right font-bold text-lg text-slate-900">
                      {fmt(totalVar)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
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
                <h3 className="font-bold text-lg leading-tight tracking-wide">
                  Tabela 3 - Resumo Operacional
                </h3>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-700">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    KM Inicial do Mês
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
                    KM Final do Mês
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
                  <span className="text-slate-300 font-medium">Quilometragem Total (C)</span>
                  <span className="font-bold text-white bg-slate-800 px-2 py-1 rounded">
                    {totalKm.toLocaleString('pt-BR')} km
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="text-slate-300 font-medium">Custos Fixos (A)</span>
                  <span className="font-medium text-slate-200">{fmt(totalFixed)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="text-slate-300 font-medium">Custos Variáveis (B)</span>
                  <span className="font-medium text-slate-200">{fmt(totalVar)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="text-slate-200 font-bold">Custo Total Mensal (A+B)</span>
                  <span className="font-bold text-amber-400 text-base">{fmt(totalCost)}</span>
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
    </div>
  )
}
