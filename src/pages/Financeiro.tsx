import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Truck,
  Calculator,
  Plus,
  Trash2,
  Save,
  History,
  Settings2,
  ListTodo,
  Route,
  MapPin,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore from '@/stores/useCrmStore'

type ItemType = 'fixed' | 'pct'
type CfgItem = {
  id: string
  name: string
  type: ItemType
  val: number
  active: boolean
}

type Cluster = {
  id: string
  name: string
  avgKm: number
  active: boolean
}

const defaultClusters: Cluster[] = [
  { id: 'c1', name: 'Campinas e Região', avgKm: 50, active: true },
  { id: 'c2', name: 'Grande SP', avgKm: 120, active: true },
  { id: 'c3', name: 'Vale do Paraíba', avgKm: 180, active: true },
  { id: 'c4', name: 'Sul de Minas', avgKm: 350, active: false },
]

const defaultGen: CfgItem[] = [
  { id: 'g1', name: 'GRIS', type: 'pct', val: 0.3, active: true },
  { id: 'g2', name: 'Taxa de Despacho', type: 'fixed', val: 66.08, active: true },
  { id: 'g3', name: 'Pedágio', type: 'fixed', val: 35.0, active: true },
  { id: 'g5', name: 'Frete Valor', type: 'pct', val: 0.5, active: true },
  { id: 'g6', name: 'TAS (Taxa Adm)', type: 'fixed', val: 15.0, active: true },
]

