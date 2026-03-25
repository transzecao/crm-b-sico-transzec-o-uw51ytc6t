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

    toast({ title: 'Contato salvo com sucesso!' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-blue-200 shadow-xl bg-white/95 backdrop-blur-md">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <DialogTitle className="text-2xl font-bold text-blue-950 flex items-center gap-2">
            {contact ? 'Editar Ficha do Contato' : 'Cadastrar Novo Contato'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-blue-900 font-semibold">Nome Completo</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-visible:ring-blue-500 border-blue-200 bg-blue-50/30"
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-900 font-semibold">Empresa Comercial</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger className="focus:ring-blue-500 border-blue-200 bg-blue-50/30">
                  <SelectValue placeholder="Vincular à empresa..." />
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

          <div className="space-y-4 border border-blue-100 rounded-xl p-5 bg-blue-50/40 shadow-inner">
            <div className="flex justify-between items-center pb-2 border-b border-blue-100/50">
              <Label className="text-blue-950 font-bold text-base">Canais de Comunicação</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMethod}
                className="text-blue-700 border-blue-300 bg-white hover:bg-blue-100 hover:text-blue-900 hover:border-blue-400 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Canal
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              {sortedMethods.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 bg-white p-2 rounded-lg border border-blue-100 shadow-sm"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePrincipal(m.id)}
                    className={cn(
                      'shrink-0 hover:bg-blue-50',
                      m.isPrincipal
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-300 hover:text-blue-400',
                    )}
                    title={m.isPrincipal ? 'Contato Principal' : 'Tornar Principal'}
                  >
                    <Star className="w-5 h-5" fill={m.isPrincipal ? 'currentColor' : 'none'} />
                  </Button>
                  <Select value={m.type} onValueChange={(v) => updateMethod(m.id, 'type', v)}>
                    <SelectTrigger className="w-[140px] focus:ring-blue-500 border-blue-200 bg-blue-50/30 font-medium text-blue-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="flex-1 focus-visible:ring-blue-500 border-blue-200 bg-blue-50/30 text-blue-950 placeholder:text-blue-300"
                    value={m.value}
                    onChange={(e) => updateMethod(m.id, 'value', e.target.value)}
                    placeholder={`Digite o ${m.type}...`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMethod(m.id)}
                    className="text-rose-500 shrink-0 hover:bg-rose-50 hover:text-rose-700"
                    title="Remover Canal"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="border-t border-blue-100 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-200 text-blue-800 hover:bg-blue-50"
          >
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md px-6"
            onClick={handleSave}
          >
            Salvar Contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
