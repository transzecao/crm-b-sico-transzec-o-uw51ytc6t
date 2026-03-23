import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Train,
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

type ItemType = 'fixed' | 'pct'
type CfgItem = {
  id: string
  name: string
  type: ItemType
  val: number
  active: boolean
}

const defaultGen: CfgItem[] = [
  { id: 'g1', name: 'Manobra especial', type: 'fixed', val: 850, active: true },
  { id: 'g2', name: 'Permanência em pátio', type: 'fixed', val: 1200, active: false },
  { id: 'g3', name: 'Espera de composição', type: 'fixed', val: 500, active: true },
  { id: 'g4', name: 'Necessidade de operação noturna', type: 'fixed', val: 300, active: false },
  { id: 'g5', name: 'Transbordo', type: 'fixed', val: 2000, active: false },
  { id: 'g6', name: 'Armazenagem temporária', type: 'fixed', val: 1500, active: false },
  { id: 'g7', name: 'Reprogramação', type: 'fixed', val: 400, active: false },
  { id: 'g8', name: 'Remarcação de janela operacional', type: 'fixed', val: 600, active: false },
]

export default function Financeiro() {
  const [cfg, setCfg] = useState({
    info: {
      name: 'Tabela Padrão Ferroviária',
      modal: 'Transporte Ferroviário',
      company: 'Transzecão LTDA',
      version: '1.2.0',
      responsible: 'Admin Financeiro',
      updated: new Date().toISOString(),
    },
    modules: {
      paramsActive: true,
      genActive: true,
      srvActive: true,
    },
    params: {
      baseTariff: 1200.0,
      valTon: 150.0,
      valKm: 12.5,
      freteValorPct: 0.5,
      grisPct: 0.3,
      despacho: 66.08,
      correcao: 1.05,
      marginPct: 15.0,
      taxPct: 14.25,
    },
    sim: {
      weight: 50000,
      volume: 120,
      dist: 1200,
      value: 500000,
      origin: 'Campinas, SP',
      destination: 'Rondonópolis, MT',
      operationType: 'Ponto a Ponto',
      cargoType: 'Granel Sólido',
      sla: 'Padrão (15 dias)',
      frequency: 'Semanal',
      condition: 'Normal',
    },
    gen: defaultGen,
    srv: [
      {
        id: 's1',
        name: 'Seguro Adicional de Carga',
        type: 'pct',
        val: 1.5,
        active: true,
      } as CfgItem,
    ],
  })

  const [lastSaved, setLastSaved] = useState(cfg.info.updated)

  const updateInfo = (k: keyof typeof cfg.info, v: string) =>
    setCfg((p) => ({ ...p, info: { ...p.info, [k]: v } }))
  const updateModule = (k: keyof typeof cfg.modules, v: boolean) =>
    setCfg((p) => ({ ...p, modules: { ...p.modules, [k]: v } }))
  const updateParam = (k: keyof typeof cfg.params, v: string) =>
    setCfg((p) => ({ ...p, params: { ...p.params, [k]: Number(v) } }))
  const updateSim = (k: keyof typeof cfg.sim, v: string | number) =>
    setCfg((p) => ({ ...p, sim: { ...p.sim, [k]: v } }))

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

  // Calculation Memory
  const mem = useMemo(() => {
    const { params, sim, modules, gen, srv } = cfg

    let wTon = sim.weight / 1000
    let baseFreight = 0
    let cBase = 0
    let freteValor = 0
    let gris = 0
    let despacho = 0

    if (modules.paramsActive) {
      baseFreight = params.baseTariff + sim.dist * params.valKm + wTon * params.valTon
      cBase = baseFreight * params.correcao
      freteValor = sim.value * (params.freteValorPct / 100)
      gris = sim.value * (params.grisPct / 100)
      despacho = params.despacho
    }

    const baseForPct = cBase > 0 ? cBase : sim.value

    const calcItem = (i: CfgItem, activeMod: boolean) => {
      if (!i.active || !activeMod) return 0
      if (i.type === 'fixed') return i.val
      return baseForPct * (i.val / 100)
    }

    const genVals = gen
      .map((g) => ({ ...g, total: calcItem(g, modules.genActive) }))
      .filter((g) => g.total > 0 && modules.genActive)
    const srvVals = srv
      .map((s) => ({ ...s, total: calcItem(s, modules.srvActive) }))
      .filter((s) => s.total > 0 && modules.srvActive)

    const subGen = genVals.reduce((a, b) => a + b.total, 0)
    const subSrv = srvVals.reduce((a, b) => a + b.total, 0)

    const sub1 = (modules.paramsActive ? cBase + freteValor + gris + despacho : 0) + subGen + subSrv
    const margin = modules.paramsActive ? sub1 * (params.marginPct / 100) : 0
    const sub2 = sub1 + margin
    const tax = modules.paramsActive ? sub2 * (params.taxPct / 100) : 0
    const total = sub2 + tax

    return {
      baseFreight,
      cBase,
      freteValor,
      gris,
      despacho,
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
  const inputClass = 'bg-slate-50 border-slate-200 focus-visible:ring-primary transition-colors'
  const editHighlight = 'border-blue-200 bg-blue-50/30 focus-visible:ring-blue-500'

  const renderList = (
    list: 'gen' | 'srv',
    title: string,
    icon: React.ReactNode,
    activeKey: keyof typeof cfg.modules,
    showAdd: boolean,
  ) => (
    <Card className={cn('shadow-sm transition-opacity', !cfg.modules[activeKey] && 'opacity-75')}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-slate-50/50">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Módulo</Label>
            <Switch
              checked={cfg.modules[activeKey]}
              onCheckedChange={(c) => updateModule(activeKey, c)}
            />
          </div>
          {showAdd && (
            <Button
              variant="outline"
              size="sm"
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
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-50/50 border-dashed opacity-70',
            )}
          >
            <Switch
              checked={i.active}
              onCheckedChange={(c) => handleItem(list, 'upd', i.id, 'active', c)}
              disabled={!cfg.modules[activeKey]}
            />
            <Input
              className={cn('min-w-[200px] flex-1 font-medium', editHighlight)}
              value={i.name}
              onChange={(e) => handleItem(list, 'upd', i.id, 'name', e.target.value)}
              disabled={!cfg.modules[activeKey]}
            />
            {showAdd && (
              <Select
                value={i.type}
                onValueChange={(v) => handleItem(list, 'upd', i.id, 'type', v)}
                disabled={!cfg.modules[activeKey]}
              >
                <SelectTrigger className={cn('w-[160px]', editHighlight)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  <SelectItem value="pct">Percentual (%)</SelectItem>
                </SelectContent>
              </Select>
            )}
            {!showAdd && (
              <Badge
                variant="outline"
                className="w-[160px] justify-center text-slate-500 bg-slate-50 font-normal"
              >
                Valor Fixo (R$)
              </Badge>
            )}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {i.type === 'fixed' ? 'R$' : '%'}
              </span>
              <Input
                type="number"
                className={cn('w-32 pl-8', editHighlight)}
                value={i.val}
                onChange={(e) => handleItem(list, 'upd', i.id, 'val', Number(e.target.value))}
                disabled={!cfg.modules[activeKey]}
              />
            </div>
            {showAdd && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleItem(list, 'del', i.id)}
                disabled={!cfg.modules[activeKey]}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {cfg[list].length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
            Nenhum item configurado.
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
            <Train className="w-8 h-8 text-primary" /> Planilha de Precificação Ferroviária
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <History className="w-4 h-4 text-primary" /> Atualizado:{' '}
              {new Date(lastSaved).toLocaleString('pt-BR')}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
              <strong className="text-slate-500">Empresa:</strong> {cfg.info.company}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
              <strong className="text-slate-500">Modal:</strong> {cfg.info.modal}
            </span>
          </div>
        </div>
        <Button onClick={handleSave} size="lg" className="gap-2 shadow-md">
          <Save className="w-5 h-5" /> Salvar Versão Atual
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Dados Gerais */}
          <Card className="shadow-sm border-t-4 border-t-primary/60">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" /> Informações da Planilha
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-slate-500">
                  Nome da Tabela
                </Label>
                <Input
                  value={cfg.info.name}
                  onChange={(e) => updateInfo('name', e.target.value)}
                  className={editHighlight}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-slate-500">
                  Versão da Planilha
                </Label>
                <Input
                  value={cfg.info.version}
                  onChange={(e) => updateInfo('version', e.target.value)}
                  className={editHighlight}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-slate-500">
                  Responsável pela Alteração
                </Label>
                <Input
                  value={cfg.info.responsible}
                  onChange={(e) => updateInfo('responsible', e.target.value)}
                  className={editHighlight}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados de Simulação */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" /> Variáveis de Simulação (Inputs)
              </CardTitle>
              <CardDescription>
                Dados operacionais da rota e carga para o cálculo do frete.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">Origem</Label>
                  <Input
                    value={cfg.sim.origin}
                    onChange={(e) => updateSim('origin', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">Destino</Label>
                  <Input
                    value={cfg.sim.destination}
                    onChange={(e) => updateSim('destination', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Distância (KM)
                  </Label>
                  <Input
                    type="number"
                    value={cfg.sim.dist}
                    onChange={(e) => updateSim('dist', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Peso (KG)
                  </Label>
                  <Input
                    type="number"
                    value={cfg.sim.weight}
                    onChange={(e) => updateSim('weight', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Volume (m³)
                  </Label>
                  <Input
                    type="number"
                    value={cfg.sim.volume}
                    onChange={(e) => updateSim('volume', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Valor da Carga (R$)
                  </Label>
                  <Input
                    type="number"
                    value={cfg.sim.value}
                    onChange={(e) => updateSim('value', Number(e.target.value))}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Tipo de Carga
                  </Label>
                  <Input
                    value={cfg.sim.cargoType}
                    onChange={(e) => updateSim('cargoType', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Tipo de Operação
                  </Label>
                  <Input
                    value={cfg.sim.operationType}
                    onChange={(e) => updateSim('operationType', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    Frequência
                  </Label>
                  <Input
                    value={cfg.sim.frequency}
                    onChange={(e) => updateSim('frequency', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">
                    SLA / Prazo
                  </Label>
                  <Input
                    value={cfg.sim.sla}
                    onChange={(e) => updateSim('sla', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parâmetros de Custo */}
          <Card
            className={cn(
              'shadow-sm transition-opacity',
              !cfg.modules.paramsActive && 'opacity-75',
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Parâmetros Principais de Custo</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Módulo Base</Label>
                <Switch
                  checked={cfg.modules.paramsActive}
                  onCheckedChange={(c) => updateModule('paramsActive', c)}
                />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
              {[
                { l: 'Tarifa base por faixa (R$)', k: 'baseTariff' },
                { l: 'Valor por Tonelada (R$)', k: 'valTon' },
                { l: 'Valor por KM Ferroviário (R$)', k: 'valKm' },
                { l: 'Frete Valor (%)', k: 'freteValorPct' },
                { l: 'GRIS Ferroviário (%)', k: 'grisPct' },
                { l: 'Taxa de Despacho (R$)', k: 'despacho' },
                { l: 'Fator de Correção', k: 'correcao' },
                { l: 'Margem Comercial (%)', k: 'marginPct' },
                { l: 'Tributos (%)', k: 'taxPct' },
              ].map((f) => (
                <div key={f.k} className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-slate-500">{f.l}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cfg.params[f.k as keyof typeof cfg.params]}
                    onChange={(e) => updateParam(f.k as keyof typeof cfg.params, e.target.value)}
                    className={editHighlight}
                    disabled={!cfg.modules.paramsActive}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {renderList(
            'gen',
            'Generalidades Ferroviárias',
            <ListTodo className="w-5 h-5 text-primary" />,
            'genActive',
            false,
          )}
          {renderList(
            'srv',
            'Serviços Adicionais',
            <Blocks className="w-5 h-5 text-primary" />,
            'srvActive',
            true,
          )}
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
          <Card className="border-primary/20 shadow-xl bg-white overflow-hidden">
            <div className="bg-slate-800 text-white p-4 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-bold text-lg leading-tight">Memória de Cálculo</h3>
                <p className="text-slate-300 text-xs">Simulação em tempo real</p>
              </div>
            </div>

            <CardContent className="p-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-5 space-y-4 text-sm font-mono tracking-tight">
                {/* Parâmetros */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                    <div className="h-px bg-slate-200 flex-1" />
                    Frete Base e Taxas
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>
                  {!cfg.modules.paramsActive && (
                    <div className="text-center text-slate-400 italic py-2 text-xs">
                      Módulo Inativo
                    </div>
                  )}
                  {cfg.modules.paramsActive && (
                    <div className="space-y-2 text-slate-600">
                      <div className="flex justify-between">
                        <span>Frete Peso Bruto</span>
                        <span>{fmt(mem.baseFreight)}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-semibold bg-slate-50 p-1 rounded">
                        <span>Frete Corrigido (x{cfg.params.correcao})</span>
                        <span>{fmt(mem.cBase)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frete Valor ({cfg.params.freteValorPct}%)</span>
                        <span>{fmt(mem.freteValor)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GRIS ({cfg.params.grisPct}%)</span>
                        <span>{fmt(mem.gris)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Despacho</span>
                        <span>{fmt(mem.despacho)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generalidades */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2 mt-4">
                    <div className="h-px bg-slate-200 flex-1" />
                    Generalidades
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>
                  {!cfg.modules.genActive && (
                    <div className="text-center text-slate-400 italic py-2 text-xs">
                      Módulo Inativo
                    </div>
                  )}
                  {cfg.modules.genActive && mem.genVals.length === 0 && (
                    <div className="text-center text-slate-400 italic py-2 text-xs">
                      Nenhum item ativo
                    </div>
                  )}
                  {cfg.modules.genActive && mem.genVals.length > 0 && (
                    <div className="space-y-1.5 text-slate-600">
                      {mem.genVals.map((g) => (
                        <div
                          key={g.id}
                          className="flex justify-between pl-2 border-l-2 border-primary/30"
                        >
                          <span className="truncate pr-2">{g.name}</span>
                          <span>{fmt(g.total)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium text-slate-800 pt-1 border-t border-dashed mt-2">
                        <span>Subtotal Gen.</span>
                        <span>{fmt(mem.subGen)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Serviços */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2 mt-4">
                    <div className="h-px bg-slate-200 flex-1" />
                    Serviços Adicionais
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>
                  {!cfg.modules.srvActive && (
                    <div className="text-center text-slate-400 italic py-2 text-xs">
                      Módulo Inativo
                    </div>
                  )}
                  {cfg.modules.srvActive && mem.srvVals.length === 0 && (
                    <div className="text-center text-slate-400 italic py-2 text-xs">
                      Nenhum serviço ativo
                    </div>
                  )}
                  {cfg.modules.srvActive && mem.srvVals.length > 0 && (
                    <div className="space-y-1.5 text-slate-600">
                      {mem.srvVals.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between pl-2 border-l-2 border-primary/30"
                        >
                          <span className="truncate pr-2">
                            {s.name} {s.type === 'pct' && `(${s.val}%)`}
                          </span>
                          <span>{fmt(s.total)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium text-slate-800 pt-1 border-t border-dashed mt-2">
                        <span>Subtotal Serv.</span>
                        <span>{fmt(mem.subSrv)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fechamento */}
                <div className="pt-4 mt-6 border-t-2 border-slate-800">
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Subtotal Operacional</span>
                      <span>{fmt(mem.sub1)}</span>
                    </div>

                    {cfg.modules.paramsActive && (
                      <>
                        <div className="flex justify-between text-slate-600 pl-4 border-l-2 border-slate-200">
                          <span>Margem Comercial ({cfg.params.marginPct}%)</span>
                          <span>{fmt(mem.margin)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>Subtotal com Margem</span>
                          <span>{fmt(mem.sub2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 pl-4 border-l-2 border-slate-200">
                          <span>Tributos Estimados ({cfg.params.taxPct}%)</span>
                          <span>{fmt(mem.tax)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-5 border-t border-primary/20">
                <div className="flex justify-between items-end font-sans">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-600 block uppercase tracking-wider">
                      Preço Final Sugerido
                    </span>
                    <span className="text-xs text-slate-500">Valor para negociação</span>
                  </div>
                  <span className="text-3xl font-black text-primary tracking-tight">
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
