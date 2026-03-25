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
import { useToast } from '@/hooks/use-toast'

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

  const [name, setName] = useState('')
  const [companyId, setCompanyId] = useState('')

  useEffect(() => {
    if (open) {
      if (contact) {
        setName(contact.name)
        setCompanyId(contact.companyId)
      } else {
        setName('')
        setCompanyId(state.companies[0]?.id || '')
      }
    }
  }, [open, contact, state.companies])

  const handleSave = () => {
    if (!name.trim() || !companyId) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
      })
      return
    }

    const updatedContacts = [...state.contacts]

    if (contact) {
      const idx = updatedContacts.findIndex((c) => c.id === contact.id)
      if (idx >= 0) {
        updatedContacts[idx] = { ...contact, name, companyId }
      }
    } else {
      updatedContacts.push({
        id: Math.random().toString(36).substr(2, 9),
        companyId,
        name,
        methods: [],
      })
    }

    updateState({ contacts: updatedContacts })
    toast({ title: 'Sucesso', description: 'Contato salvo com sucesso!' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold text-slate-700">
              Nome do Contato
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria Souza"
              className="focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Empresa Vinculada</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className="focus:ring-primary">
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
