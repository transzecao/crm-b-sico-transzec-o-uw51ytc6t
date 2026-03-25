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
import { AlertOctagon } from 'lucide-react'

const reasons = ['FIT', 'Preço', 'Prazo', 'Cobertura', 'SLA/Rastreamento/Avarias/Atrasos', 'Outro']

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

  const isConfirmDisabled = !reason || (reason === 'Outro' && !details.trim())

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="border-rose-200 shadow-2xl bg-rose-50/95 backdrop-blur-md sm:max-w-md">
        <DialogHeader className="border-b border-rose-100 pb-4">
          <DialogTitle className="text-rose-950 flex items-center gap-2 text-xl font-bold">
            <div className="bg-rose-100 p-1.5 rounded-lg border border-rose-200">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
            </div>
            Registrar Perda de Negócio
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-rose-900 font-semibold">
              Motivo Principal <span className="text-rose-600">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-white/80 border-rose-200 focus:ring-rose-500/50">
                <SelectValue placeholder="Selecione o motivo de perda..." />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r} className="focus:bg-rose-100 focus:text-rose-900">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {reason && (
            <div className="space-y-2 animate-fade-in-up">
              <Label className="text-rose-900 font-semibold">
                Detalhes{' '}
                {reason === 'Outro' ? <span className="text-rose-600">*</span> : '(Opcional)'}
              </Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Especifique o contexto da perda..."
                className="bg-white/80 border-rose-200 focus-visible:ring-rose-500/50 min-h-[100px]"
              />
            </div>
          )}
        </div>
        <DialogFooter className="border-t border-rose-100 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-rose-200 text-rose-800 hover:bg-rose-100/50 bg-white/50"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isConfirmDisabled}
            onClick={() => onConfirm(reason, details)}
            className="bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 transition-all font-semibold"
          >
            Confirmar Perda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
