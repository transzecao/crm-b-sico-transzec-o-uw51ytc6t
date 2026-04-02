import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Map as RouteIcon,
  Package,
  Truck,
  Settings,
  BarChart,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapViewer } from '@/components/roteirizacao/MapViewer'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart as BarChartRecharts,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScheduleForm } from '@/components/roteirizacao/ScheduleForm'

const CLUSTERS = [
  'Campinas',
  'Diadema',
  'Guarulhos',
  'Hortolandia',
  'Louveira',
  'Osasco',
  'São Paulo',
  'São Bernardo do Campo',
  'São Caetano do Sul',
  'Sumaré',
  'Valinhos',
  'Vinhedo',
  'Itupeva',
]

export default function Roteirizacao() {
  const { state } = useCrmStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const isSupervisor = ['Master', 'Supervisor_Coleta'].includes(user?.role || state.role)

  const [schedules, setSchedules] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [routePlans, setRoutePlans] = useState<any[]>([])

  const [selectedForRoute, setSelectedForRoute] = useState<string[]>([])
  const [routeConfig, setRouteConfig] = useState({
    vehicle_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    cluster: 'Campinas',
  })

  const loadData = async () => {
    try {
      const [sData, vData, rData] = await Promise.all([
        pb.collection('collection_schedules').getFullList({ sort: '-created' }),
        pb.collection('vehicles').getFullList({ filter: 'status="active"' }),
        pb
          .collection('route_plans')
          .getFullList({ expand: 'schedule_id,vehicle_id', sort: '-created' }),
      ])
      setSchedules(sData)
      setVehicles(vData)
      setRoutePlans(rData)
    } catch (e) {}
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('collection_schedules', () => {
    loadData()
  })
  useRealtime('route_plans', () => {
    loadData()
  })

  const pendingSchedules = schedules.filter((s) => s.status === 'pending')

  const toggleScheduleSelection = (id: string) => {
    setSelectedForRoute((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleCreateRoute = async () => {
    if (!routeConfig.vehicle_id || !routeConfig.date || selectedForRoute.length === 0) {
      toast({ title: 'Preencha todos os campos e selecione agendamentos.', variant: 'destructive' })
      return
    }
    try {
      await pb.collection('route_plans').create({
        schedule_id: selectedForRoute,
        vehicle_id: routeConfig.vehicle_id,
        date: new Date(routeConfig.date).toISOString(),
        cluster: routeConfig.cluster,
        created_by: user?.id,
      })
      await Promise.all(
        selectedForRoute.map((id) =>
          pb.collection('collection_schedules').update(id, { status: 'routed' }),
        ),
      )
      toast({ title: 'Rota criada com sucesso!' })
      setSelectedForRoute([])
    } catch (e) {
      toast({ title: 'Erro ao criar rota', variant: 'destructive' })
    }
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const vehicleStats = vehicles
    .map((v) => {
      const plans = routePlans.filter((rp) => rp.vehicle_id === v.id)
      const schedulesCount = plans.reduce((acc, rp) => acc + (rp.schedule_id?.length || 0), 0)
      return { name: v.plate, value: schedulesCount }
    })
    .filter((v) => v.value > 0)

  const waypoints = selectedForRoute.map((id) => {
    const s = schedules.find((x) => x.id === id)
    return { id, address: s.dest_address, weight: s.total_weight }
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
          <RouteIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Roteirização e Agendamentos
          </h1>
          <p className="text-slate-500 font-medium">Gestão de coletas, veículos e performance.</p>
        </div>
      </div>

      <Tabs defaultValue="agendamentos" className="w-full">
        <TabsList className="bg-white border border-slate-200 h-12 p-1 overflow-x-auto flex-nowrap shrink-0">
          <TabsTrigger
            value="agendamentos"
            className="h-full px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
          >
            <Package className="w-4 h-4 mr-2" /> Agendamentos
          </TabsTrigger>
          <TabsTrigger
            value="roteirizacao"
            className="h-full px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
          >
            <Truck className="w-4 h-4 mr-2" /> Planejamento de Rota
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className="h-full px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
          >
            <BarChart className="w-4 h-4 mr-2" /> Dashboard
          </TabsTrigger>
          {isSupervisor && (
            <TabsTrigger
              value="config"
              className="h-full px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold"
            >
              <Settings className="w-4 h-4 mr-2" /> Configurações
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="agendamentos" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Coletas Pendentes de Roteirização ({pendingSchedules.length})</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agendar Coleta Interna</DialogTitle>
                  </DialogHeader>
                  <ScheduleForm />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingSchedules.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        NFe: {s.invoice_id} | Origem: {s.sender_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {s.dest_address} ({s.total_weight}kg / {s.total_volume})
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 bg-amber-100 text-amber-800 border-amber-200"
                      >
                        Pendente
                      </Badge>
                    </div>
                    <Button
                      variant={selectedForRoute.includes(s.id) ? 'default' : 'outline'}
                      onClick={() => toggleScheduleSelection(s.id)}
                      className={selectedForRoute.includes(s.id) ? 'bg-primary' : ''}
                    >
                      {selectedForRoute.includes(s.id) ? (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {selectedForRoute.includes(s.id) ? 'Selecionado' : 'Incluir na Rota'}
                    </Button>
                  </div>
                ))}
                {pendingSchedules.length === 0 && (
                  <p className="text-center text-slate-500 py-6">Nenhum agendamento pendente.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roteirizacao" className="mt-4 grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  Parâmetros da Rota
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Data da Rota</Label>
                  <Input
                    type="date"
                    value={routeConfig.date}
                    onChange={(e) => setRouteConfig({ ...routeConfig, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cluster</Label>
                  <Select
                    value={routeConfig.cluster}
                    onValueChange={(v) => setRouteConfig({ ...routeConfig, cluster: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLUSTERS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Veículo</Label>
                  <Select
                    value={routeConfig.vehicle_id}
                    onValueChange={(v) => setRouteConfig({ ...routeConfig, vehicle_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.plate} ({v.model || 'Sem Modelo'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Label className="mb-2 block">
                    Agendamentos Selecionados ({selectedForRoute.length})
                  </Label>
                  <div className="text-xs text-slate-500 mb-4">
                    Peso Total:{' '}
                    {selectedForRoute.reduce(
                      (acc, id) => acc + (schedules.find((s) => s.id === id)?.total_weight || 0),
                      0,
                    )}
                    kg
                  </div>
                  <Button onClick={handleCreateRoute} className="w-full bg-primary font-bold">
                    Salvar Rota Otimizada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8">
            <MapViewer waypoints={waypoints} routeGenerated={waypoints.length > 0} />
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coletas por Veículo (Distribuição)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {vehicleStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rotas Criadas por Dia</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartRecharts data={[{ name: 'Hoje', coletas: routePlans.length }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="coletas" fill="#800020" radius={[4, 4, 0, 0]} />
                  </BarChartRecharts>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isSupervisor && (
          <TabsContent value="config" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Roteirização</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-4">
                  Gerencie as regras dinâmicas de roteirização e limites de carga.
                </p>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Peso Máximo Padrão por Rota (kg)</Label>
                    <Input defaultValue="5000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Exigir Dimensões no Agendamento</Label>
                    <Select defaultValue="sim">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-primary">Salvar Regras</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
