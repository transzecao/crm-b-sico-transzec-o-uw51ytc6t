import { useState, useMemo, useEffect } from 'react'
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
  ShieldAlert,
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
        10,
      ),
    )
  }

  const updateParam = (k: keyof typeof cfg.params, v: string) => {
    if (!canEditConfig)
      return toast.error('Acesso Negado. Apenas o Financeiro pode alterar matrizes.')
    const val = Math.max(0, parseFloat(v) || 0)
    setCfg((p) => ({ ...p, params: { ...p.params, [k]: val } }))
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
          id: Math.random().toString(),
          name: 'Nova Taxa',
          type: 'fixed',
          val: 0,
          active: true,
        })
      } else if (action === 'del') {
        return { ...p, gen: items.filter((i) => i.id !== id) }
      } else if (action === 'upd' && id && field) {
        const idx = items.findIndex((i) => i.id === id)
        if (idx > -1) {
          let updatedVal = val
          if (field === 'val') updatedVal = Math.max(0, Number(val) || 0)
          items[idx] = { ...items[idx], [field]: updatedVal }
        }
      }
      return { ...p, gen: items }
    })
  }

  const mem = useMemo(() => {
    const { params, sim, gen } = cfg
    const physicalWeight = Number(sim.weight) || 0
    const cubedWeight = (Number(sim.volume) || 0) * (Number(params.cubageFactor) || 0)
    const taxableWeight = sim.useCubing ? Math.max(physicalWeight, cubedWeight) : physicalWeight

    // Formula: Valor Final = (Frete Peso + Frete Valor + GRIS + Taxa de Despacho) * Peso Tarifavel
    // Following acceptance criteria literally.
    // Making Frete Peso unit (e.g., base + dist + valTon)
    const fretePesoUnit = params.baseTariff + sim.dist * params.valKm + params.valTon

    const calcUnitItem = (i: CfgItem) => {
      if (!i.active) return 0
      if (i.name === 'Pedágio' && !sim.usePedagio) return 0
      if (i.name.includes('TAS') && !sim.useTAS) return 0

      const v = Number(i.val) || 0
      if (i.type === 'fixed') return v
      if (i.type === 'pct') return sim.value * (v / 100) // Value over NF
      return 0
    }

    const genVals = gen.map((g) => ({ ...g, total: calcUnitItem(g) })).filter((g) => g.total > 0)
    const extraUnitSum = genVals.reduce((acc, g) => acc + g.total, 0)

    const finalUnitCost = fretePesoUnit + extraUnitSum
    const total = finalUnitCost * (taxableWeight / 1000) // Adjusting to Ton to make practical sense

    return {
      physicalWeight,
      cubedWeight,
      taxableWeight,
      fretePesoUnit,
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
            Motor de Cálculo de Frete
          </h1>
          <p className="text-emerald-700/80 mt-1 font-medium text-sm">
            Cálculo baseado em Peso Tarifável.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (!canEditConfig) return toast.error('Permissão negada.')
              logAction('Salvou Nova Matriz de Configuração')
              toast.success('Configuração Salva!')
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Configuração
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-emerald-100/50 bg-white/70">
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Route className="w-5 h-5 text-emerald-600" /> Simulador de Carga (Visão Comercial)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
                    Cluster / Região
                  </Label>
                  <Select value={cfg.sim.clusterId} onValueChange={handleClusterChange}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Rota Manual</SelectItem>
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
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
                    Distância (KM)
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
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
                    Valor NF (R$)
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
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
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
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
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
              <div className="flex gap-6 mt-6 pt-4 border-t border-emerald-100">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={cfg.sim.useCubing}
                    onCheckedChange={(v) => updateSim('useCubing', v)}
                  />
                  <Label className="text-sm font-bold text-emerald-800">Ativar Cubagem</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={cfg.sim.usePedagio}
                    onCheckedChange={(v) => updateSim('usePedagio', v)}
                  />
                  <Label className="text-sm font-bold text-emerald-800">Incidir Pedágio</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`shadow-sm border-emerald-100/50 bg-white/70 ${!canEditConfig ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Settings2 className="w-5 h-5 text-emerald-600" /> Matriz de Custo Fixo (Apenas
                Financeiro)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {[
                { l: 'Tarifa Base (R$)', k: 'baseTariff' },
                { l: 'R$ / Tonelada', k: 'valTon' },
                { l: 'R$ / KM', k: 'valKm' },
                { l: 'Fator Cubagem (kg/m³)', k: 'cubageFactor' },
              ].map((f) => (
                <div key={f.k} className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase text-emerald-700">
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
                <ListTodo className="w-5 h-5 text-emerald-600" /> Taxas Adicionais (Apenas
                Financeiro)
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleItem('add')}
                className="border-emerald-200"
              >
                <Plus className="w-4 h-4 mr-2" /> Nova Taxa
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {cfg.gen.map((i) => (
                <div
                  key={i.id}
                  className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-lg border bg-white/80 border-emerald-100 shadow-sm"
                >
                  <Switch
                    checked={i.active}
                    onCheckedChange={(c) => handleItem('upd', i.id, 'active', c)}
                  />
                  <Input
                    className="min-w-[200px] flex-1 font-medium bg-emerald-50/50"
                    value={i.name}
                    onChange={(e) => handleItem('upd', i.id, 'name', e.target.value)}
                  />
                  <Select value={i.type} onValueChange={(v) => handleItem('upd', i.id, 'type', v)}>
                    <SelectTrigger className="w-[180px] bg-emerald-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixo Unitário (R$)</SelectItem>
                      <SelectItem value="pct">% da NF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    className="w-24 bg-emerald-50/50"
                    value={i.val}
                    onChange={(e) => handleItem('upd', i.id, 'val', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleItem('del', i.id)}
                    className="text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
          <Card className="border-emerald-200 shadow-xl bg-white/90 overflow-hidden">
            <div className="bg-emerald-800 text-white p-4 flex items-center gap-3">
              <Calculator className="w-6 h-6" />
              <h3 className="font-bold text-lg">Demonstrativo de Cálculo</h3>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Peso Real</span>
                  <span>{mem.physicalWeight} kg</span>
                </div>
                {cfg.sim.useCubing && (
                  <div className="flex justify-between">
                    <span>Peso Cubado</span>
                    <span>{mem.cubedWeight.toFixed(2)} kg</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200 shadow-inner">
                  <span>Peso Tarifável</span>
                  <span>{mem.taxableWeight.toFixed(2)} kg</span>
                </div>
              </div>

              <div className="h-px bg-emerald-100" />

              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between font-medium">
                  <span>Custo Base (Matriz)</span>
                  <span>{fmt(mem.fretePesoUnit)}</span>
                </div>
                {mem.genVals.map((g) => (
                  <div
                    key={g.id}
                    className="flex justify-between pl-2 border-l-2 border-emerald-300"
                  >
                    <span>{g.name}</span>
                    <span>{fmt(g.total)}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 italic text-center">
                Valor Final = (Base + Taxas) * (Peso Tarifável / 1000)
              </div>

              <div className="bg-emerald-50 p-4 border-t border-emerald-200 rounded-b-lg mt-4">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                  Valor Final Sugerido
                </span>
                <span className="text-3xl font-black text-emerald-700">{fmt(mem.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <History className="w-4 h-4" /> Log de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[200px] overflow-y-auto p-4 space-y-3">
                {auditLogs.map((log, i) => (
                  <div key={i} className="text-xs border-l-2 border-indigo-200 pl-2">
                    <span className="text-slate-400 block">
                      {new Date(log.date).toLocaleString('pt-BR')}
                    </span>
                    <span className="font-semibold text-slate-700">{log.user}</span>:{' '}
                    <span className="text-slate-600">{log.action}</span>
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
