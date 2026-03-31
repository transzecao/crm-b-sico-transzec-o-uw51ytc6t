import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { useToast } from '@/hooks/use-toast'

export function LinkTab() {
  const { data, addLink, removeLink } = useFleetCalculator()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [newLink, setNewLink] = useState({ driverId: '', vehicleId: '', km: 10000 })

  const handleAdd = () => {
    if (!newLink.driverId || !newLink.vehicleId || newLink.km <= 0) {
      toast({
        title: 'Aviso',
        description: 'Preencha todos os campos e certifique-se de que o KM estimado é > 0.',
        variant: 'destructive',
      })
      return
    }
    addLink(newLink)
    setOpen(false)
    setNewLink({ driverId: '', vehicleId: '', km: 10000 })
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Vínculos (Motorista ↔ Veículo)</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Criar Vínculo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Vínculo Operacional</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Motorista</Label>
                <Select
                  value={newLink.driverId}
                  onValueChange={(v) => setNewLink((prev) => ({ ...prev, driverId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {data.drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name || d.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Veículo</Label>
                <Select
                  value={newLink.vehicleId}
                  onValueChange={(v) => setNewLink((prev) => ({ ...prev, vehicleId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {data.vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.plate || v.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>KM Mensal Estimado da Rota</Label>
                <Input
                  type="number"
                  value={newLink.km}
                  onChange={(e) => setNewLink((prev) => ({ ...prev, km: Number(e.target.value) }))}
                />
              </div>
              <Button onClick={handleAdd} className="w-full h-12 text-md mt-2">
                Adicionar Vínculo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {data.links.length === 0 && (
          <div className="p-8 text-center text-slate-500 border border-dashed rounded-lg bg-slate-50 mt-4">
            Nenhum vínculo ativo. Adicione pelo menos um para ativar o consumo de diesel e pneus.
          </div>
        )}
        {data.links.map((l) => {
          const d = data.drivers.find((dr) => dr.id === l.driverId)
          const v = data.vehicles.find((ve) => ve.id === l.vehicleId)
          return (
            <div
              key={l.id}
              className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <LinkIcon className="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">
                    {d?.name || l.driverId} <span className="mx-2 text-slate-300">↔</span>{' '}
                    {v?.plate || l.vehicleId}
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {l.km.toLocaleString('pt-BR')} km rodados / mês
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLink(l.id)}
                className="hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
