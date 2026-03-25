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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore, { Contact } from '@/stores/useCrmStore'
import { Plus, Trash, Star, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function ContatoModal({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact
}) {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    companyId: '',
    isPrincipal: false,
    methods: [
      { id: Math.random().toString(36).substr(2, 9), type: 'email', value: '', isPrincipal: true },
    ],
  })

  useEffect(() => {
    if (contact) {
      setFormData(JSON.parse(JSON.stringify(contact)))
    } else {
      setFormData({
        name: '',
        companyId: '',
        isPrincipal: false,
        methods: [
          {
            id: Math.random().toString(36).substr(2, 9),
            type: 'email',
            value: '',
            isPrincipal: true,
          },
        ],
      })
    }
  }, [contact, open])

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.companyId) {
      toast({ title: 'Nome e Empresa são obrigatórios', variant: 'destructive' })
      return
    }

    const newContact = {
      ...formData,
      id: contact ? contact.id : Math.random().toString(36).substr(2, 9),
    } as Contact

    if (contact) {
      updateState({
        contacts: state.contacts.map((c) => (c.id === contact.id ? newContact : c)),
      })
      toast({ title: 'Contato atualizado com sucesso!' })
    } else {
      updateState({
        contacts: [...state.contacts, newContact],
      })
      toast({ title: 'Contato criado com sucesso!' })
    }
    onOpenChange(false)
  }

  const addMethod = () => {
    setFormData((prev) => ({
      ...prev,
      methods: [
        ...(prev.methods || []),
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'email',
          value: '',
          isPrincipal: false,
        },
      ],
    }))
  }

  const updateMethod = (id: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      methods: prev.methods?.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }))
  }

  const removeMethod = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      methods: prev.methods?.filter((m) => m.id !== id),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-blue-200 shadow-xl bg-slate-50">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-blue-950">
            <Users className="w-5 h-5 text-blue-600" />
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-slate-500">Nome Completo</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-slate-500">
              Empresa Vinculada
            </Label>
            <Select
              value={formData.companyId}
              onValueChange={(v) => setFormData({ ...formData, companyId: v })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione a empresa..." />
              </SelectTrigger>
              <SelectContent>
                {state.companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nomeFantasia || c.razaoSocial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase text-slate-500">
                Meios de Contato
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMethod}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" /> Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {formData.methods?.map((m, index) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 bg-white p-2 rounded-md border border-slate-200"
                >
                  <Select value={m.type} onValueChange={(v) => updateMethod(m.id, 'type', v)}>
                    <SelectTrigger className="w-[120px] h-8 text-xs border-none bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={m.value}
                    onChange={(e) => updateMethod(m.id, 'value', e.target.value)}
                    className="h-8 text-sm border-none shadow-none focus-visible:ring-0 px-2"
                    placeholder="Valor..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.methods?.map((method) => ({
                        ...method,
                        isPrincipal: method.id === m.id,
                      }))
                      setFormData((prev) => ({ ...prev, methods: updated }))
                    }}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      m.isPrincipal
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100',
                    )}
                    title="Definir como principal"
                  >
                    <Star className="w-4 h-4" fill={m.isPrincipal ? 'currentColor' : 'none'} />
                  </button>
                  {formData.methods!.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMethod(m.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-blue-100 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Salvar Contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
