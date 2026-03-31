import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getFleetSettings, updateFleetSettings } from '@/services/fleet_costs'
import { Settings } from 'lucide-react'

export function FleetAdmin() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    getFleetSettings()
      .then(setSettings)
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    if (!settings?.id) return
    try {
      await updateFleetSettings(settings.id, settings)
      toast({ title: 'Sucesso', description: 'Parâmetros atualizados!' })
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar parâmetros.', variant: 'destructive' })
    }
  }

  if (!settings)
    return <div className="p-4 text-center text-slate-500">Carregando parâmetros...</div>

  return (
    <Card className="max-w-2xl animate-fade-in shadow-sm">
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
              onChange={(e) => setSettings({ ...settings, yellow_margin: Number(e.target.value) })}
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
          <Button onClick={handleSave} className="w-full sm:w-auto px-8">
            Salvar Parâmetros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
