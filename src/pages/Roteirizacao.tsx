import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Map as RouteIcon,
  Package,
  Truck,
  Settings,
  BarChart,
  Plus,
  CheckCircle2,
  Edit2,
  Trash2,
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
import { Switch } from '@/components/ui/switch'
import { MapViewer } from '@/components/roteirizacao/MapViewer'
import { Textarea } from '@/components/ui/textarea'
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
  Legend,
} from 'recharts'
import { format, isToday } from 'date-fns'
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

  const isSupervisor = [
    'Master',
    'Acesso Master',
    'Supervisor Coleta',
    'Supervisor_Coleta',
  ].includes(user?.role || state.role)

  const [activeTab, setActiveTab] = useState('agendamentos')
  const [schedules, setSchedules] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [routePlans, setRoutePlans] = useState<any[]>([])

  const [selectedForRoute, setSelectedForRoute] = useState<string[]>([])
  const [routeConfig, setRouteConfig] = useState({
    vehicle_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    cluster: 'Campinas',
  })

  const [editingSchedule, setEditingSchedule] = useState<any>(null)

  const [feedbackEmployee, setFeedbackEmployee] = useState('')
  const [feedbackText, setFeedbackText] = useState('')

  const loadData = async () => {
    try {
      const [sData, vData, rData] = await Promise.all([
        pb
          .collection('collection_schedules')
          .getFullList({ sort: '-created', expand: 'creator_id' }),
        pb.collection('vehicles').getFullList({ filter: 'status="active"' }),
        pb
          .collection('route_plans')
          .getFullList({ expand: 'schedule_id,vehicle_id', sort: '-created' }),
      ])
      setSchedules(sData)
      setVehicles(vData)
      setRoutePlans(rData)
    } catch (e) {
      console.error(e)
    }
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

  const handlePlanRoute = (schedule: any) => {
    if (!selectedForRoute.includes(schedule.id)) {
      setSelectedForRoute((prev) => [...prev, schedule.id])
    }
    setEditingSchedule(schedule)
    setActiveTab('roteirizacao')
  }

  const saveScheduleEdit = async () => {
    if (!editingSchedule) return
    try {
      await pb.collection('collection_schedules').update(editingSchedule.id, {
        total_weight: Number(editingSchedule.total_weight),
        total_volume: editingSchedule.total_volume,
        invoice_value: Number(editingSchedule.invoice_value),
        sender_cnpj: editingSchedule.sender_cnpj,
        sender_address: editingSchedule.sender_address,
        dest_cnpj: editingSchedule.dest_cnpj,
        dest_address: editingSchedule.dest_address,
      })
      toast({ title: 'Detalhes atualizados com sucesso.' })
      setEditingSchedule(null)
    } catch (e) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
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
      setEditingSchedule(null)
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

  const vehicleTodayStats = vehicles.map((v) => {
    const plans = routePlans.filter((rp) => rp.vehicle_id === v.id && isToday(new Date(rp.date)))
    const schedulesCount = plans.reduce((acc, rp) => acc + (rp.schedule_id?.length || 0), 0)
    return { name: v.plate, coletas: schedulesCount }
  })

  const employeeStats = useMemo(() => {
    const stats: Record<string, any> = {}
    schedules.forEach((s) => {
      const c = s.expand?.creator_id
      if (c && c.role && c.role.includes('Funcionário')) {
        if (!stats[c.id])
          stats[c.id] = {
            id: c.id,
            name: c.name || c.email,
            agendamentos: 0,
            cotacoes: Math.floor(Math.random() * 10),
          }
        stats[c.id].agendamentos += 1
      }
    })
    return Object.values(stats)
  }, [schedules])

  const waypoints = selectedForRoute
    .map((id) => {
      const s = schedules.find((x) => x.id === id)
      return { id, address: s?.dest_address, weight: s?.total_weight, volume: s?.total_volume }
    })
    .filter((w) => w.address)

  const selectedVehicle = vehicles.find((v) => v.id === routeConfig.vehicle_id)

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <BarChart className="w-4 h-4 mr-2" /> Dashboard Analítico
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
              <CardTitle>Coletas Pendentes ({pendingSchedules.length})</CardTitle>
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
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-primary/40 transition-colors gap-4"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        NFe: {s.invoice_id} | Origem: {s.sender_name} ➔ {s.dest_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {s.dest_address} ({s.total_weight}kg / {s.total_volume})
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Criado por:{' '}
                        {s.expand?.creator_id?.name ||
                          s.expand?.creator_id?.email ||
                          'Desconhecido'}{' '}
                        em {format(new Date(s.created), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={selectedForRoute.includes(s.id) ? 'default' : 'outline'}
                        onClick={() => toggleScheduleSelection(s.id)}
                        className={
                          selectedForRoute.includes(s.id)
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                            : ''
                        }
                      >
                        {selectedForRoute.includes(s.id) ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        {selectedForRoute.includes(s.id) ? 'Selecionado' : 'Selecionar'}
                      </Button>
                      <Button
                        onClick={() => handlePlanRoute(s)}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <RouteIcon className="w-4 h-4 mr-2" /> Planejar Rota
                      </Button>
                    </div>
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
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  Parâmetros da Rota
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="space-y-2">
                  <Label>Veículo Designado</Label>
                  <Select
                    value={routeConfig.vehicle_id}
                    onValueChange={(v) => setRouteConfig({ ...routeConfig, vehicle_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo (Ex: Opção 1, 2...)" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.plate} ({v.model || 'Caminhão'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="block">
                      Agendamentos na Rota ({selectedForRoute.length})
                    </Label>
                  </div>

                  {selectedForRoute.length > 0 ? (
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                      {selectedForRoute.map((id) => {
                        const s = schedules.find((x) => x.id === id)
                        if (!s) return null
                        return (
                          <div
                            key={id}
                            className="flex justify-between items-center p-2 bg-slate-50 border rounded-md text-sm"
                          >
                            <span className="font-medium truncate mr-2" title={s.dest_name}>
                              {s.invoice_id} - {s.dest_name}
                            </span>
                            <div className="flex gap-1 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => setEditingSchedule(s)}
                              >
                                <Edit2 className="w-3 h-3 text-blue-600" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => toggleScheduleSelection(id)}
                              >
                                <Trash2 className="w-3 h-3 text-rose-600" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mb-4 italic">
                      Selecione agendamentos na aba anterior.
                    </p>
                  )}

                  {editingSchedule && selectedForRoute.includes(editingSchedule.id) && (
                    <div className="space-y-3 p-3 border border-blue-100 bg-blue-50/50 rounded-lg mb-4 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-blue-800">
                          Editando NFe: {editingSchedule.invoice_id}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingSchedule(null)}
                        >
                          &times;
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <Label className="text-xs">Peso (kg)</Label>
                          <Input
                            size={1}
                            value={editingSchedule.total_weight}
                            onChange={(e) =>
                              setEditingSchedule({
                                ...editingSchedule,
                                total_weight: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Volume</Label>
                          <Input
                            size={1}
                            value={editingSchedule.total_volume}
                            onChange={(e) =>
                              setEditingSchedule({
                                ...editingSchedule,
                                total_volume: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Valor NF (R$)</Label>
                          <Input
                            size={1}
                            value={editingSchedule.invoice_value}
                            onChange={(e) =>
                              setEditingSchedule({
                                ...editingSchedule,
                                invoice_value: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">CNPJ Orig.</Label>
                          <Input
                            size={1}
                            value={editingSchedule.sender_cnpj}
                            onChange={(e) =>
                              setEditingSchedule({
                                ...editingSchedule,
                                sender_cnpj: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">End. Origem</Label>
                          <Input
                            size={1}
                            value={editingSchedule.sender_address}
                            onChange={(e) =>
                              setEditingSchedule({
                                ...editingSchedule,
                                sender_address: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">CNPJ Dest.</Label>
                          <Input
                            size={1}
                            value={editingSchedule.dest_cnpj}
                            onChange={(e) =>
                              setEditingSchedule({ ...editingSchedule, dest_cnpj: e.target.value })
                            }
                            className="h-8"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">End. Destino</Label>
                          <Input
                            size={1}
                            value={editingSchedule.dest_address}
                            onChange={(e) =>
                              setEditingSchedule({
                                ...editingSchedule,
                                dest_address: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={saveScheduleEdit}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Aplicar Alterações
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={handleCreateRoute}
                    className="w-full bg-primary font-bold h-12 text-lg"
                  >
                    Salvar Rota Otimizada
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7">
            <MapViewer
              waypoints={waypoints}
              routeGenerated={waypoints.length > 0 && !!routeConfig.vehicle_id}
              selectedVehicle={routeConfig.vehicle_id}
              selectedDate={routeConfig.date}
              vehicleName={selectedVehicle?.plate}
            />
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Carga por Veículo (Hoje)</CardTitle>
                <CardDescription>
                  Volume de coletas alocadas por veículo na data atual
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartRecharts data={vehicleTodayStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip cursor={{ fill: 'transparent' }} />
                    <Bar
                      dataKey="coletas"
                      fill="#800020"
                      name="Coletas Hoje"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChartRecharts>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição Geral (Histórico)</CardTitle>
                <CardDescription>
                  Porcentagem de coletas totais atribuídas a cada veículo
                </CardDescription>
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {isSupervisor && (
            <Card className="border-purple-200 shadow-sm">
              <CardHeader className="bg-purple-50/50 border-b border-purple-100">
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <BarChart className="w-5 h-5" /> Performance por Funcionário (Supervisor Only)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChartRecharts data={employeeStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          dataKey="agendamentos"
                          fill="#3B82F6"
                          name="Agendamentos"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="cotacoes"
                          fill="#10B981"
                          name="Cotações"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChartRecharts>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      Registro de Feedback Operacional
                    </h4>
                    <p className="text-sm text-slate-500 mb-2">
                      Envie observações sobre a performance para o histórico do funcionário.
                    </p>
                    <div className="space-y-3">
                      <Select value={feedbackEmployee} onValueChange={setFeedbackEmployee}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Selecione o Funcionário" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeStats.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        className="bg-white"
                        placeholder="Digite o feedback, metas ou pontos de melhoria..."
                        rows={4}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        disabled={!feedbackEmployee || !feedbackText}
                        onClick={() => {
                          toast({ title: 'Feedback registrado no histórico com sucesso!' })
                          setFeedbackText('')
                          setFeedbackEmployee('')
                        }}
                      >
                        Registrar Avaliação
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isSupervisor && (
          <TabsContent value="config" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Console de Gerenciamento da Ferramenta</CardTitle>
                <CardDescription>
                  Gerencie regras de negócio, limites e funcionalidades disponíveis para os
                  funcionários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 border-b pb-2">
                      Regras de Preenchimento
                    </h4>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-sm text-slate-800">Dimensões Obrigatórias</p>
                        <p className="text-xs text-slate-500">Exigir volume em m³ no agendamento</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-sm text-slate-800">Valor da NF Obrigatório</p>
                        <p className="text-xs text-slate-500">Impedir salvar sem valor declarado</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 border-b pb-2">Permissões da Equipe</h4>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-sm text-slate-800">Bloquear Edição Pós-Rota</p>
                        <p className="text-xs text-slate-500">
                          Funcionários não podem alterar peso após alocação
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-sm text-slate-800">Aprovação Automática</p>
                        <p className="text-xs text-slate-500">
                          Rotas abaixo de 5000kg não requerem revisão
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-primary text-white"
                    onClick={() => toast({ title: 'Configurações de roteirização atualizadas.' })}
                  >
                    Salvar Políticas Globais
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
