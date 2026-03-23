import { useState } from 'react'
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
import { Star, Plus, Trash } from 'lucide-react'
import useCrmStore, { Contact } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function ContatoModal({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  contact?: Contact
}) {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [name, setName] = useState(contact?.name || '')
  const [companyId, setCompanyId] = useState(contact?.companyId || '')
  const [methods, setMethods] = useState(
    contact?.methods || [{ id: '1', type: 'email' as const, value: '', isPrincipal: true }],
  )

  const addMethod = () =>
    setMethods([
      ...methods,
      { id: Math.random().toString(), type: 'email', value: '', isPrincipal: methods.length === 0 },
    ])

  const updateMethod = (id: string, field: string, val: any) => {
    setMethods(methods.map((m) => (m.id === id ? { ...m, [field]: val } : m)))
  }

  const togglePrincipal = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isPrincipal: m.id === id })))
  }

  const removeMethod = (id: string) => {
    const newMethods = methods.filter((m) => m.id !== id)
    if (newMethods.length > 0 && !newMethods.find((m) => m.isPrincipal))
      newMethods[0].isPrincipal = true
    setMethods(newMethods)
  }

  const sortedMethods = [...methods].sort((a, b) =>
    a.isPrincipal === b.isPrincipal ? 0 : a.isPrincipal ? -1 : 1,
  )

  const handleSave = () => {
    if (!name || !companyId)
      return toast({ title: 'Preencha nome e empresa', variant: 'destructive' })
    const newContact = { id: contact?.id || Math.random().toString(), companyId, name, methods }

    if (contact)
      updateState({ contacts: state.contacts.map((c) => (c.id === contact.id ? newContact : c)) })
    else updateState({ contacts: [...state.contacts, newContact] })

    toast({ title: 'Contato salvo' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {state.companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.razaoSocial || c.cnpj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 border rounded-md p-4 bg-muted/30">
            <div className="flex justify-between items-center">
              <Label>Informações de Contato</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMethod}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Meio
              </Button>
            </div>

            {sortedMethods.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePrincipal(m.id)}
                  className={cn(
                    'shrink-0',
                    m.isPrincipal ? 'text-warning' : 'text-muted-foreground',
                  )}
                >
                  <Star className="w-4 h-4" fill={m.isPrincipal ? 'currentColor' : 'none'} />
                </Button>
                <Select value={m.type} onValueChange={(v) => updateMethod(m.id, 'type', v)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  value={m.value}
                  onChange={(e) => updateMethod(m.id, 'value', e.target.value)}
                  placeholder={`Digite o ${m.type}...`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMethod(m.id)}
                  className="text-destructive shrink-0"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
