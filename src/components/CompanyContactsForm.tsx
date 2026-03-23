import { Plus, Trash, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Contact } from '@/stores/useCrmStore'
import { cn } from '@/lib/utils'

interface Props {
  contacts: Partial<Contact>[]
  setContacts: (contacts: Partial<Contact>[]) => void
}

export function CompanyContactsForm({ contacts, setContacts }: Props) {
  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        isPrincipal: contacts.length === 0,
        methods: [
          {
            id: Math.random().toString(36).substr(2, 9),
            type: 'email',
            value: '',
            isPrincipal: true,
          },
        ],
      },
    ])
  }

  const updateContact = (idx: number, field: string, value: any) => {
    const newContacts = [...contacts]
    newContacts[idx] = { ...newContacts[idx], [field]: value }
    setContacts(newContacts)
  }

  const removeContact = (idx: number) => {
    const newContacts = [...contacts]
    newContacts.splice(idx, 1)
    if (newContacts.length > 0 && !newContacts.find((c) => c.isPrincipal)) {
      newContacts[0].isPrincipal = true
    }
    setContacts(newContacts)
  }

  const togglePrincipal = (idx: number) => {
    setContacts(contacts.map((c, i) => ({ ...c, isPrincipal: i === idx })))
  }

  const addMethod = (idx: number, type: 'email' | 'whatsapp' | 'phone') => {
    const newContacts = [...contacts]
    newContacts[idx].methods = [
      ...(newContacts[idx].methods || []),
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        value: '',
        isPrincipal: false,
      },
    ]
    setContacts(newContacts)
  }

  const updateMethod = (idx: number, mId: string, value: string) => {
    const newContacts = [...contacts]
    newContacts[idx].methods = newContacts[idx].methods?.map((m) =>
      m.id === mId ? { ...m, value } : m,
    )
    setContacts(newContacts)
  }

  const removeMethod = (idx: number, mId: string) => {
    const newContacts = [...contacts]
    newContacts[idx].methods = newContacts[idx].methods?.filter((m) => m.id !== mId)
    setContacts(newContacts)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Users className="w-5 h-5" /> Contatos
        </h2>
        <Button type="button" onClick={addContact} variant="outline" size="sm" className="h-8">
          <Plus className="w-4 h-4 mr-1" /> Novo Contato
        </Button>
      </div>
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className={cn(
              'p-5 border rounded-lg shadow-sm relative',
              contact.isPrincipal ? 'bg-amber-50/30 border-amber-200' : 'bg-white',
            )}
          >
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => togglePrincipal(index)}
                className={cn(
                  'p-1.5 rounded-full',
                  contact.isPrincipal ? 'text-amber-500 bg-amber-100' : 'text-slate-300',
                )}
                title="Principal"
              >
                <Star className="w-4 h-4" fill={contact.isPrincipal ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="w-full max-w-sm">
                <Label className="text-xs text-slate-500">Nome do Contato</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                  className="h-9 mt-1"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                {['email', 'whatsapp', 'phone'].map((type) => {
                  const methods = contact.methods?.filter((m) => m.type === type) || []
                  const labels: Record<string, string> = {
                    email: 'E-mails',
                    whatsapp: 'WhatsApp',
                    phone: 'Telefones',
                  }
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {labels[type]}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50"
                          onClick={() => addMethod(index, type as any)}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {methods.length === 0 && (
                          <p className="text-xs text-slate-400 italic">Nenhum</p>
                        )}
                        {methods.map((m) => (
                          <div key={m.id} className="flex items-center gap-1.5 group">
                            <Input
                              value={m.value}
                              onChange={(e) => updateMethod(index, m.id, e.target.value)}
                              className="h-8 text-xs bg-slate-50"
                              placeholder={`Inserir...`}
                            />
                            <button
                              type="button"
                              onClick={() => removeMethod(index, m.id)}
                              className="text-red-400 opacity-0 group-hover:opacity-100 p-1"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
