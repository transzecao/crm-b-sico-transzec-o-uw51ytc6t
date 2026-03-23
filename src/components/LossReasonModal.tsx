import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const reasons = [
  'FIT',
  'Preço',
  'Prazo',
  'Cobertura',
  'SLA',
  'Rastreamento',
  'Avarias',
  'Atrasos',
  'Outro',
]

export function LossReasonModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: (reason: string, details?: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Perda</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Motivo da Perda <span className="text-destructive">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo..." />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {reason === 'Outro' && (
            <div className="space-y-2 animate-fade-in-up">
              <Label>Detalhes adicionais</Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Especifique o motivo..."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!reason}
            onClick={() => onConfirm(reason, details)}
          >
            Confirmar Perda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
