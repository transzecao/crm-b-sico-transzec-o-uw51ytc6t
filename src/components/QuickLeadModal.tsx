import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, DollarSign, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuickLeadModal({
  open,
  stage,
  onConfirm,
  onCancel,
}: {
  open: boolean
  stage: string
  onConfirm: (title: string, value: number) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setTitle('')
      setValue('')
      setError('')
    }
  }, [open])

  const handleConfirm = () => {
    const rawVal = parseFloat(value.replace(',', '.'))

    if (isNaN(rawVal) || rawVal < 0) {
      setError('O valor financeiro deve ser um número positivo.')
      return
    }
    if (!title.trim()) {
      setError('O nome do negócio é obrigatório.')
      return
    }
    onConfirm(title, rawVal)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent aria-describedby="Adicionar negócio rápido na etapa selecionada">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-violet-950">
            <Briefcase className="w-5 h-5 text-violet-600" aria-hidden="true" /> Adicionar Negócio
            em {stage}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div
              className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2 border border-red-200"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="lead-title" className="text-violet-900 font-semibold">
              Nome do Negócio{' '}
              <span className="text-rose-600" title="Obrigatório" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="lead-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nova Cotação - Empresa XYZ"
              aria-invalid={error && !title.trim() ? 'true' : 'false'}
              className="focus-visible:ring-violet-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-value" className="text-violet-900 font-semibold">
              Valor Estimado (R$){' '}
              <span className="text-rose-600" title="Obrigatório" aria-hidden="true">
                *
              </span>
            </Label>
            <div className="relative">
              <DollarSign
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400"
                aria-hidden="true"
              />
              <Input
                id="lead-value"
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (parseFloat(e.target.value) < 0) {
                    setError('O valor não pode ser negativo')
                  } else {
                    setError('')
                  }
                }}
                className={cn(
                  'pl-9 focus-visible:ring-violet-500/50',
                  error && parseFloat(value) < 0 && 'border-red-500 focus-visible:ring-red-500',
                )}
                placeholder="0.00"
                aria-invalid={error && parseFloat(value) < 0 ? 'true' : 'false'}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="border-t border-violet-100 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            aria-label="Cancelar criação rápida"
            className="bg-white text-violet-700 hover:bg-violet-50 border-violet-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            aria-label="Confirmar e salvar novo negócio"
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm font-semibold"
          >
            Salvar Negócio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