export default function Financeiro() {
  const { state } = useCrmStore()
  const canEditConfig = ['Financeiro', 'Master'].includes(state.role)

  const [cfg, setCfg] = useState({
    params: {
      baseTariff: 150.0,
      valTon: 85.0,
      valKm: 4.5,
      cubageFactor: 300.0,
    },
    sim: {
      weight: 1250,
      volume: 4.5,
      useCubing: true,
      usePedagio: true,
      useTAS: true,
      clusterId: '',
      dist: 120,
      value: 45000,
    },
    clusters: defaultClusters,
    gen: defaultGen,
  })

  const [auditLogs, setAuditLogs] = useState([
    { date: new Date().toISOString(), user: 'Sistema', action: 'Configuração Inicial Carregada' },
  ])

  const logAction = (action: string) => {
    setAuditLogs((prev) =>
      [{ date: new Date().toISOString(), user: state.currentUser.name, action }, ...prev].slice(
        0,
        15,
      ),
    )
  }

  const updateParam = (k: keyof typeof cfg.params, v: string) => {
    if (!canEditConfig) return toast.error('Acesso Negado.')
    const val = Math.max(0, parseFloat(v) || 0)
    setCfg((p) => ({ ...p, params: { ...p.params, [k]: val } }))
    logAction(`Alterou parâmetro base ${k} para ${val}`)
  }

  const updateSim = (k: keyof typeof cfg.sim, v: string | number | boolean) => {
    let val = v
    if (typeof v === 'number' && k !== 'dist' && k !== 'clusterId') {
      val = Math.max(0, v || 0)
    }
    setCfg((p) => ({ ...p, sim: { ...p.sim, [k]: val } }))
  }

  const handleClusterChange = (id: string) => {
    const cluster = cfg.clusters.find((c) => c.id === id)
    setCfg((p) => ({
      ...p,
      sim: { ...p.sim, clusterId: id, dist: cluster?.avgKm || p.sim.dist },
    }))
  }

  const updateCluster = (id: string, field: keyof Cluster, val: any) => {
    if (!canEditConfig) return toast.error('Acesso Negado.')
    setCfg((p) => {
      const newClusters = p.clusters.map((c) =>
        c.id === id
          ? { ...c, [field]: field === 'avgKm' ? Math.max(0, Number(val) || 0) : val }
          : c,
      )
      return { ...p, clusters: newClusters }
    })
    logAction(`Atualizou cluster ${id} (${field})`)
  }

  const addCluster = () => {
    if (!canEditConfig) return toast.error('Acesso Negado.')
    const newCluster = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Cluster',
      avgKm: 100,
      active: true,
    }
    setCfg((p) => ({ ...p, clusters: [...p.clusters, newCluster] }))
    logAction(`Adicionou novo cluster geográfico`)
  }

  const removeCluster = (id: string) => {
    if (!canEditConfig) return toast.error('Acesso Negado.')
    setCfg((p) => ({ ...p, clusters: p.clusters.filter((c) => c.id !== id) }))
    logAction(`Removeu cluster geográfico`)
  }

  const handleItem = (
    action: 'add' | 'del' | 'upd',
    id?: string,
    field?: keyof CfgItem,
    val?: any,
  ) => {
    if (!canEditConfig) return toast.error('Acesso Negado. Apenas o Financeiro pode editar taxas.')
    setCfg((p) => {
      const items = [...p.gen]
      if (action === 'add') {
        items.push({
          id: Math.random().toString(36).substr(2, 9),
          name: 'Nova Taxa',
          type: 'fixed',
          val: 0,
          active: true,
        })
        logAction('Adicionou nova taxa extra')
      } else if (action === 'del') {
        logAction('Removeu taxa extra')
        return { ...p, gen: items.filter((i) => i.id !== id) }
      } else if (action === 'upd' && id && field) {
        const idx = items.findIndex((i) => i.id === id)
        if (idx > -1) {
          let updatedVal = val
          if (field === 'val') updatedVal = Math.max(0, Number(val) || 0)
          items[idx] = { ...items[idx], [field]: updatedVal }
        }
        logAction(`Atualizou taxa extra ${items[idx].name}`)
      }
      return { ...p, gen: items }
    })
  }

  const mem = useMemo(() => {
    const { params, sim, gen } = cfg
    const physicalWeight = Number(sim.weight) || 0
    const cubedWeight = (Number(sim.volume) || 0) * (Number(params.cubageFactor) || 0)
    const taxableWeight = sim.useCubing ? Math.max(physicalWeight, cubedWeight) : physicalWeight

    // Frete Peso (Base + Distância + Valor Tonelada)
    const fretePesoTotal =
      params.baseTariff + sim.dist * params.valKm + params.valTon * (taxableWeight / 1000)

    const calcItemTotal = (i: CfgItem) => {
      if (!i.active) return 0
      if (i.name === 'Pedágio' && !sim.usePedagio) return 0
      if (i.name.includes('TAS') && !sim.useTAS) return 0

      const v = Number(i.val) || 0
      if (i.type === 'fixed') return v
      if (i.type === 'pct') return sim.value * (v / 100)
      return 0
    }

    const genVals = gen.map((g) => ({ ...g, total: calcItemTotal(g) })).filter((g) => g.total > 0)
    const extraTotalSum = genVals.reduce((acc, g) => acc + g.total, 0)

    // Formula literal: (Frete Peso + Frete Valor% + GRIS% + Taxa de Despacho) based on NF or Fixes
    const total = fretePesoTotal + extraTotalSum

    return {
      physicalWeight,
      cubedWeight,
      taxableWeight,
      fretePesoTotal,
      genVals,
      total,
    }
  }, [cfg])

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)
  const inputClass = 'bg-white/80 border-emerald-200/50 focus-visible:ring-emerald-500/50 shadow-sm'

  return (
    <div className="space-y-6 bg-emerald-50/30 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-emerald-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-emerald-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950 flex items-center gap-3">
            <div className="bg-emerald-100/60 p-2 rounded-lg border border-emerald-200/50">
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
            Motor Financeiro e Precificação
          </h1>
          <p className="text-emerald-700/80 mt-1 font-medium text-sm">
            Simulador de Carga Baseado em Clusters e Peso Tarifável (Max entre Real e Cubado).
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (!canEditConfig) return toast.error('Permissão negada.')
              logAction('Salvou Nova Matriz de Configuração Geral')
              toast.success('Configuração Financeira Salva na Nuvem!')
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Parametrização Global
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-emerald-100/50 bg-white/70">
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Route className="w-5 h-5 text-emerald-600" /> Simulador de Carga (Visão
                Operacional)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Cluster / Rota Destino
                  </Label>
                  <Select value={cfg.sim.clusterId} onValueChange={handleClusterChange}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Rota Manual (Ad-hoc)</SelectItem>
                      {cfg.clusters
                        .filter((c) => c.active)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({c.avgKm}km)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Distância Padrão (KM)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={cfg.sim.dist}
                    onChange={(e) => updateSim('dist', e.target.value)}
                    disabled={!!cfg.sim.clusterId && cfg.sim.clusterId !== 'none'}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Valor NF da Carga (R$)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={cfg.sim.value}
                    onChange={(e) => updateSim('value', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Peso Real (KG)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={cfg.sim.weight}
                    onChange={(e) => updateSim('weight', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Volume Total (m³)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={cfg.sim.volume}
                    onChange={(e) => updateSim('volume', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-8 mt-6 pt-5 border-t border-emerald-100 bg-emerald-50/50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={cfg.sim.useCubing}
                    onCheckedChange={(v) => updateSim('useCubing', v)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Label
                    className="text-sm font-bold text-emerald-900 cursor-pointer"
                    onClick={() => updateSim('useCubing', !cfg.sim.useCubing)}
                  >
                    Ativar Cubagem (Peso Tarifável)
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={cfg.sim.usePedagio}
                    onCheckedChange={(v) => updateSim('usePedagio', v)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Label
                    className="text-sm font-bold text-emerald-900 cursor-pointer"
                    onClick={() => updateSim('usePedagio', !cfg.sim.usePedagio)}
                  >
                    Incidir Pedágio
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={cfg.sim.useTAS}
                    onCheckedChange={(v) => updateSim('useTAS', v)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Label
                    className="text-sm font-bold text-emerald-900 cursor-pointer"
                    onClick={() => updateSim('useTAS', !cfg.sim.useTAS)}
                  >
                    Aplicar TAS
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`shadow-sm border-emerald-100/50 bg-white/70 ${!canEditConfig ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <MapPin className="w-5 h-5 text-emerald-600" /> Clusters Geográficos
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addCluster}
                className="border-emerald-200"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Cluster
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {cfg.clusters.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap md:flex-nowrap items-center gap-4 p-3 rounded-lg border bg-white border-emerald-100 shadow-sm"
                >
                  <Switch
                    checked={c.active}
                    onCheckedChange={(v) => updateCluster(c.id, 'active', v)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Input
                    className="min-w-[200px] flex-1 font-bold text-emerald-950 bg-emerald-50/50 border-emerald-100 focus-visible:ring-emerald-500/50"
                    value={c.name}
                    onChange={(e) => updateCluster(c.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-md border border-emerald-100">
                    <Label className="text-[10px] font-bold uppercase text-emerald-700 whitespace-nowrap">
                      KM Médio:
                    </Label>
                    <Input
                      type="number"
                      className="w-20 h-7 text-xs bg-white"
                      value={c.avgKm}
                      onChange={(e) => updateCluster(c.id, 'avgKm', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCluster(c.id)}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card
            className={`shadow-sm border-emerald-100/50 bg-white/70 ${!canEditConfig ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Settings2 className="w-5 h-5 text-emerald-600" /> Matriz de Custos Padrão (Apenas
                Financeiro)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {[
                { l: 'Tarifa Base (R$)', k: 'baseTariff' },
                { l: 'R$ / Tonelada', k: 'valTon' },
                { l: 'R$ / KM Extra', k: 'valKm' },
                { l: 'Fator Cubagem (kg/m³)', k: 'cubageFactor' },
              ].map((f) => (
                <div key={f.k} className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {f.l}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={cfg.params[f.k as keyof typeof cfg.params]}
                    onChange={(e) => updateParam(f.k as keyof typeof cfg.params, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card
            className={`shadow-sm border-emerald-100/50 bg-white/70 ${!canEditConfig ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <ListTodo className="w-5 h-5 text-emerald-600" /> Taxas de Despacho, Advalorem e
                Outras
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleItem('add')}
                className="border-emerald-200"
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Taxa
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {cfg.gen.map((i) => (
                <div
                  key={i.id}
                  className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-lg border bg-white border-emerald-100 shadow-sm"
                >
                  <Switch
                    checked={i.active}
                    onCheckedChange={(c) => handleItem('upd', i.id, 'active', c)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <Input
                    className="min-w-[200px] flex-1 font-bold text-emerald-900 bg-emerald-50/50 border-emerald-100 focus-visible:ring-emerald-500/50"
                    value={i.name}
                    onChange={(e) => handleItem('upd', i.id, 'name', e.target.value)}
                  />
                  <Select value={i.type} onValueChange={(v) => handleItem('upd', i.id, 'type', v)}>
                    <SelectTrigger className="w-[180px] bg-emerald-50/50 border-emerald-100 text-emerald-900 font-medium focus:ring-emerald-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                      <SelectItem value="pct">% da Nota Fiscal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    className="w-24 bg-emerald-50/50 border-emerald-100 focus-visible:ring-emerald-500/50"
                    value={i.val}
                    onChange={(e) => handleItem('upd', i.id, 'val', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleItem('del', i.id)}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          <Card className="border-emerald-200 shadow-xl bg-white overflow-hidden ring-1 ring-emerald-900/5">
            <div className="bg-emerald-900 text-white p-5 flex items-center gap-3">
              <div className="bg-emerald-800 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">
                  Precificação Final
                </h3>
                <p className="text-emerald-300 text-xs font-medium">Demonstrativo Operacional</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-500">Peso Físico Declarado</span>
                  <span className="font-semibold">{mem.physicalWeight} kg</span>
                </div>
                {cfg.sim.useCubing && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Peso Cubado Estimado</span>
                    <span className="font-semibold">{mem.cubedWeight.toFixed(2)} kg</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-emerald-900 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 shadow-inner">
                  <span className="uppercase text-[11px] tracking-wider">
                    Peso Tarifável (Maior)
                  </span>
                  <span className="text-base">{mem.taxableWeight.toFixed(2)} kg</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent my-4" />

              <div className="space-y-2.5 text-sm text-slate-800">
                <div className="flex justify-between items-center font-bold text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">
                  <span>Frete Peso Base</span>
                  <span>{fmt(mem.fretePesoTotal)}</span>
                </div>
                {mem.genVals.map((g) => (
                  <div
                    key={g.id}
                    className="flex justify-between items-center pl-3 border-l-2 border-emerald-400 py-1"
                  >
                    <span className="text-slate-600 font-medium">
                      {g.name} {g.type === 'pct' ? `(${g.val}%)` : ''}
                    </span>
                    <span className="font-semibold text-slate-800">{fmt(g.total)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 p-5 border border-emerald-200 rounded-xl mt-6 shadow-sm">
                <span className="text-[11px] font-black text-emerald-800/80 uppercase tracking-widest block mb-1">
                  Valor Final Sugerido
                </span>
                <span className="text-4xl font-black text-emerald-700 tracking-tight">
                  {fmt(mem.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
                <History className="w-4 h-4 text-slate-500" /> Log de Auditoria do Motor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[250px] overflow-y-auto p-5 space-y-4">
                {auditLogs.map((log, i) => (
                  <div
                    key={i}
                    className="text-xs border-l-[3px] border-emerald-300 pl-3 relative group hover:bg-slate-50 p-1.5 rounded-r-md transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">
                      {new Date(log.date).toLocaleString('pt-BR')}
                    </span>
                    <span className="font-bold text-emerald-900">{log.user}</span>{' '}
                    <span className="text-slate-600 font-medium leading-tight">{log.action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
