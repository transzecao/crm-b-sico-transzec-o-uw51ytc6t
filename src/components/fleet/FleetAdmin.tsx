import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getFleetSettings, updateFleetSettings } from '@/services/fleet_costs'
import { Settings, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { createAuditLog } from '@/services/audit_logs'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { FleetAlerts } from '@/components/fleet/FleetAlerts'

export function FleetAdmin() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [originalSettings, setOriginalSettings] = useState<any>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    warnings: string[]
    impacts: string[]
  }>({ isOpen: false, warnings: [], impacts: [] })

  const { loadSettings } = useFleetCalculator()

  useEffect(() => {
    getFleetSettings()
      .then((data) => {
        setSettings(data)
        setOriginalSettings(data)
      })
      .catch(() => {})
  }, [])

  const handleSaveAttempt = () => {
    if (!settings?.id) return

    if (settings.yellow_margin <= settings.min_margin) {
      toast({
        title: 'Erro de Validação',
        description: 'A margem amarela deve ser maior que a margem mínima.',
        variant: 'destructive',
      })
      return
    }

    const warnings: string[] = []
    const impacts: string[] = []
    let hasRedImpact = false

    const lastResultStr = localStorage.getItem('ultimoResultadoCPK')
    if (lastResultStr) {
      const lastResult = JSON.parse(lastResultStr)

      if (settings.max_cpk < lastResult.cpk) {
        warnings.push(
          `O novo CPK Máximo (R$ ${settings.max_cpk}) é menor que o CPK atual da operação (R$ ${lastResult.cpk.toFixed(2)}). A operação entrará em ALERTA VERMELHO.`,
        )
        hasRedImpact = true
        impacts.push(`CPK delta: R$ ${(settings.max_cpk - originalSettings.max_cpk).toFixed(2)}`)
      } else if (settings.max_cpk !== originalSettings.max_cpk) {
        impacts.push(`CPK delta: R$ ${(settings.max_cpk - originalSettings.max_cpk).toFixed(2)}`)
      }

      if (settings.min_margin > lastResult.margin) {
        warnings.push(
          `A nova Margem Mínima (${settings.min_margin}%) é maior que a margem atual (${lastResult.margin.toFixed(2)}%). A operação entrará em ALERTA VERMELHO.`,
        )
        hasRedImpact = true
        impacts.push(
          `Margem delta: ${(settings.min_margin - originalSettings.min_margin).toFixed(2)}%`,
        )
      } else if (settings.min_margin !== originalSettings.min_margin) {
        impacts.push(
          `Margem delta: ${(settings.min_margin - originalSettings.min_margin).toFixed(2)}%`,
        )
      }

      if (settings.max_das !== originalSettings.max_das) {
        const estDasValue = lastResult.faturamento * (settings.max_das / 100)
        impacts.push(
          `DAS Limite alterado de ${originalSettings.max_das}% para ${settings.max_das}%. Novo limite estimado: R$ ${estDasValue.toFixed(2)}`,
        )
      }
    } else {
      if (settings.max_cpk !== originalSettings.max_cpk)
        impacts.push(`CPK Máximo alterado para R$ ${settings.max_cpk}`)
      if (settings.min_margin !== originalSettings.min_margin)
        impacts.push(`Margem Mínima alterada para ${settings.min_margin}%`)
      if (settings.max_das !== originalSettings.max_das)
        impacts.push(`DAS Máximo alterado para ${settings.max_das}%`)
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

      const changes = [
        { key: 'max_cpk', name: 'CPK Máximo' },
        { key: 'min_margin', name: 'Margem Mínima' },
        { key: 'yellow_margin', name: 'Margem Amarela' },
        { key: 'max_das', name: 'DAS Máximo' },
      ]

      for (const change of changes) {
        if (settings[change.key] !== originalSettings[change.key]) {
          await createAuditLog({
            parameter: change.name,
            old_value: String(originalSettings[change.key]),
            new_value: String(settings[change.key]),
            impact:
              impacts.find((i) => i.includes(change.name.split(' ')[0])) ||
              'Alteração de parâmetro',
          })
        }
      }

      setOriginalSettings({ ...settings })
      setConfirmDialog({ isOpen: false, warnings: [], impacts: [] })
      toast({ title: 'Sucesso', description: 'Parâmetros atualizados e registrados!' })

      loadSettings()
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar parâmetros.', variant: 'destructive' })
    }
  }

  if (!settings)
    return <div className="p-4 text-center text-slate-500">Carregando parâmetros...</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <FleetAlerts />
      <Card className="animate-fade-in shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Painel Administrativo - CPK</CardTitle>
              <CardDescription>Redefina os limites e gatilhos de alerta.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>CPK Máximo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.max_cpk}
                onChange={(e) => setSettings({ ...settings, max_cpk: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Margem Mínima (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.min_margin}
                onChange={(e) => setSettings({ ...settings, min_margin: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Margem Alerta Amarelo (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.yellow_margin}
                onChange={(e) =>
                  setSettings({ ...settings, yellow_margin: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>DAS Máximo (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.max_das}
                onChange={(e) => setSettings({ ...settings, max_das: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Consumo Padrão Combustível (km/L)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.fuel_consumption}
                onChange={(e) =>
                  setSettings({ ...settings, fuel_consumption: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Preço Padrão Combustível (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.fuel_price}
                onChange={(e) => setSettings({ ...settings, fuel_price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dias Trabalhados Padrão</Label>
              <Input
                type="number"
                step="1"
                value={settings.working_days}
                onChange={(e) => setSettings({ ...settings, working_days: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button onClick={handleSaveAttempt} className="w-full sm:w-auto px-8">
              Salvar Parâmetros
            </Button>
          </div>
        </CardContent>

        <Dialog
          open={confirmDialog.isOpen}
          onOpenChange={(val) => setConfirmDialog((prev) => ({ ...prev, isOpen: val }))}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Atenção: Impacto Crítico na Operação
              </DialogTitle>
              <DialogDescription>
                As alterações propostas farão com que a operação atual entre em estado de Alerta
                Vermelho.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-red-50 p-4 rounded-md space-y-2 border border-red-100">
                {confirmDialog.warnings.map((warn, i) => (
                  <p key={i} className="text-sm text-red-800 font-medium">
                    {warn}
                  </p>
                ))}
              </div>

              {confirmDialog.impacts.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-md space-y-2 border">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">
                    Resumo de Impacto
                  </h4>
                  {confirmDialog.impacts.map((imp, i) => (
                    <p key={i} className="text-sm text-slate-700">
                      {imp}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ isOpen: false, warnings: [], impacts: [] })}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => executeSave(confirmDialog.impacts)}>
                Confirmar e Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
