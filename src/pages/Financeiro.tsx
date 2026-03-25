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
  FileSpreadsheet,
  History,
  Settings2,
  ListTodo,
  Blocks,
  Route,
  MapPin,
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
}

const defaultClusters: Cluster[] = [
  { id: 'c1', name: 'Campinas e Região', avgKm: 50 },
  { id: 'c2', name: 'Grande SP', avgKm: 120 },
  { id: 'c3', name: 'Vale do Paraíba', avgKm: 180 },
  { id: 'c4', name: 'Sul de Minas', avgKm: 350 },
]

const defaultGen: CfgItem[] = [
  { id: 'g1', name: 'GRIS', type: 'pct', val: 0.3, active: true },
  { id: 'g2', name: 'Taxa de Despacho', type: 'fixed', val: 66.08, active: true },
  { id: 'g3', name: 'Pedágio', type: 'fixed', val: 35.0, active: true },
  { id: 'g4', name: 'TAS (Taxa Adm. Serviço)', type: 'pct_frete', val: 5.0, active: false },
  { id: 'g5', name: 'EMEX', type: 'fixed', val: 150.0, active: false },
  { id: 'g6', name: 'TDA/TFD', type: 'fixed', val: 100.0, active: false },
  { id: 'g7', name: 'TRF', type: 'fixed', val: 80.0, active: false },
]

const defaultSrv: CfgItem[] = [
  { id: 's1', name: 'Paletização', type: 'fixed', val: 45.0, active: false },
  { id: 's2', name: 'Agendamento', type: 'fixed', val: 120.0, active: false },
  { id: 's3', name: 'Devolução de Recebimento', type: 'fixed', val: 80.0, active: false },
  { id: 's4', name: 'Reentrega', type: 'pct_frete', val: 50.0, active: false },
]

