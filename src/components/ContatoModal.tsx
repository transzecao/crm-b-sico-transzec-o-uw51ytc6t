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
import { Users } from 'lucide-react'

export function ContatoModal({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean
  onOpenChange: any
  contact: any
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-blue-200 shadow-xl bg-white/95 backdrop-blur-md">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <DialogTitle className="text-blue-950 font-bold flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-md border border-blue-200 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-blue-900 font-semibold text-xs uppercase tracking-wider">
              Nome Completo
            </Label>
            <Input defaultValue={contact?.name || ''} className="focus-visible:ring-blue-500/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-blue-900 font-semibold text-xs uppercase tracking-wider">
              Contato Principal (Email ou Tel)
            </Label>
            <Input
              defaultValue={contact?.methods?.[0]?.value || ''}
              className="focus-visible:ring-blue-500/50"
            />
          </div>
        </div>
        <DialogFooter className="border-t border-blue-100 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Salvar Contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
