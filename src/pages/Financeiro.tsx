import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import useCrmStore from '@/stores/useCrmStore'
import { formatCurrency } from '@/utils/formatters'
import { Calculator, Download, Package, Truck, AlertCircle } from 'lucide-react'

export default function Financeiro() {
  const { state } = useCrmStore()

  if (!['Master', 'Financeiro'].includes(state.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
          <p className="text-muted-foreground">Apenas perfis Financeiro ou Master podem acessar.</p>
        </div>
      </div>
    )
  }

  const [s, setS] = useState({
    dist: 0,
    weight: 0,
    val: 0,
    tda: 0,
    tfd: 0,
    emexPct: 0,
    emex: false,
    trf: false,
    segFluvial: false,
    suframa: false,
    pbr: false,
    agendamento: false,
    canhoto: false,
  })

  const update = (k: keyof typeof s, v: any) => setS((p) => ({ ...prev(p), [k]: v }))
  const prev = (p: typeof s) => p

  // Calculations based on NTC reference
  let baseRate = 0.6
  if (s.weight <= 10) baseRate = 2.5
  else if (s.weight <= 30) baseRate = 2.0
  else if (s.weight <= 50) baseRate = 1.5
  else if (s.weight <= 100) baseRate = 1.0
  else if (s.weight <= 200) baseRate = 0.8

  const baseFreight = s.weight > 0 && s.dist > 0 ? 50 + s.dist * 0.15 + s.weight * baseRate : 0
  const despacho = s.weight > 0 ? 66.08 : 0
  const gris = s.val * 0.003
  const tdaVal = baseFreight * (s.tda / 100)
  const tfdVal = baseFreight * (s.tfd / 100)
  const emexVal = s.emex ? Math.ceil(s.weight / 100) * 10 + baseFreight * (s.emexPct / 100) : 0

  const trfVal = s.trf ? 150 : 0
  const segFluvialVal = s.segFluvial ? s.val * 0.001 : 0
  const suframaVal = s.suframa ? 35 : 0
  const pbrVal = s.pbr ? 40 : 0
  const agendamentoVal = s.agendamento ? 60 : 0
  const canhotoVal = s.canhoto ? 15 : 0

  const total =
    baseFreight +
    despacho +
    gris +
    tdaVal +
    tfdVal +
    emexVal +
    trfVal +
    segFluvialVal +
    suframaVal +
    pbrVal +
    agendamentoVal +
    canhotoVal

  const summary = [
    { label: 'Frete Base (Custo-Peso)', val: baseFreight, force: true },
    { label: 'Taxa de Despacho', val: despacho, force: true },
    { label: 'GRIS (0.30%)', val: gris, force: true },
    { label: 'TDA', val: tdaVal },
    { label: 'TFD', val: tfdVal },
    { label: 'EMEX', val: emexVal },
    { label: 'TRF (Norte)', val: trfVal },
    { label: 'Seguro Fluvial', val: segFluvialVal },
    { label: 'Taxa SUFRAMA', val: suframaVal },
    { label: 'Paletização (PBR)', val: pbrVal },
    { label: 'Agendamento', val: agendamentoVal },
    { label: 'Dev. Canhoto', val: canhotoVal },
  ].filter((i) => i.val > 0 || i.force)

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <Calculator className="w-8 h-8 text-primary" /> Transzecão Pricing Tool
        </h1>
        <p className="text-muted-foreground mt-1">
          Simulador de Fretes Fracionados (LTL) - Base NTC
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5" /> Dados da Carga
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Distância (km)</Label>
                <Input
                  type="number"
                  value={s.dist || ''}
                  onChange={(e) => update('dist', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Peso Total (kg)</Label>
                <Input
                  type="number"
                  value={s.weight || ''}
                  onChange={(e) => update('weight', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Valor da Carga (R$)</Label>
                <Input
                  type="number"
                  value={s.val || ''}
                  onChange={(e) => update('val', Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Taxas e Generalidades (% sobre frete base)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>TDA (%)</Label>
                <Input
                  type="number"
                  value={s.tda || ''}
                  onChange={(e) => update('tda', Number(e.target.value))}
                  placeholder="Ex: 2"
                />
              </div>
              <div className="space-y-1.5">
                <Label>TFD (%)</Label>
                <Input
                  type="number"
                  value={s.tfd || ''}
                  onChange={(e) => update('tfd', Number(e.target.value))}
                  placeholder="Ex: 1.5"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Aplicar EMEX</Label>
                  <Switch checked={s.emex} onCheckedChange={(c) => update('emex', c)} />
                </div>
                {s.emex && (
                  <Input
                    type="number"
                    value={s.emexPct || ''}
                    onChange={(e) => update('emexPct', Number(e.target.value))}
                    placeholder="% Adicional EMEX"
                    className="h-8"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Região Norte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { k: 'trf', l: 'TRF (Redespacho Fluvial)' },
                  { k: 'segFluvial', l: 'Seguro Fluvial' },
                  { k: 'suframa', l: 'Taxa SUFRAMA' },
                ].map(({ k, l }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                  >
                    <Label className="font-medium cursor-pointer">{l}</Label>
                    <Switch
                      checked={s[k as keyof typeof s] as boolean}
                      onCheckedChange={(c) => update(k as keyof typeof s, c)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Serviços Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { k: 'pbr', l: 'Paletização (PBR)' },
                  { k: 'agendamento', l: 'Agendamento de Entregas' },
                  { k: 'canhoto', l: 'Devolução de Canhotos' },
                ].map(({ k, l }) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                  >
                    <Label className="font-medium cursor-pointer">{l}</Label>
                    <Switch
                      checked={s[k as keyof typeof s] as boolean}
                      onCheckedChange={(c) => update(k as keyof typeof s, c)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1 sticky top-20">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-5 h-5" /> Resumo da Simulação
              </CardTitle>
              <CardDescription>Cálculo em tempo real (NTC)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3 text-sm">
                {summary.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-medium text-slate-800">{formatCurrency(item.val)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-end">
                <span className="text-base font-semibold text-slate-800">Total do Frete</span>
                <span className="text-2xl font-bold text-primary tracking-tight">
                  {formatCurrency(total)}
                </span>
              </div>
              <Button className="w-full mt-6" variant="outline">
                <Download className="w-4 h-4 mr-2" /> Gerar PDF da Simulação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
