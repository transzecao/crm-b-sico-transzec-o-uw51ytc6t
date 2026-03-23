import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Train, Calculator, Plus, Trash2, Save, FileSpreadsheet, History } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ItemType = 'fixed' | 'pct' | 'emex'
type CfgItem = {
  id: string
  name: string
  type: ItemType
  val: number
  pct: number
  active: boolean
}

const defaultGen: CfgItem[] = [
  { id: 'g1', name: 'Manobras Especiais', type: 'fixed', val: 850, pct: 0, active: true },
  { id: 'g2', name: 'Permanência em Pátio', type: 'fixed', val: 1200, pct: 0, active: false },
  { id: 'g3', name: 'Espera de Composição', type: 'fixed', val: 500, pct: 0, active: true },
  { id: 'g4', name: 'Taxa EMEX-Ferro', type: 'emex', val: 10, pct: 0.5, active: false },
]

export default function Financeiro() {
  const [cfg, setCfg] = useState({
    info: {
      name: 'Tabela Padrão Ferroviária',
      modal: 'Ferroviário',
      company: 'Transzecão LTDA',
      ver: '1.2.0',
      resp: 'Admin Financeiro',
      active: true,
    },
    params: {
      valTon: 150.0,
      valKm: 12.5,
      gris: 0.3,
      disp: 66.08,
      corr: 1.05,
      margin: 15.0,
      tax: 14.25,
    },
    tiers: [
      { id: 't1', min: 0, max: 100, factor: 1.0 },
      { id: 't2', min: 101, max: 500, factor: 0.95 },
    ],
    gen: defaultGen,
    srv: [
      {
        id: 's1',
        name: 'Transbordo Rodo-Ferroviário',
        type: 'fixed',
        val: 2500,
        pct: 0,
        active: true,
      } as CfgItem,
    ],
    updated: new Date().toISOString(),
  })

  const [sim, setSim] = useState({ w: 50000, d: 1200, v: 500000 })

  const updateCfg = (k: keyof typeof cfg, v: any) => setCfg((p) => ({ ...p, [k]: v }))
  const updateParam = (k: keyof typeof cfg.params, v: string) =>
    setCfg((p) => ({ ...p, params: { ...p.params, [k]: Number(v) } }))
  const updateSim = (k: keyof typeof sim, v: string) => setSim((p) => ({ ...p, [k]: Number(v) }))

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
          pct: 0,
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
    updateCfg('updated', new Date().toISOString())
    toast.success('Planilha salva com sucesso', { description: 'Memória de cálculo atualizada.' })
  }

  // Calculation Memory
  const mem = useMemo(() => {
    const wTon = sim.w / 1000
    const base = sim.d * cfg.params.valKm + wTon * cfg.params.valTon
    const activeTier = cfg.tiers.find((t) => sim.d >= t.min && sim.d <= t.max) || { factor: 1 }
    const cBase = base * cfg.params.corr * activeTier.factor
    const gris = sim.v * (cfg.params.gris / 100)

    const calcItem = (i: CfgItem) => {
      if (!i.active || !cfg.info.active) return 0
      if (i.type === 'fixed') return i.val
      if (i.type === 'pct') return cBase * (i.pct / 100)
      return Math.ceil(sim.w / 100) * i.val + cBase * (i.pct / 100)
    }

    const genVals = cfg.gen.map((g) => ({ ...g, total: calcItem(g) })).filter((g) => g.total > 0)
    const srvVals = cfg.srv.map((s) => ({ ...s, total: calcItem(s) })).filter((s) => s.total > 0)

    const sub1 =
      (cfg.info.active ? cBase + cfg.params.disp + gris : 0) +
      genVals.reduce((a, b) => a + b.total, 0) +
      srvVals.reduce((a, b) => a + b.total, 0)
    const margin = sub1 * (cfg.params.margin / 100)
    const sub2 = sub1 + margin
    const tax = sub2 * (cfg.params.tax / 100)

    return { wTon, base, cBase, gris, genVals, srvVals, sub1, margin, sub2, tax, total: sub2 + tax }
  }, [cfg, sim])

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  const inputClass = 'bg-blue-50/30 border-blue-200 focus-visible:ring-blue-500 transition-colors'

  const renderList = (list: 'gen' | 'srv', title: string) => (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={() => handleItem(list, 'add')}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {cfg[list].map((i) => (
          <div
            key={i.id}
            className={cn(
              'flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-lg border transition-all',
              i.active ? 'bg-white' : 'bg-slate-50 opacity-60',
            )}
          >
            <Switch
              checked={i.active}
              onCheckedChange={(c) => handleItem(list, 'upd', i.id, 'active', c)}
            />
            <Input
              className={cn('min-w-[200px] flex-1', inputClass)}
              value={i.name}
              onChange={(e) => handleItem(list, 'upd', i.id, 'name', e.target.value)}
            />
            <select
              className={cn('h-10 rounded-md border border-input px-3 py-2 text-sm', inputClass)}
              value={i.type}
              onChange={(e) => handleItem(list, 'upd', i.id, 'type', e.target.value)}
            >
              <option value="fixed">Fixo (R$)</option>
              <option value="pct">Percentual (%)</option>
              <option value="emex">EMEX (Fixo + %)</option>
            </select>
            <Input
              type="number"
              className={cn('w-28', inputClass)}
              value={i.val}
              onChange={(e) => handleItem(list, 'upd', i.id, 'val', Number(e.target.value))}
              placeholder="Valor"
            />
            {(i.type === 'pct' || i.type === 'emex') && (
              <Input
                type="number"
                className={cn('w-24', inputClass)}
                value={i.pct}
                onChange={(e) => handleItem(list, 'upd', i.id, 'pct', Number(e.target.value))}
                placeholder="%"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => handleItem(list, 'del', i.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Train className="w-8 h-8 text-primary" /> Planilha de Precificação Ferroviária
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <History className="w-4 h-4" /> Atualizado:{' '}
              {new Date(cfg.updated).toLocaleString('pt-BR')}
            </span>
            <span>Responsável: {cfg.info.resp}</span>
            <Badge variant={cfg.info.active ? 'default' : 'secondary'}>
              {cfg.info.active ? 'Cálculo Global Ativo' : 'Cálculo Suspenso'}
            </Badge>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Planilha
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" /> Informações Gerais
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label>Status Global</Label>
                  <Switch
                    checked={cfg.info.active}
                    onCheckedChange={(c) => updateCfg('info', { ...cfg.info, active: c })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { l: 'Nome da Tabela', k: 'name' },
                { l: 'Modal', k: 'modal', ro: true },
                { l: 'Empresa', k: 'company' },
                { l: 'Versão', k: 'ver' },
              ].map((f) => (
                <div key={f.k} className="space-y-1.5">
                  <Label>{f.l}</Label>
                  <Input
                    value={cfg.info[f.k as keyof typeof cfg.info] as string}
                    onChange={(e) => updateCfg('info', { ...cfg.info, [f.k]: e.target.value })}
                    readOnly={f.ro}
                    className={f.ro ? 'bg-muted' : inputClass}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Parâmetros Principais de Custo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: 'Valor por Tonelada (R$)', k: 'valTon' },
                { l: 'Valor por KM (R$)', k: 'valKm' },
                { l: 'Taxa de Despacho (R$)', k: 'disp' },
                { l: 'Fator de Correção', k: 'corr' },
                { l: 'GRIS Ferroviário (%)', k: 'gris' },
                { l: 'Margem Comercial (%)', k: 'margin' },
                { l: 'Impostos (%)', k: 'tax' },
              ].map((f) => (
                <div key={f.k} className="space-y-1.5">
                  <Label>{f.l}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cfg.params[f.k as keyof typeof cfg.params]}
                    onChange={(e) => updateParam(f.k as keyof typeof cfg.params, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {renderList('gen', 'Generalidades Ferroviárias (Custos Acessórios)')}
          {renderList('srv', 'Serviços Adicionais (Operacionais)')}
        </div>

        <div className="lg:col-span-4 sticky top-6 space-y-6">
          <Card className="border-primary/20 shadow-md bg-slate-50/30">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" /> Simulador e Memória
              </CardTitle>
              <CardDescription>Cálculo auditável em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Distância (KM)</Label>
                  <Input
                    type="number"
                    value={sim.d}
                    onChange={(e) => updateSim('d', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Peso (KG)</Label>
                  <Input
                    type="number"
                    value={sim.w}
                    onChange={(e) => updateSim('w', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Valor Carga (R$)</Label>
                  <Input
                    type="number"
                    value={sim.v}
                    onChange={(e) => updateSim('v', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm bg-white p-4 rounded-lg border font-mono tracking-tight">
                <div className="flex justify-between text-slate-500 mb-2 font-sans font-semibold border-b pb-2">
                  <span>Rubrica</span>
                  <span>Valor Calculado</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete Base Bruto</span>
                  <span>{fmt(mem.base)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Frete Base Corrigido</span>
                  <span>{fmt(mem.cBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Despacho</span>
                  <span>{fmt(cfg.info.active ? cfg.params.disp : 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GRIS ({cfg.params.gris}%)</span>
                  <span>{fmt(cfg.info.active ? mem.gris : 0)}</span>
                </div>

                {mem.genVals.length > 0 && (
                  <div className="pt-2 border-t mt-2 text-xs text-slate-400 uppercase">
                    Generalidades Ativas
                  </div>
                )}
                {mem.genVals.map((g) => (
                  <div
                    key={g.id}
                    className="flex justify-between text-slate-600 pl-2 border-l-2 border-slate-200"
                  >
                    <span>{g.name}</span>
                    <span>{fmt(g.total)}</span>
                  </div>
                ))}

                {mem.srvVals.length > 0 && (
                  <div className="pt-2 border-t mt-2 text-xs text-slate-400 uppercase">
                    Serviços Ativos
                  </div>
                )}
                {mem.srvVals.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between text-slate-600 pl-2 border-l-2 border-slate-200"
                  >
                    <span>{s.name}</span>
                    <span>{fmt(s.total)}</span>
                  </div>
                ))}

                <Separator className="my-3" />
                <div className="flex justify-between font-medium">
                  <span>Subtotal Operacional</span>
                  <span>{fmt(mem.sub1)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Margem Comercial ({cfg.params.margin}%)</span>
                  <span>{fmt(mem.margin)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Impostos ({cfg.params.tax}%)</span>
                  <span>{fmt(mem.tax)}</span>
                </div>

                <Separator className="my-3" />
                <div className="flex justify-between items-end font-sans">
                  <span className="text-base font-bold text-slate-800">Preço Final Sugerido</span>
                  <span className="text-2xl font-black text-primary">{fmt(mem.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
