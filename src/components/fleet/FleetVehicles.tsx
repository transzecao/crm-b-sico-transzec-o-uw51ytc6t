import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getVehicles, createVehicle } from '@/services/vehicles'
import { getMaintenanceLogs } from '@/services/maintenance_logs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, Wrench } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'

export function FleetVehicles() {
  const { state } = useCrmStore()
  const canEdit = ['Acesso Master', 'Supervisor Financeiro'].includes(state.role)
  const { toast } = useToast()

  const [vehicles, setVehicles] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [form, setForm] = useState({
    plate: '',
    model: '',
    km_critical_limit: 0,
    maintenance_frequency_months: 12,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      getVehicles()
        .then(setVehicles)
        .catch(() => {})
      getMaintenanceLogs()
        .then(setLogs)
        .catch(() => {})
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async () => {
    if (!canEdit) return toast({ title: 'Sem permissão', variant: 'destructive' })
    try {
      const nextDate = new Date()
      nextDate.setMonth(nextDate.getMonth() + form.maintenance_frequency_months)
      await createVehicle({
        ...form,
        status: 'active',
        last_maintenance_date: new Date().toISOString(),
        next_maintenance_date: nextDate.toISOString(),
      })
      toast({ title: 'Veículo registrado!' })
      setForm({ plate: '', model: '', km_critical_limit: 0, maintenance_frequency_months: 12 })
      loadData()
    } catch (e) {
      toast({ title: 'Erro', variant: 'destructive' })
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" /> Perfil e Alertas da Frota
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {canEdit && (
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-2">
                <Label>Placa</Label>
                <Input
                  value={form.plate}
                  onChange={(e) => setForm({ ...form, plate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>KM Crítico (Alerta)</Label>
                <Input
                  type="number"
                  value={form.km_critical_limit}
                  onChange={(e) => setForm({ ...form, km_critical_limit: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Freq. Manutenção (Meses)</Label>
                <Input
                  type="number"
                  value={form.maintenance_frequency_months}
                  onChange={(e) =>
                    setForm({ ...form, maintenance_frequency_months: Number(e.target.value) })
                  }
                />
              </div>
              <Button onClick={handleSave} className="col-span-2">
                Adicionar Veículo
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Limite KM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-bold">{v.plate}</TableCell>
                  <TableCell>{v.model}</TableCell>
                  <TableCell>{v.km_critical_limit} km</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" /> Histórico de Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.length === 0 && <p className="text-slate-500 text-sm">Nenhum alerta recente.</p>}
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-amber-50 p-3 rounded border border-amber-200 shadow-sm"
              >
                <div className="text-xs font-bold text-amber-800 mb-1">
                  {log.expand?.vehicle_id?.plate} - {new Date(log.created).toLocaleDateString()}
                </div>
                <p className="text-sm text-amber-900 leading-relaxed">{log.message_sent}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
