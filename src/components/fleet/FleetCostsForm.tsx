import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createFleetCost } from '@/services/fleet_costs'
import { getVehicles } from '@/services/vehicles'
import pb from '@/lib/pocketbase/client'
import { Save, Calculator, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFleetCalculator } from '@/stores/useFleetCalculator'

export function FleetCostsForm() {
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehicleId, setVehicleId] = useState('')
  const [monthYear, setMonthYear] = useState('')

  const { data, update, loadSettings, calculations } = useFleetCalculator()
  const {
    driverTotal,
    vehicleTotal,
    hqTotal,
    taxesTotal,
    finalTotalCost,
    finalCpk,
    currentMargin,
    cpkStatus,
    marginStatus,
  } = calculations

  useEffect(() => {
    getVehicles()
      .then(setVehicles)
      .catch(() => {})
    loadSettings()
  }, [])

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
          title: 'Erro',
          description: 'Usuário não autenticado.',
          variant: 'destructive',
        })

      await createFleetCost({
        user_id: userId,
        vehicle_id: vehicleId || undefined,
        month_year: monthYear,
        fixed_salary_driver: data.baseSalary,
        fixed_salary_helper: 0,
        fixed_insurance: data.hullInsuranceAnnual / 12,
        fixed_ipva: data.ipvaAnnual / 12,
        fixed_depreciation: (data.vehiclePurchasePrice - data.vehicleResalePrice) / 60,
        fixed_tracking: data.tracking,
        fixed_warehouse: hqTotal,
        var_fuel:
          data.estimatedKm > 0 ? (data.estimatedKm / data.dieselConsumption) * data.dieselPrice : 0,
        var_arla: 0,
        var_maintenance: data.maintenance,
        var_tires: 0,
        var_washing: data.cleaning,
        km_initial: 0,
        km_final: data.estimatedKm,
        details: data,
        total_cost: finalTotalCost,
        estimated_km: data.estimatedKm,
        cpk: finalCpk,
      })
      toast({ title: 'Sucesso', description: 'Cálculo de CPK salvo com sucesso!' })
      setMonthYear('')
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar.', variant: 'destructive' })
    }
  }

  const InputField = ({ label, valueKey }: { label: string; valueKey: keyof typeof data }) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        value={data[valueKey] || ''}
        onChange={(e) => update({ [valueKey]: Number(e.target.value) })}
      />
    </div>
  )

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'green') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'yellow') return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start animate-fade-in">
      <div className="lg:col-span-8 space-y-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Calculadora Modular CPK</CardTitle>
                <CardDescription>Preencha os dados operacionais.</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="h-10 px-3 py-2 rounded-md border text-sm bg-white"
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
                  className="w-28 text-center font-bold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="driver" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0 overflow-x-auto">
                <TabsTrigger
                  value="driver"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
                >
                  Motoristas
                </TabsTrigger>
                <TabsTrigger
                  value="vehicle"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
                >
                  Veículos
                </TabsTrigger>
                <TabsTrigger
                  value="hq"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
                >
                  Sede
                </TabsTrigger>
                <TabsTrigger
                  value="taxes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
                >
                  Impostos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="driver" className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="Salário Base" valueKey="baseSalary" />
                <InputField label="VR Diário" valueKey="vrDaily" />
                <InputField label="VT Complemento" valueKey="vtComplement" />
                <InputField label="Cesta Básica" valueKey="foodBasket" />
                <InputField label="Seguro de Vida" valueKey="lifeInsurance" />
                <InputField label="Toxicológico (Anual)" valueKey="toxicologyAnnual" />
              </TabsContent>

              <TabsContent value="vehicle" className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="IPVA (Anual)" valueKey="ipvaAnnual" />
                <InputField label="Seguro Casco (Anual)" valueKey="hullInsuranceAnnual" />
                <InputField label="Valor Compra" valueKey="vehiclePurchasePrice" />
                <InputField label="Valor Revenda" valueKey="vehicleResalePrice" />
                <InputField label="Custo Unit. Pneu" valueKey="tireUnitCost" />
                <InputField label="Vida Útil Pneu (km)" valueKey="tireLifeKm" />
                <InputField label="Manutenção/Mês" valueKey="maintenance" />
                <InputField label="Lavagem" valueKey="cleaning" />
                <InputField label="RCTR-C (Anual)" valueKey="rctrcAnnual" />
                <InputField label="RCF-DC (Anual)" valueKey="rcfdcAnnual" />
                <InputField label="Averbação" valueKey="averbacao" />
                <InputField label="Rastreamento" valueKey="tracking" />
              </TabsContent>

              <TabsContent value="hq" className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="IPTU (Anual)" valueKey="iptuAnnual" />
                <InputField label="Aluguel" valueKey="rent" />
                <InputField label="Água" valueKey="water" />
                <InputField label="Luz" valueKey="electricity" />
                <InputField label="Internet" valueKey="internet" />
                <InputField label="Telefone" valueKey="telephone" />
                <InputField label="AVCB (Anual)" valueKey="avcbAnnual" />
                <InputField label="Seguro Predial" valueKey="propertyInsuranceAnnual" />
                <InputField label="Docas" valueKey="docks" />
              </TabsContent>

              <TabsContent value="taxes" className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="Faturamento Previsto" valueKey="revenue" />
                <InputField label="Alíquota Simples (%)" valueKey="simplesRate" />
                <InputField label="Qtd. CT-e/MDF-e" valueKey="cteCount" />
                <InputField label="Custo CT-e (Unid.)" valueKey="cteUnitCost" />
                <InputField label="Fiscalização (Anual)" valueKey="fiscalizacaoAnnual" />
                <InputField label="KM Morto Projetado" valueKey="deadKm" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
        <Card className="border-none shadow-xl bg-slate-900 text-white">
          <CardHeader className="bg-primary p-4 border-b border-primary/50 flex flex-row items-center gap-3">
            <Calculator className="w-5 h-5" />
            <CardTitle className="text-lg">Dashboard Real-Time</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs font-bold uppercase">
                KM Estimado Mensal
              </Label>
              <Input
                type="number"
                className="bg-slate-800 border-slate-600 text-white"
                value={data.estimatedKm}
                onChange={(e) => update({ estimatedKm: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Motoristas</span>
                <span>{fmt(driverTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Veículos</span>
                <span>{fmt(vehicleTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Sede</span>
                <span>{fmt(hqTotal)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-300">Impostos & Taxas</span>
                <span>{fmt(taxesTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-100 pt-2 pb-2">
                <span className="text-slate-300">Custo Final Total</span>
                <span>{fmt(finalTotalCost)}</span>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">CPK (Custo p/ KM)</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">{fmt(finalCpk)}</span>
                  <StatusIcon status={cpkStatus} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Margem Líquida</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{currentMargin.toFixed(1)}%</span>
                  <StatusIcon status={marginStatus} />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full h-12 text-lg font-bold gap-2">
              <Save className="w-5 h-5" /> Salvar Controle
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
