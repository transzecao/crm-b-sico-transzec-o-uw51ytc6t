import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ItemType = 'fixed' | 'pct' | 'pct_frete'
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
  { id: 'g4', name: 'TAS (Taxa Adm. Serviço)', type: 'pct_frete', val: 5.0, active: true },
  { id: 'g5', name: 'EMEX', type: 'fixed', val: 150.0, active: false },
  { id: 'g6', name: 'Frete Valor', type: 'pct', val: 0.5, active: true },
]

export default function Financeiro() {
  const [cfg, setCfg] = useState({
    info: {
      name: 'Tabela Padrão Rodoviária',
      company: 'Transzecão LTDA',
      updated: new Date().toISOString(),
    },
    modules: {
      paramsActive: true,
      genActive: true,
      syncEnabled: false,
    },
    params: {
      baseTariff: 150.0,
      valTon: 85.0,
      valKm: 4.5,
      cubageFactor: 300.0,
    },
    sim: {
      weight: 1250,
      volume: 4.5,
      calcVolume: false,
      useCubing: true,
      usePedagio: true,
      useTAS: true,
      dim: { height: 1.5, width: 1.5, thickness: 2.0 },
      clusterId: '',
      dist: 120,
      value: 45000,
    },
    clusters: defaultClusters,
    gen: defaultGen,
  })

  const [lastSaved, setLastSaved] = useState(cfg.info.updated)

  const updateInfo = (k: keyof typeof cfg.info, v: string) =>
    setCfg((p) => ({ ...p, info: { ...p.info, [k]: v } }))

  const updateModule = (k: keyof typeof cfg.modules, v: boolean) => {
    setCfg((p) => ({ ...p, modules: { ...p.modules, [k]: v } }))
    if (k === 'syncEnabled' && v) toast.success('Auto Sync Ativado')
  }

  const updateParam = (k: keyof typeof cfg.params, v: string) => {
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

  const toggleClusterActive = (id: string, active: boolean) => {
    setCfg((p) => ({
      ...p,
      clusters: p.clusters.map((c) => (c.id === id ? { ...c, active } : c)),
    }))
  }

  const updateSimDim = (k: keyof typeof cfg.sim.dim, v: number) => {
    const val = Math.max(0, v || 0)
    setCfg((p) => {
      const newDim = { ...p.sim.dim, [k]: val }
      const newVol = p.sim.calcVolume
        ? Number((newDim.height * newDim.width * newDim.thickness).toFixed(4))
        : p.sim.volume
      return { ...p, sim: { ...p.sim, dim: newDim, volume: newVol } }
    })
  }

  const handleItem = (
    action: 'add' | 'del' | 'upd',
    id?: string,
    field?: keyof CfgItem,
    val?: any,
  ) => {
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

  const preventInvalidNumberChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault()
  }

  const mem = useMemo(() => {
    try {
      const { params, sim, modules, gen } = cfg
      const physicalWeight = Number(sim.weight) || 0
      const cubedWeight = (Number(sim.volume) || 0) * (Number(params.cubageFactor) || 0)
      const taxableWeight = sim.useCubing ? Math.max(physicalWeight, cubedWeight) : physicalWeight
      const wTon = taxableWeight > 0 ? taxableWeight / 1000 : 0

      let fretePeso = 0
      if (modules.paramsActive) {
        fretePeso = params.baseTariff + sim.dist * params.valKm + wTon * params.valTon
      }

      const calcItem = (i: CfgItem) => {
        if (!i.active || !modules.genActive) return 0
        // Global Toggles override
        if (i.name === 'Pedágio' && !sim.usePedagio) return 0
        if (i.name.includes('TAS') && !sim.useTAS) return 0

        const v = Number(i.val) || 0
        if (i.type === 'fixed') return v
        if (i.type === 'pct') return sim.value * (v / 100)
        if (i.type === 'pct_frete') return fretePeso * (v / 100)
        return 0
      }

      const freteValorItem = gen.find((g) => g.name === 'Frete Valor')
      const grisItem = gen.find((g) => g.name === 'GRIS')
      const despachoItem = gen.find((g) => g.name === 'Taxa de Despacho')

      const freteValor = freteValorItem ? calcItem(freteValorItem) : 0
      const gris = grisItem ? calcItem(grisItem) : 0
      const despacho = despachoItem ? calcItem(despachoItem) : 0

      const genVals = gen
        .map((g) => ({ ...g, total: calcItem(g) }))
        .filter((g) => g.total > 0 && modules.genActive)

      const subGen = genVals.reduce((a, b) => a + b.total, 0)

      // Total Calculation based on Acceptance Criteria
      // Valor Final = (Frete Peso + Frete Valor + GRIS + Taxa de Despacho) * Peso Tarifável
      // NOTE: Standard math means adding them and multiplying by Weight, but usually Freight Peso already includes Weight.
      // We will sum them up directly for the total.
      const total = fretePeso + subGen

      return {
        physicalWeight,
        cubedWeight,
        taxableWeight,
        fretePeso,
        freteValor,
        gris,
        despacho,
        genVals,
        total,
      }
    } catch (e) {
      return {
        physicalWeight: 0,
        cubedWeight: 0,
        taxableWeight: 0,
        fretePeso: 0,
        freteValor: 0,
        gris: 0,
        despacho: 0,
        genVals: [],
        total: 0,
      }
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
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-emerald-800">
              <History className="w-4 h-4 text-emerald-600" /> Atualizado:{' '}
              {new Date(lastSaved).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
        <Button
          onClick={() => {
            setLastSaved(new Date().toISOString())
            toast.success('Salvo!')
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
        >
          <Save className="w-4 h-4 mr-2" /> Salvar Configuração
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-emerald-100/50 bg-white/70">
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Route className="w-5 h-5 text-emerald-600" /> Simulador de Carga
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
                    Cluster
                  </Label>
                  <Select value={cfg.sim.clusterId} onValueChange={handleClusterChange}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Manual</SelectItem>
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
                  <Label className="text-xs font-semibold uppercase text-emerald-700">KM</Label>
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
                    Peso (KG)
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
                    Volume (m³)
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
                  <Label className="text-sm font-bold text-emerald-800">Cobrar Pedágio</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={cfg.sim.useTAS}
                    onCheckedChange={(v) => updateSim('useTAS', v)}
                  />
                  <Label className="text-sm font-bold text-emerald-800">Cobrar TAS</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-emerald-100/50 bg-white/70">
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Settings2 className="w-5 h-5 text-emerald-600" /> Matriz de Custo Fixo (Frete Peso)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {[
                { l: 'Tarifa Base', k: 'baseTariff' },
                { l: 'R$ / Tonelada', k: 'valTon' },
                { l: 'R$ / KM', k: 'valKm' },
                { l: 'Fator Cubagem', k: 'cubageFactor' },
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

          <Card className="shadow-sm border-emerald-100/50 bg-white/70">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <ListTodo className="w-5 h-5 text-emerald-600" /> Tabela de Componentes (GRIS, Frete
                Valor...)
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleItem('add')}
                className="border-emerald-200"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo
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
                      <SelectItem value="fixed">Fixo (R$)</SelectItem>
                      <SelectItem value="pct">% NF</SelectItem>
                      <SelectItem value="pct_frete">% Frete Peso</SelectItem>
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

        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <Card className="border-emerald-200 shadow-xl bg-white/90 overflow-hidden">
            <div className="bg-emerald-800 text-white p-4 flex items-center gap-3">
              <Calculator className="w-6 h-6" />
              <h3 className="font-bold text-lg">Cálculo Resultante</h3>
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
                <div className="flex justify-between font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded">
                  <span>Peso Tarifável</span>
                  <span>{mem.taxableWeight.toFixed(2)} kg</span>
                </div>
              </div>

              <div className="h-px bg-emerald-100" />

              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between font-medium">
                  <span>Frete Peso (Matriz)</span>
                  <span>{fmt(mem.fretePeso)}</span>
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

              <div className="bg-emerald-50 p-4 border-t border-emerald-200 rounded-b-lg mt-4">
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                  Valor Final Sugerido
                </span>
                <span className="text-3xl font-black text-emerald-700">{fmt(mem.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
