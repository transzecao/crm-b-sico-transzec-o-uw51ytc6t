import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, Settings as SettingsIcon, Save, Download, Upload } from 'lucide-react'
import { getFleetSettings, updateFleetSettings, getAuditLogs } from '@/services/fleet_costs'
import { createAuditLog } from '@/services/audit_logs'
import { useToast } from '@/hooks/use-toast'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AuditLog {
  id: string
  parameter: string
  old_value: string
  new_value: string
  impact: string
  created: string
  expand?: { user_id?: { name: string } }
}

export function AdminPanelModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { toast } = useToast()
  const { loadSettings, data, setFullState } = useFleetCalculator()

  const [settings, setSettings] = useState<any>(null)
  const [originalSettings, setOriginalSettings] = useState<any>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    warnings: string[]
    impacts: string[]
  }>({ isOpen: false, warnings: [], impacts: [] })

  useEffect(() => {
    if (open) loadData()
  }, [open])

  const loadData = async () => {
    const d = await getFleetSettings()
    if (d) {
      setSettings({ ...d })
      setOriginalSettings({ ...d })
    }
    const logs = await getAuditLogs()
    setAuditLogs(logs as unknown as AuditLog[])
  }

  const handleSaveAttempt = () => {
    if (!settings?.id) return

    const warnings: string[] = []
    const impacts: string[] = []
    let hasRedImpact = false

    const lastResultStr = localStorage.getItem('ultimoResultadoCPK')
    if (lastResultStr) {
      const lastResult = JSON.parse(lastResultStr)

      if (settings.max_cpk < lastResult.cpk) {
        warnings.push(
          `O novo CPK Máximo (R$ ${settings.max_cpk}) é menor que o CPK atual (R$ ${lastResult.cpk.toFixed(2)}).`,
        )
        hasRedImpact = true
      }
      if (settings.min_margin > lastResult.margin) {
        warnings.push(
          `A nova Margem Mínima (${settings.min_margin}%) é maior que a margem atual (${lastResult.margin.toFixed(2)}%).`,
        )
        hasRedImpact = true
      }
      if (settings.max_das < lastResult.dasPercent) {
        warnings.push(
          `O novo DAS Máximo (${settings.max_das}%) é menor que o percentual atual (${lastResult.dasPercent.toFixed(2)}%).`,
        )
        hasRedImpact = true
      }
    }

    Object.keys(settings).forEach((key) => {
      if (
        originalSettings &&
        settings[key] !== originalSettings[key] &&
        !['id', 'created', 'updated', 'collectionId', 'collectionName'].includes(key)
      ) {
        impacts.push(`Parâmetro ${key} alterado de ${originalSettings[key]} para ${settings[key]}`)
      }
    })

    if (impacts.length === 0) {
      toast({ title: 'Aviso', description: 'Nenhuma alteração foi feita.' })
      return
    }

    if (hasRedImpact || warnings.length > 0) {
      setConfirmDialog({ isOpen: true, warnings, impacts })
    } else {
      executeSave(impacts)
    }
  }

  const executeSave = async (impacts: string[]) => {
    try {
      await updateFleetSettings(settings.id, settings)

      for (const key of Object.keys(settings)) {
        if (
          originalSettings &&
          settings[key] !== originalSettings[key] &&
          !['id', 'created', 'updated', 'collectionId', 'collectionName'].includes(key)
        ) {
          await createAuditLog({
            parameter: key,
            old_value: String(originalSettings[key]),
            new_value: String(settings[key]),
            impact: 'Alteração Administrativa via Painel',
          })
        }
      }

      setOriginalSettings({ ...settings })
      setConfirmDialog({ isOpen: false, warnings: [], impacts: [] })
      toast({ title: 'Sucesso', description: 'Configurações salvas e auditadas!' })

      loadSettings()
      loadData()
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar configurações.',
        variant: 'destructive',
      })
    }
  }

  const handleExportBackup = () => {
    const stateStr = localStorage.getItem('fleet_calc_state') || JSON.stringify(data)
    const blob = new Blob([stateStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup_cpk_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Sucesso', description: 'Backup local gerado com sucesso.' })
  }

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (json && json.drivers && json.vehicles) {
          setFullState(json)
          toast({ title: 'Sucesso', description: 'Estado da calculadora restaurado.' })
          onOpenChange(false)
        } else {
          toast({
            title: 'Erro',
            description: 'Formato de arquivo inválido.',
            variant: 'destructive',
          })
        }
      } catch (error) {
        toast({ title: 'Erro', description: 'Falha ao ler o arquivo.', variant: 'destructive' })
      }
    }
    reader.readAsText(file)
  }

  if (!settings) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">Painel Administrativo do Sistema</DialogTitle>
                <DialogDescription>
                  Gerencie limites operacionais e visualize o histórico de auditoria.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="thresholds" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4 border-b overflow-x-auto">
              <TabsList className="w-auto justify-start h-auto p-1 bg-slate-100 flex-nowrap">
                <TabsTrigger value="thresholds" className="py-2 px-4 whitespace-nowrap">
                  Gatilhos & Alertas
                </TabsTrigger>
                <TabsTrigger value="parameters" className="py-2 px-4 whitespace-nowrap">
                  Parâmetros de Custo
                </TabsTrigger>
                <TabsTrigger value="standards" className="py-2 px-4 whitespace-nowrap">
                  Valores Padrão
                </TabsTrigger>
                <TabsTrigger value="audit" className="py-2 px-4 whitespace-nowrap">
                  Histórico (Audit Log)
                </TabsTrigger>
                <TabsTrigger value="backup" className="py-2 px-4 whitespace-nowrap">
                  Backup & Restauração
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6">
              <TabsContent value="thresholds" className="mt-0 space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>CPK Máximo Aceitável (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.max_cpk}
                      onChange={(e) =>
                        setSettings({ ...settings, max_cpk: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Margem Mínima (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.min_margin}
                      onChange={(e) =>
                        setSettings({ ...settings, min_margin: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Margem de Alerta Amarelo (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.yellow_margin}
                      onChange={(e) =>
                        setSettings({ ...settings, yellow_margin: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custo Variável Máximo (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.var_cost_max_percent || 60}
                      onChange={(e) =>
                        setSettings({ ...settings, var_cost_max_percent: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>DAS Máximo Permitido (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.max_das}
                      onChange={(e) =>
                        setSettings({ ...settings, max_das: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parameters" className="mt-0 space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Alíquota DAS (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.das_rate || 12}
                      onChange={(e) =>
                        setSettings({ ...settings, das_rate: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custo por CT-e (R$)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.cte_cost || 2}
                      onChange={(e) =>
                        setSettings({ ...settings, cte_cost: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Docs. Mensais Estimados</Label>
                    <Input
                      type="number"
                      step="1"
                      value={settings.docs_count || 200}
                      onChange={(e) =>
                        setSettings({ ...settings, docs_count: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Taxas Fiscais Anuais (R$)</Label>
                    <Input
                      type="number"
                      step="100"
                      value={settings.taxas_fiscal || 1000}
                      onChange={(e) =>
                        setSettings({ ...settings, taxas_fiscal: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>KM Morto Mensal</Label>
                    <Input
                      type="number"
                      step="10"
                      value={settings.dead_km || 100}
                      onChange={(e) =>
                        setSettings({ ...settings, dead_km: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="standards" className="mt-0 space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Dias Úteis Mensais</Label>
                    <Input
                      type="number"
                      step="1"
                      value={settings.working_days}
                      onChange={(e) =>
                        setSettings({ ...settings, working_days: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>VR Diário Padrão (R$)</Label>
                    <Input
                      type="number"
                      step="1"
                      value={settings.vr_daily || 30}
                      onChange={(e) =>
                        setSettings({ ...settings, vr_daily: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cesta Básica Padrão (R$)</Label>
                    <Input
                      type="number"
                      step="10"
                      value={settings.cesta_basica || 150}
                      onChange={(e) =>
                        setSettings({ ...settings, cesta_basica: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Consumo Diesel Default (km/L)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.fuel_consumption}
                      onChange={(e) =>
                        setSettings({ ...settings, fuel_consumption: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço do Diesel Default (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.fuel_price}
                      onChange={(e) =>
                        setSettings({ ...settings, fuel_price: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold text-slate-800 mb-4">
                    Encargos Trabalhistas Padrão (%)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>FGTS</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={settings.default_fgts || 8}
                        onChange={(e) =>
                          setSettings({ ...settings, default_fgts: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>13º Salário</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={settings.default_decimo || 8.33}
                        onChange={(e) =>
                          setSettings({ ...settings, default_decimo: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Férias</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={settings.default_ferias || 11.11}
                        onChange={(e) =>
                          setSettings({ ...settings, default_ferias: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>PIS</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={settings.default_pis || 1}
                        onChange={(e) =>
                          setSettings({ ...settings, default_pis: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="mt-0 animate-fade-in">
                <div className="border rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Parâmetro</TableHead>
                        <TableHead>De → Para</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.length > 0 ? (
                        auditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-xs whitespace-nowrap text-slate-500">
                              {format(new Date(log.created), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              {log.expand?.user_id?.name || 'Sistema'}
                            </TableCell>
                            <TableCell className="text-sm font-mono text-slate-600">
                              {log.parameter}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="text-red-500 line-through mr-2">
                                {log.old_value}
                              </span>
                              <span className="text-green-600 font-bold">{log.new_value}</span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                            Nenhum registro de auditoria encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="backup" className="mt-0 space-y-6 animate-fade-in">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                  <Download className="w-12 h-12 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">Exportar Dados Locais</h3>
                    <p className="text-sm text-blue-700 max-w-md">
                      Faça o download de toda a estrutura atual da calculadora (motoristas,
                      veículos, vínculos e configurações) em formato JSON.
                    </p>
                  </div>
                  <Button onClick={handleExportBackup} className="bg-blue-600 hover:bg-blue-700">
                    Baixar Backup (.json)
                  </Button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
                  <Upload className="w-12 h-12 text-slate-500" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Restaurar Backup</h3>
                    <p className="text-sm text-slate-600 max-w-md">
                      Substitua o estado atual da calculadora importando um arquivo JSON previamente
                      exportado.
                    </p>
                  </div>
                  <Label
                    htmlFor="import-backup"
                    className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md font-medium"
                  >
                    Selecionar Arquivo
                  </Label>
                  <Input
                    id="import-backup"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </div>
              </TabsContent>
            </ScrollArea>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={handleSaveAttempt} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Configurações
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(val) => setConfirmDialog((prev) => ({ ...prev, isOpen: val }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Alerta de Impacto Operacional
            </DialogTitle>
            <DialogDescription>
              As alterações farão a operação atual entrar na zona de Alerta Vermelho.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 p-4 rounded-md space-y-2 border border-red-100 my-4">
            {confirmDialog.warnings.map((warn, i) => (
              <p key={i} className="text-sm text-red-800 font-medium">
                {warn}
              </p>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ isOpen: false, warnings: [], impacts: [] })}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => executeSave(confirmDialog.impacts)}>
              Confirmar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
