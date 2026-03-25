import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import {
  Calculator,
  Scale,
  MapPin,
  Map,
  BadgeAlert,
  History,
  AlertTriangle,
  Code2,
  LineChart,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

export default function Financeiro() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [tab, setTab] = useState('pricing')

  // Pricing Engine State
  const [weight, setWeight] = useState(120)
  const [volume, setVolume] = useState(0.8)
  const [nfValue, setNfValue] = useState(5000)
  const [distance, setDistance] = useState(150)
  const [useTda, setUseTda] = useState(true)

  // Pricing Logic
  const cubedWeight = volume * 300 // 300kg/m3 assumption
  const taxableWeight = Math.max(weight, cubedWeight)

  let baseWeightCost = 0
  if (taxableWeight <= 5) baseWeightCost = 50
  else if (taxableWeight <= 10) baseWeightCost = 75
  else if (taxableWeight <= 20) baseWeightCost = 100
  else baseWeightCost = 100 + (taxableWeight - 20) * 2

  const adValorem = nfValue * 0.005
  const gris = nfValue * 0.003
  const dispatchFee = 66.08
  const tdaFee = useTda ? 45.0 : 0

  // Geography & Tolls
  const [route, setRoute] = useState('bandeirantes')
  const [axles, setAxles] = useState(2)
  const [zmrc, setZmrc] = useState(false)

  const tolls: Record<string, number> = {
    anhanguera: 12.5,
    bandeirantes: 12.4,
    imigrantes: 36.8,
    dutra: 18.2,
  }
  const tollTotal = tolls[route] * axles
  const zmrcFee = zmrc ? baseWeightCost * 0.2 : 0

  const totalFracionado =
    baseWeightCost + adValorem + gris + dispatchFee + tdaFee + tollTotal + zmrcFee
  const lotacaoCost = 1200 + distance * 4.5
  const isLotacaoBetter = totalFracionado > lotacaoCost

  // Fiscal State
  const [origin, setOrigin] = useState('SP')
  const [dest, setDest] = useState('SP')
  const icmsRate = origin === 'SP' && dest === 'SP' ? 12 : 7
  const icmsValue = totalFracionado * (icmsRate / 100)
  const anttFloor = distance * axles * 1.5
  const isAnttCompliant = totalFracionado >= anttFloor

  // EDI State
  const [ediCode, setEdiCode] = useState('01')
  const ediDict: Record<string, string> = {
    '01': 'Entrega Realizada Normalmente',
    '02': 'Destinatário Ausente',
    '03': 'Recusa do Recebedor',
    '09': 'Avaria na Carga (Pendente Acareação)',
  }
  const [ncm, setNcm] = useState('3808')
  const ncmDict: Record<string, string> = {
    '3808': 'Produtos Químicos (Requer Licença Especial MOPP)',
    '8708': 'Autopeças (Carga Seca Padrão)',
    '2106': 'Alimentos (Controle de Temperatura Restrito)',
  }

  // KPI State
  const [totalDel, setTotalDel] = useState(150)
  const [onTime, setOnTime] = useState(142)
  const otd = totalDel > 0 ? ((onTime / totalDel) * 100).toFixed(1) : '0.0'

  const [stdCost, setStdCost] = useState(18000)
  const [negCost, setNegCost] = useState(15500)
  const savings = stdCost > 0 ? (((stdCost - negCost) / stdCost) * 100).toFixed(1) : '0.0'

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  const logAction = (action: string) => {
    updateState({
      financeAuditLogs: [
        { date: new Date().toLocaleString('pt-BR'), user: state.currentUser.name, action },
        ...(state.financeAuditLogs || []),
      ].slice(0, 50),
    })
  }

  const handleZmrcToggle = (val: boolean) => {
    setZmrc(val)
    if (val) {
      toast({
        title: 'Alerta Automático (Geográfico)',
        description: 'Área de Restrição ZMRC ativada. Operação exigirá veículo VUC.',
        variant: 'destructive',
      })
      logAction('Ativou alerta de restrição geográfica (ZMRC)')
    }
  }

  const handleRouteChange = (val: string) => {
    setRoute(val)
    toast({
      title: 'Integração ARTESP',
      description: `Valores de pedágio sincronizados para a rota ${val.toUpperCase()}.`,
    })
    logAction(`Simulou atualização de praça de pedágio: ${val}`)
  }

  return (
    <div className="space-y-6 bg-emerald-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-emerald-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-emerald-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100/80 p-3 rounded-xl border border-emerald-200/50 text-emerald-700 shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
              Agente Financeiro IA
            </h1>
            <p className="text-emerald-700/80 font-medium mt-1">
              Inteligência de Pricing Logístico, Compliance e Integrações (Foco São Paulo).
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-4 w-full h-auto flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-emerald-100">
              <TabsTrigger
                value="pricing"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Motor Pricing
              </TabsTrigger>
              <TabsTrigger
                value="geo"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Geografia e Rotas
              </TabsTrigger>
              <TabsTrigger
                value="fiscal"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Fiscal e Legal
              </TabsTrigger>
              <TabsTrigger
                value="integ"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                Integração e EDI
              </TabsTrigger>
              <TabsTrigger
                value="kpi"
                className="flex-1 py-2 text-sm font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                KPIs Logísticos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="mt-0">
              <Card className="border-emerald-100 shadow-sm bg-white/90">
                <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                    <Scale className="w-5 h-5 text-emerald-600" /> Parâmetros de Carga (Cubagem e
                    Break-even)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Peso Físico (KG)
                    </Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="border-emerald-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Volume Total (M³)
                    </Label>
                    <Input
                      type="number"
                      value={volume}
                      step="0.1"
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="border-emerald-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Valor da Nota Fiscal (R$)
                    </Label>
                    <Input
                      type="number"
                      value={nfValue}
                      onChange={(e) => setNfValue(Number(e.target.value))}
                      className="border-emerald-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Distância (KM)
                    </Label>
                    <Input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="border-emerald-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2 pt-2 border-t border-slate-100 flex items-center gap-4">
                    <Switch checked={useTda} onCheckedChange={setUseTda} />
                    <Label className="font-semibold text-slate-700 cursor-pointer">
                      Aplicar Taxa de Dificuldade de Entrega (TDA/TDE)
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geo" className="mt-0">
              <Card className="border-emerald-100 shadow-sm bg-white/90">
                <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                    <MapPin className="w-5 h-5 text-emerald-600" /> Inteligência Geográfica (ARTESP
                    e Municípios)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Rodovia Principal (Consulta ARTESP)
                      </Label>
                      <Select value={route} onValueChange={handleRouteChange}>
                        <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anhanguera">Sistema Anhanguera</SelectItem>
                          <SelectItem value="bandeirantes">Sistema Bandeirantes</SelectItem>
                          <SelectItem value="imigrantes">Rodovia dos Imigrantes</SelectItem>
                          <SelectItem value="dutra">Via Dutra (SP/RJ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Eixos Cobrados
                      </Label>
                      <Input
                        type="number"
                        value={axles}
                        min="2"
                        onChange={(e) => setAxles(Number(e.target.value))}
                        className="border-emerald-200 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-bold text-slate-800 flex items-center gap-2 text-base">
                        <Map className="w-5 h-5 text-emerald-600" />
                        Zona Máxima de Restrição de Circulação (ZMRC / ZERC)
                      </Label>
                      <Switch
                        checked={zmrc}
                        onCheckedChange={handleZmrcToggle}
                        className="data-[state=checked]:bg-rose-500"
                      />
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Ative se o destino ou coleta ocorrer dentro do perímetro restrito (Ex: Centro
                      Expandido de SP).
                    </p>
                    {zmrc && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded flex items-start gap-2 text-sm font-medium">
                        <BadgeAlert className="w-5 h-5 shrink-0 text-rose-600" />
                        Restrição Confirmada: Despacho exigirá veículo do tipo VUC (Veículo Urbano
                        de Carga). Taxa Adicional de 20% aplicada.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fiscal" className="mt-0">
              <Card className="border-emerald-100 shadow-sm bg-white/90">
                <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                    <FileText className="w-5 h-5 text-emerald-600" /> Fiscal, Legal e ANTT
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Estado de Origem
                      </Label>
                      <Select value={origin} onValueChange={setOrigin}>
                        <SelectTrigger className="border-emerald-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Estado de Destino
                      </Label>
                      <Select value={dest} onValueChange={setDest}>
                        <SelectTrigger className="border-emerald-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold uppercase text-emerald-800">
                        Cálculo Automático de ICMS
                      </p>
                      <p className="text-2xl font-black text-emerald-700">{icmsRate}%</p>
                      <p className="text-sm text-emerald-600 font-medium">
                        Valor Tributado: {fmt(icmsValue)}
                      </p>
                    </div>
                    <div className="flex-1 space-y-1 border-t md:border-t-0 md:border-l border-emerald-200 md:pl-6 pt-4 md:pt-0">
                      <p className="text-xs font-bold uppercase text-emerald-800">
                        Piso Mínimo ANTT (Lei 13.703)
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-emerald-700">
                          {fmt(anttFloor)}
                        </span>
                        {isAnttCompliant ? (
                          <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Em Conformidade
                          </span>
                        ) : (
                          <span className="bg-rose-200 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Abaixo do Piso
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integ" className="mt-0">
              <Card className="border-emerald-100 shadow-sm bg-white/90">
                <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                    <Code2 className="w-5 h-5 text-emerald-600" /> Integrações e Data Lake
                  </CardTitle>
                  <CardDescription>
                    Padrões PROCEDA (NOTFIS/CONEMB) e Tradução de Eventos EDI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Código de Ocorrência EDI
                      </Label>
                      <Input
                        value={ediCode}
                        onChange={(e) => setEdiCode(e.target.value)}
                        placeholder="Ex: 01"
                        className="font-mono bg-slate-50 border-emerald-200"
                      />
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg shadow-inner text-emerald-400 font-mono text-sm min-h-[80px] flex items-center">
                      {ediDict[ediCode] ? (
                        <span>
                          {'> '} {ediDict[ediCode]}
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {'> '} Código EDI não mapeado na base PROCEDA.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Consulta NCM (Carga Específica)
                      </Label>
                      <Input
                        value={ncm}
                        onChange={(e) => setNcm(e.target.value)}
                        placeholder="Ex: 3808"
                        className="font-mono bg-slate-50 border-emerald-200"
                      />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg min-h-[80px] flex items-center">
                      <span className="font-semibold text-emerald-800 text-sm">
                        {ncmDict[ncm] || 'Produto padrão, sem restrições específicas mapeadas.'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kpi" className="mt-0">
              <Card className="border-emerald-100 shadow-sm bg-white/90">
                <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                    <LineChart className="w-5 h-5 text-emerald-600" /> Monitoramento Logístico e
                    Saving
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-800 border-b pb-2">
                      Cálculo de OTD (On-Time Delivery)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 uppercase">Total Entregas</Label>
                        <Input
                          type="number"
                          value={totalDel}
                          onChange={(e) => setTotalDel(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 uppercase">No Prazo</Label>
                        <Input
                          type="number"
                          value={onTime}
                          onChange={(e) => setOnTime(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-indigo-900">Performance OTD</span>
                      <span className="text-2xl font-black text-indigo-700">{otd}%</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="font-bold text-slate-800 border-b pb-2">
                      Cálculo de Freight Savings
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 uppercase">Tabela Padrão</Label>
                        <Input
                          type="number"
                          value={stdCost}
                          onChange={(e) => setStdCost(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600 uppercase">Custo Negociado</Label>
                        <Input
                          type="number"
                          value={negCost}
                          onChange={(e) => setNegCost(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-emerald-900">Saving Realizado</span>
                      <span className="text-2xl font-black text-emerald-700">{savings}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden ring-1 ring-white/10">
            <div className="bg-emerald-600/20 text-emerald-50 p-5 flex items-center gap-3 border-b border-emerald-500/30">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">
                  Motor de Decisão (IA)
                </h3>
                <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">
                  Modalidade Sugerida:
                </p>
              </div>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <span className="font-bold text-slate-300">Sugestão Ótima</span>
                <span className="font-black text-xl text-emerald-400">
                  {isLotacaoBetter ? 'Lotação (Dedicado)' : 'Carga Fracionada'}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                  <span>Peso Tarifável (Cubado/Físico)</span>
                  <span className="font-bold text-white">{taxableWeight.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frete Peso Base</span>
                  <span className="font-semibold">{fmt(baseWeightCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ad Valorem (0.5%)</span>
                  <span className="font-semibold">{fmt(adValorem)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>GRIS (0.3%)</span>
                  <span className="font-semibold">{fmt(gris)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de Despacho (CT-e)</span>
                  <span className="font-semibold">{fmt(dispatchFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>TDA / TDE</span>
                  <span className="font-semibold">{fmt(tdaFee)}</span>
                </div>
                <div className="flex justify-between items-center text-rose-300">
                  <span>Pedágios + ZMRC</span>
                  <span className="font-semibold">{fmt(tollTotal + zmrcFee)}</span>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent my-4" />

              <div className="bg-emerald-950/50 p-4 border border-emerald-800/50 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest block mb-1">
                  Custo Total Fracionado Estimado
                </span>
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  {fmt(totalFracionado)}
                </span>
              </div>

              {isLotacaoBetter && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs font-medium leading-relaxed">
                  <AlertTriangle className="w-4 h-4 inline mr-1 mb-0.5 text-amber-400" />O custo
                  fracionado simulado excede o custo de lotação padrão ({fmt(lotacaoCost)}
                  ). O modelo logístico recomenda a contratação de veículo dedicado (Carga Fechada)
                  para maximização de margem.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
                <History className="w-4 h-4 text-slate-500" /> Log de Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[200px] overflow-y-auto p-5 space-y-4">
                {state.financeAuditLogs?.map((log, i) => (
                  <div
                    key={i}
                    className="text-xs border-l-[3px] border-emerald-400 pl-3 relative group hover:bg-slate-50 p-1.5 rounded-r-md transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">
                      {log.date}
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