export default function Financeiro() {
  const [cfg, setCfg] = useState({
    info: {
      name: 'Tabela Padrão Rodoviária',
      modal: 'Transporte Rodoviário',
      company: 'Transzecão LTDA',
      version: '2.0.0',
      responsible: 'Admin Financeiro',
      updated: new Date().toISOString(),
    },
    modules: {
      paramsActive: true,
      genActive: true,
      srvActive: true,
    },
    params: {
      baseTariff: 150.0,
      valTon: 85.0,
      valKm: 4.5,
      cubageFactor: 300.0,
      freteValorPct: 0.5,
      correcao: 1.0,
      marginPct: 15.0,
      taxPct: 14.25,
    },
    sim: {
      weight: 1250,
      volume: 4.5,
      calcVolume: false,
      useCubing: true,
      dim: {
        height: 1.5,
        width: 1.5,
        thickness: 2.0,
      },
      clusterId: '',
      dist: 120,
      value: 45000,
      origin: 'São Paulo, SP',
      destination: 'Campinas, SP',
      operationType: 'Carga Fracionada (LTL)',
      cargoType: 'Eletrônicos',
      sla: 'Expresso (2 dias)',
      frequency: 'Diário',
    },
    clusters: defaultClusters,
    gen: defaultGen,
    srv: defaultSrv,
  })

  const [lastSaved, setLastSaved] = useState(cfg.info.updated)

  const updateInfo = (k: keyof typeof cfg.info, v: string) =>
    setCfg((p) => ({ ...p, info: { ...p.info, [k]: v } }))
  const updateModule = (k: keyof typeof cfg.modules, v: boolean) =>
    setCfg((p) => ({ ...p, modules: { ...p.modules, [k]: v } }))
  const updateParam = (k: keyof typeof cfg.params, v: string) =>
    setCfg((p) => ({ ...p, params: { ...p.params, [k]: Number(v) } }))
  const updateSim = (k: keyof typeof cfg.sim, v: string | number | boolean) =>
    setCfg((p) => ({ ...p, sim: { ...p.sim, [k]: v } }))

  const handleClusterChange = (id: string) => {
    const cluster = cfg.clusters.find((c) => c.id === id)
    if (cluster) {
      setCfg((p) => ({
        ...p,
        sim: { ...p.sim, clusterId: id, dist: cluster.avgKm, destination: cluster.name },
      }))
    } else {
      updateSim('clusterId', '')
    }
  }

  const updateSimDim = (k: keyof typeof cfg.sim.dim, v: number) => {
    setCfg((p) => {
      const newDim = { ...p.sim.dim, [k]: v }
      const newVol = p.sim.calcVolume
        ? Number((newDim.height * newDim.width * newDim.thickness).toFixed(4))
        : p.sim.volume
      return {
        ...p,
        sim: { ...p.sim, dim: newDim, volume: newVol },
      }
    })
  }

  const toggleCalcVolume = (checked: boolean) => {
    setCfg((p) => {
      const newVol = checked
        ? Number((p.sim.dim.height * p.sim.dim.width * p.sim.dim.thickness).toFixed(4))
        : p.sim.volume
      return {
        ...p,
        sim: { ...p.sim, calcVolume: checked, volume: newVol },
      }
    })
  }

  const handleItem = (
    list: 'gen' | 'srv',
    action: 'add' | 'del' | 'upd',
    id?: string,
    field?: keyof CfgItem,
    val?: any,
  ) => {
    setCfg((p) => {
      const items = [...p[list]]
      if (action === 'add')
        items.push({
          id: Math.random().toString(),
          name: 'Novo Item',
          type: 'fixed',
          val: 0,
          active: true,
        })
      else if (action === 'del') return { ...p, [list]: items.filter((i) => i.id !== id) }
      else if (action === 'upd') {
        const idx = items.findIndex((i) => i.id === id)
        if (idx > -1 && field) items[idx] = { ...items[idx], [field]: val }
      }
      return { ...p, [list]: items }
    })
  }

  const handleSave = () => {
    const now = new Date().toISOString()
    updateInfo('updated', now)
    setLastSaved(now)
    toast.success('Planilha salva com sucesso', {
      description: 'Memória de cálculo atualizada e versão registrada.',
    })
  }

  const mem = useMemo(() => {
    const { params, sim, modules, gen, srv } = cfg

    const physicalWeight = sim.weight
    const cubedWeight = sim.volume * params.cubageFactor
    const taxableWeight = sim.useCubing ? Math.max(physicalWeight, cubedWeight) : physicalWeight
    const wTon = taxableWeight / 1000

    let baseFreight = 0
    let cBase = 0
    let freteValor = 0

    if (modules.paramsActive) {
      baseFreight = params.baseTariff + sim.dist * params.valKm + wTon * params.valTon
      cBase = baseFreight * params.correcao
      freteValor = sim.value * (params.freteValorPct / 100)
    }

    const calcItem = (i: CfgItem, activeMod: boolean) => {
      if (!i.active || !activeMod) return 0
      if (i.type === 'fixed') return i.val
      if (i.type === 'pct') return sim.value * (i.val / 100)
      if (i.type === 'pct_frete') return cBase > 0 ? cBase * (i.val / 100) : 0
      return 0
    }

    const genVals = gen
      .map((g) => ({ ...g, total: calcItem(g, modules.genActive) }))
      .filter((g) => g.total > 0 && modules.genActive)
    const srvVals = srv
      .map((s) => ({ ...s, total: calcItem(s, modules.srvActive) }))
      .filter((s) => s.total > 0 && modules.srvActive)

    const subGen = genVals.reduce((a, b) => a + b.total, 0)
    const subSrv = srvVals.reduce((a, b) => a + b.total, 0)

    const sub1 = (modules.paramsActive ? cBase + freteValor : 0) + subGen + subSrv
    const margin = modules.paramsActive ? sub1 * (params.marginPct / 100) : 0
    const sub2 = sub1 + margin
    const tax = modules.paramsActive ? sub2 * (params.taxPct / 100) : 0
    const total = sub2 + tax

    return {
      physicalWeight,
      cubedWeight,
      taxableWeight,
      baseFreight,
      cBase,
      freteValor,
      genVals,
      srvVals,
      subGen,
      subSrv,
      sub1,
      margin,
      sub2,
      tax,
      total,
    }
  }, [cfg])

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  const inputClass =
    'bg-white/80 border-emerald-200/50 focus-visible:ring-emerald-500/50 transition-colors shadow-sm'
  const editHighlight = 'border-emerald-200/80 bg-emerald-50/50 focus-visible:ring-emerald-500/50'

  const renderList = (
    list: 'gen' | 'srv',
    title: string,
    icon: React.ReactNode,
    activeKey: keyof typeof cfg.modules,
    showAdd: boolean,
    headerBg: string,
  ) => (
    <Card
      className={cn(
        'shadow-sm border-emerald-100/50 transition-opacity bg-white/70 backdrop-blur-md',
        !cfg.modules[activeKey] && 'opacity-75',
      )}
    >
      <CardHeader
        className={cn(
          'flex flex-row items-center justify-between pb-4 border-b border-emerald-100/50',
          headerBg,
        )}
      >
        <div className="flex items-center gap-2 text-emerald-900">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-emerald-800">Módulo</Label>
            <Switch
              className="data-[state=checked]:bg-emerald-600"
              checked={cfg.modules[activeKey]}
              onCheckedChange={(c) => updateModule(activeKey, c)}
            />
          </div>
          {showAdd && (
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-200/80 text-emerald-700 bg-white/50 hover:bg-emerald-100 hover:text-emerald-800 backdrop-blur-sm"
              onClick={() => handleItem(list, 'add')}
              disabled={!cfg.modules[activeKey]}
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {cfg[list].map((i) => (
          <div
            key={i.id}
            className={cn(
              'flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-lg border transition-all',
              i.active && cfg.modules[activeKey]
                ? 'bg-white/80 border-emerald-100/80 shadow-sm backdrop-blur-sm'
                : 'bg-emerald-50/20 border-dashed border-emerald-200/50 opacity-70',
            )}
          >
            <Switch
              className="data-[state=checked]:bg-emerald-600"
              checked={i.active}
              onCheckedChange={(c) => handleItem(list, 'upd', i.id, 'active', c)}
              disabled={!cfg.modules[activeKey]}
            />
            <Input
              className={cn('min-w-[200px] flex-1 font-medium bg-white/50', editHighlight)}
              value={i.name}
              onChange={(e) => handleItem(list, 'upd', i.id, 'name', e.target.value)}
              disabled={!cfg.modules[activeKey]}
            />
            <Select
              value={i.type}
              onValueChange={(v) => handleItem(list, 'upd', i.id, 'type', v)}
              disabled={!cfg.modules[activeKey]}
            >
              <SelectTrigger className={cn('w-[180px] bg-white/50', editHighlight)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                <SelectItem value="pct">% sobre NF</SelectItem>
                <SelectItem value="pct_frete">% sobre Frete Base</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {i.type === 'fixed' ? 'R$' : '%'}
              </span>
              <Input
                type="number"
                step={i.type === 'fixed' ? '1' : '0.01'}
                className={cn('w-32 pl-8 bg-white/50', editHighlight)}
                value={i.val}
                onChange={(e) => handleItem(list, 'upd', i.id, 'val', Number(e.target.value))}
                disabled={!cfg.modules[activeKey]}
              />
            </div>
            {showAdd && (
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-500 hover:bg-rose-50/80 hover:text-rose-600"
                onClick={() => handleItem(list, 'del', i.id)}
                disabled={!cfg.modules[activeKey]}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 bg-emerald-50/30 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-emerald-200/50 max-w-[1600px] mx-auto pb-12">
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
            <span className="flex items-center gap-1.5 bg-emerald-50/80 text-emerald-800 px-2 py-1 rounded-md border border-emerald-100/50">
              <strong className="text-emerald-700">Empresa:</strong> {cfg.info.company}
            </span>
          </div>
        </div>
        <Button
          onClick={handleSave}
          size="lg"
          className="gap-2 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95"
        >
          <Save className="w-5 h-5" /> Salvar Versão
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-emerald-100/50 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                <Route className="w-5 h-5 text-emerald-600" /> Variáveis de Simulação (Inputs)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold uppercase text-emerald-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Cluster / Destino
                  </Label>
                  <Select value={cfg.sim.clusterId} onValueChange={handleClusterChange}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Selecione um Cluster (Opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-muted-foreground italic">
                        Personalizado (Preenchimento Manual)
                      </SelectItem>
                      {cfg.clusters.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} (Méd. {c.avgKm}km)
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
                    value={cfg.sim.dist}
                    onChange={(e) => updateSim('dist', Number(e.target.value))}
                    className={inputClass}
                    disabled={!!cfg.sim.clusterId && cfg.sim.clusterId !== 'none'}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-emerald-700">
                    Valor Mercadoria (R$)
                  </Label>
                  <Input
                    type="number"
                    value={cfg.sim.value}
                    onChange={(e) => updateSim('value', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2 md:col-span-2 border border-emerald-200/60 bg-emerald-50/40 rounded-lg p-4 backdrop-blur-sm relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Switch
                      id="use-cubing"
                      checked={cfg.sim.useCubing}
                      onCheckedChange={(v) => updateSim('useCubing', v)}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                    <Label
                      htmlFor="use-cubing"
                      className="text-[10px] uppercase font-bold text-emerald-800"
                    >
                      Cubagem Ativa
                    </Label>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-xs font-semibold uppercase text-emerald-800">
                      Volume (m³)
                    </Label>
                    <div className="flex items-center gap-2 bg-white/80 px-2 py-1 rounded shadow-sm border border-emerald-100 mt-6 mr-36">
                      <Switch
                        id="calc-vol"
                        className="data-[state=checked]:bg-emerald-600"
                        checked={cfg.sim.calcVolume}
                        onCheckedChange={toggleCalcVolume}
                      />
                      <Label
                        htmlFor="calc-vol"
                        className="text-[10px] uppercase font-bold text-emerald-700 cursor-pointer"
                      >
                        Por Dimensões
                      </Label>
                    </div>
                  </div>

                  {cfg.sim.calcVolume ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-emerald-600">
                          Altura (m)
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={cfg.sim.dim.height}
                          onChange={(e) => updateSimDim('height', Number(e.target.value))}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-emerald-600">
                          Largura (m)
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={cfg.sim.dim.width}
                          onChange={(e) => updateSimDim('width', Number(e.target.value))}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-emerald-600">
                          Comprim. (m)
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={cfg.sim.dim.thickness}
                          onChange={(e) => updateSimDim('thickness', Number(e.target.value))}
                          className={inputClass}
                        />
                      </div>
                      <div className="col-span-3 pt-2">
                        <div className="flex justify-between items-center text-sm px-3 py-2 bg-emerald-100/50 rounded border border-emerald-200/80 text-emerald-800 font-medium">
                          <span className="font-bold">Total M³:</span>
                          <span className="font-bold">
                            {cfg.sim.volume.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}{' '}
                            m³
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 w-1/2 mt-10">
                      <Input
                        type="number"
                        step="0.01"
                        value={cfg.sim.volume}
                        onChange={(e) => updateSim('volume', Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-emerald-700">
                        Peso Bruto (KG)
                      </Label>
                      <Input
                        type="number"
                        value={cfg.sim.weight}
                        onChange={(e) => updateSim('weight', Number(e.target.value))}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-emerald-700">
                        Tipo de Carga
                      </Label>
                      <Input
                        value={cfg.sim.cargoType}
                        onChange={(e) => updateSim('cargoType', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-emerald-700">
                        Frequência
                      </Label>
                      <Input
                        value={cfg.sim.frequency}
                        onChange={(e) => updateSim('frequency', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-emerald-700">
                        SLA / Prazo
                      </Label>
                      <Input
                        value={cfg.sim.sla}
                        onChange={(e) => updateSim('sla', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'shadow-sm border-emerald-100/50 transition-opacity bg-white/70 backdrop-blur-sm',
              !cfg.modules.paramsActive && 'opacity-75',
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-emerald-100/50 bg-emerald-50/40">
              <div className="flex items-center gap-2 text-emerald-900">
                <Settings2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <CardTitle className="text-lg">Matriz de Custos Base</CardTitle>
                  <CardDescription className="text-xs mt-1 text-emerald-700/70">
                    Parâmetros para cálculo de Frete Peso (KM x Peso) e Frete Valor.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
              {[
                { l: 'Tarifa Fixa Base (R$)', k: 'baseTariff' },
                { l: 'Valor por Tonelada (R$)', k: 'valTon' },
                { l: 'Valor por KM (R$)', k: 'valKm' },
                { l: 'Fator Cubagem (kg/m³)', k: 'cubageFactor' },
                { l: 'Ad Valorem (%)', k: 'freteValorPct' },
                { l: 'Fator Correção', k: 'correcao' },
                { l: 'Margem Lucro (%)', k: 'marginPct' },
                { l: 'Tributos (ICMS/ISS %)', k: 'taxPct' },
              ].map((f) => (
                <div key={f.k} className="space-y-2">
                  <Label
                    className="text-[11px] font-semibold uppercase text-emerald-700 block truncate"
                    title={f.l}
                  >
                    {f.l}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cfg.params[f.k as keyof typeof cfg.params]}
                    onChange={(e) => updateParam(f.k as keyof typeof cfg.params, e.target.value)}
                    className={cn(editHighlight, 'bg-white/50')}
                    disabled={!cfg.modules.paramsActive}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {renderList(
            'gen',
            'Generalidades (Taxas e Pedágio)',
            <ListTodo className="w-5 h-5 text-emerald-600" />,
            'genActive',
            true,
            'bg-emerald-50/50',
          )}
          {renderList(
            'srv',
            'Serviços Adicionais',
            <Blocks className="w-5 h-5 text-emerald-600" />,
            'srvActive',
            true,
            'bg-emerald-50/30',
          )}
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
          <Card className="border-emerald-200/80 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-emerald-200" />
              <div>
                <h3 className="font-bold text-lg leading-tight text-emerald-50">
                  Simulador de Frete
                </h3>
                <p className="text-emerald-200/80 text-xs">Cálculo em tempo real (LTL)</p>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-5 space-y-4 text-sm font-mono tracking-tight">
                <div>
                  <div className="text-xs font-bold text-emerald-700/60 uppercase mb-2 flex items-center gap-2">
                    <div className="h-px bg-emerald-100 flex-1" />
                    Matemática de Peso
                    <div className="h-px bg-emerald-100 flex-1" />
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Peso Físico Real</span>
                      <span>{mem.physicalWeight.toLocaleString('pt-BR')} kg</span>
                    </div>
                    {cfg.sim.useCubing && (
                      <>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Peso Cubado ({cfg.params.cubageFactor} kg/m³)</span>
                          <span>
                            {mem.cubedWeight.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}{' '}
                            kg
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-1.5 rounded border border-emerald-100/50">
                      <span>Peso Considerado (Taxável)</span>
                      <span>
                        {mem.taxableWeight.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg
                      </span>
                    </div>

                    <div className="h-px bg-emerald-100/50 my-2" />

                    <div className="flex justify-between text-slate-700">
                      <span>Frete Peso (KM x Peso)</span>
                      <span>{fmt(mem.baseFreight)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Frete Valor / Ad Valorem ({cfg.params.freteValorPct}%)</span>
                      <span>{fmt(mem.freteValor)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-700/60 uppercase mb-2 flex items-center gap-2 mt-4">
                    <div className="h-px bg-emerald-100 flex-1" />
                    Generalidades e Taxas
                    <div className="h-px bg-emerald-100 flex-1" />
                  </div>
                  {cfg.modules.genActive && mem.genVals.length > 0 && (
                    <div className="space-y-1.5 text-slate-600">
                      {mem.genVals.map((g) => (
                        <div
                          key={g.id}
                          className="flex justify-between pl-2 border-l-2 border-emerald-300"
                        >
                          <span className="truncate pr-2">
                            {g.name} {g.type.startsWith('pct') && `(${g.val}%)`}
                          </span>
                          <span>{fmt(g.total)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium text-emerald-900 pt-1 border-t border-dashed border-emerald-200 mt-2">
                        <span>Subtotal Generalidades</span>
                        <span>{fmt(mem.subGen)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-700/60 uppercase mb-2 flex items-center gap-2 mt-4">
                    <div className="h-px bg-emerald-100 flex-1" />
                    Serviços Adicionais
                    <div className="h-px bg-emerald-100 flex-1" />
                  </div>
                  {cfg.modules.srvActive && mem.srvVals.length > 0 && (
                    <div className="space-y-1.5 text-slate-600">
                      {mem.srvVals.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between pl-2 border-l-2 border-emerald-300"
                        >
                          <span className="truncate pr-2">
                            {s.name} {s.type.startsWith('pct') && `(${s.val}%)`}
                          </span>
                          <span>{fmt(s.total)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium text-emerald-900 pt-1 border-t border-dashed border-emerald-200 mt-2">
                        <span>Subtotal Serviços</span>
                        <span>{fmt(mem.subSrv)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t-2 border-emerald-900/20">
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-emerald-950 bg-emerald-50 p-1.5 rounded">
                      <span>Subtotal Custos Base</span>
                      <span>{fmt(mem.sub1)}</span>
                    </div>

                    {cfg.modules.paramsActive && (
                      <>
                        <div className="flex justify-between text-slate-600 pl-4 border-l-2 border-emerald-200">
                          <span>Margem Operacional ({cfg.params.marginPct}%)</span>
                          <span>{fmt(mem.margin)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 pl-4 border-l-2 border-emerald-200">
                          <span>Tributos (ICMS/ISS {cfg.params.taxPct}%)</span>
                          <span>{fmt(mem.tax)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/80 p-5 border-t border-emerald-200/80 backdrop-blur-sm">
                <div className="flex justify-between items-end font-sans">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-emerald-800 block uppercase tracking-wider">
                      Valor Final
                    </span>
                    <span className="text-xs text-emerald-600 font-medium">
                      Frete Total Sugerido
                    </span>
                  </div>
                  <span className="text-3xl font-black text-emerald-700 tracking-tight drop-shadow-sm">
                    {fmt(mem.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
