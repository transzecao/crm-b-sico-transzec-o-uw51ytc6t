import { Plus, Trash, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="shadow-sm border-slate-200/60 overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-6 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
          <Users className="w-4 h-4 text-primary" /> Contatos
        </CardTitle>
        <Button
          type="button"
          onClick={addContact}
          variant="outline"
          size="sm"
          className="h-8 bg-white text-slate-600"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Novo Contato
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className={cn(
              'p-5 border rounded-xl shadow-sm relative transition-all',
              contact.isPrincipal
                ? 'bg-amber-50/20 border-amber-200/80'
                : 'bg-white border-slate-200',
            )}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => togglePrincipal(index)}
                className={cn(
                  'p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider',
                  contact.isPrincipal
                    ? 'text-amber-600 bg-amber-100'
                    : 'text-slate-400 hover:bg-slate-100',
                )}
                title="Contato Principal"
              >
                <Star
                  className="w-3.5 h-3.5"
                  fill={contact.isPrincipal ? 'currentColor' : 'none'}
                />
                {contact.isPrincipal && <span className="pr-1">Principal</span>}
              </button>
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                title="Remover Contato"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="w-full max-w-md">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Nome do Contato
                </Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                  className="bg-white"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-slate-100/80">
                {['email', 'whatsapp', 'phone'].map((type) => {
                  const methods = contact.methods?.filter((m) => m.type === type) || []
                  const labels: Record<string, string> = {
                    email: 'E-mails',
                    whatsapp: 'WhatsApp',
                    phone: 'Telefones',
                  }
                  return (
                    <div key={type} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {labels[type]}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] font-bold tracking-wider uppercase text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => addMethod(index, type as any)}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {methods.length === 0 && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-50/50 border border-slate-100 rounded px-3 py-1.5 inline-block">
                            Nenhum cadastrado
                          </p>
                        )}
                        {methods.map((m) => (
                          <div key={m.id} className="flex items-center gap-2 group">
                            <Input
                              value={m.value}
                              onChange={(e) => updateMethod(index, m.id, e.target.value)}
                              className="h-9 text-sm bg-white"
                              placeholder="Inserir..."
                            />
                            <button
                              type="button"
                              onClick={() => removeMethod(index, m.id)}
                              className="text-red-400 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded transition-all shrink-0"
                            >
                              <Trash className="w-3.5 h-3.5" />
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
      </CardContent>
    </Card>
  )
}
