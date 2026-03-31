import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet } from 'lucide-react'
import { FleetCostsForm } from '@/components/fleet/FleetCostsForm'
import { FleetDashboard } from '@/components/fleet/FleetDashboard'
import { FleetVehicles } from '@/components/fleet/FleetVehicles'

export default function ControleGastos() {
  const [tab, setTab] = useState('lancamento')

  return (
    <div className="space-y-6 bg-slate-50 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary border border-primary/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Controle da Frota e Gastos
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Acompanhe custos, cpk, veículos e inteligência artificial.
            </p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4 w-full md:w-auto bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex overflow-x-auto print:hidden">
          <TabsTrigger
            value="lancamento"
            className="data-[state=active]:bg-primary data-[state=active]:text-white flex-shrink-0"
          >
            Lançamento de Custos
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-primary data-[state=active]:text-white flex-shrink-0"
          >
            Dashboard & Relatórios
          </TabsTrigger>
          <TabsTrigger
            value="veiculos"
            className="data-[state=active]:bg-primary data-[state=active]:text-white flex-shrink-0"
          >
            Veículos & Manutenção
          </TabsTrigger>
        </TabsList>
        <TabsContent value="lancamento">
          <FleetCostsForm />
        </TabsContent>
        <TabsContent value="dashboard">
          <FleetDashboard />
        </TabsContent>
        <TabsContent value="veiculos">
          <FleetVehicles />
        </TabsContent>
      </Tabs>
    </div>
  )
}
