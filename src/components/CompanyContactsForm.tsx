import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Users, Plus, Trash2, Mail, Phone, MessageCircle } from 'lucide-react'
import { Contact } from '@/stores/useCrmStore'

const METHOD_TYPES = [
  { id: 'email', label: 'E-mails', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApps', icon: MessageCircle },
  { id: 'phone', label: 'Telefones', icon: Phone },
] as const

export function CompanyContactsForm({
  contacts,
  setContacts,
  isReadOnly = false,
}: {
  contacts: Partial<Contact>[]
  setContacts: (c: Partial<Contact>[]) => void
  isReadOnly?: boolean
}) {
  const addContact = () => {
    if (isReadOnly) return
    setContacts([
      ...contacts,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        methods: [{ id: Math.random().toString(), type: 'email', value: '', isPrincipal: true }],
      },
    ])
  }

  const removeContact = (index: number) => {
    if (isReadOnly) return
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const updateContactName = (index: number, name: string) => {
    if (isReadOnly) return
    const newC = [...contacts]
    newC[index].name = name
    setContacts(newC)
  }

  const addMethod = (cIdx: number, type: 'email' | 'whatsapp' | 'phone') => {
    if (isReadOnly) return
    const newC = [...contacts]
    if (!newC[cIdx].methods) newC[cIdx].methods = []
    newC[cIdx].methods!.push({
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: '',
      isPrincipal: newC[cIdx].methods!.filter((m) => m.type === type).length === 0,
    })
    setContacts(newC)
  }

  const updateMethod = (cIdx: number, mId: string, value: string) => {
    if (isReadOnly) return
    const newC = [...contacts]
    const m = newC[cIdx].methods?.find((m) => m.id === mId)
    if (m) m.value = value
    setContacts(newC)
  }

  const removeMethod = (cIdx: number, mId: string) => {
    if (isReadOnly) return
    const newC = [...contacts]
    newC[cIdx].methods = newC[cIdx].methods?.filter((m) => m.id !== mId)
    setContacts(newC)
  }

  const togglePrincipal = (cIdx: number, mId: string, type: string) => {
    if (isReadOnly) return
    const newC = [...contacts]
    newC[cIdx].methods?.forEach((m) => {
      if (m.type === type) {
        m.isPrincipal = m.id === mId
      }
    })
    setContacts(newC)
  }

  return (
    <Card className="shadow-sm border-slate-200 bg-white mt-6">
      <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
          <Users className="w-4 h-4 text-primary" /> Contatos Ilimitados
        </CardTitle>
        <Button
          type="button"
          size="sm"
          disabled={isReadOnly}
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
          onClick={addContact}
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Pessoa
        </Button>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-8">
        {contacts.map((c, i) => (
          <div
            key={c.id || i}
            className="flex flex-col bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200 relative shadow-sm"
          >
            {contacts.length > 1 && !isReadOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 absolute top-3 right-3"
                onClick={() => removeContact(i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="space-y-2 w-full md:w-1/2 pr-8 md:pr-0 mb-6">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Nome da Pessoa
              </Label>
              <Input
                value={c.name}
                placeholder="Ex: João Silva"
                disabled={isReadOnly}
                className="bg-white focus-visible:ring-primary border-slate-300 font-bold text-slate-900"
                onChange={(e) => updateContactName(i, e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-slate-200 pt-5">
              {METHOD_TYPES.map((typeDef) => {
                const methodsOfType = c.methods?.filter((m) => m.type === typeDef.id) || []
                return (
                  <div key={typeDef.id} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <typeDef.icon className="w-4 h-4 text-secondary" /> {typeDef.label}
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isReadOnly}
                        className="h-6 px-2 text-[10px] text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => addMethod(i, typeDef.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {methodsOfType.map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-col gap-2 group bg-white p-2 rounded-md border border-slate-100 shadow-sm"
                        >
                          <div className="flex gap-2 items-center">
                            <Input
                              value={m.value}
                              disabled={isReadOnly}
                              placeholder={typeDef.id === 'email' ? 'email@...' : '(00) 0000-0000'}
                              className="bg-slate-50 h-8 text-sm focus-visible:ring-primary border-slate-200"
                              onChange={(e) => updateMethod(i, m.id, e.target.value)}
                            />
                            {!isReadOnly && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                onClick={() => removeMethod(i, m.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 px-1 justify-end">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer">
                              Principal
                            </Label>
                            <Switch
                              checked={m.isPrincipal}
                              disabled={isReadOnly}
                              onCheckedChange={() => togglePrincipal(i, m.id, typeDef.id)}
                              className="data-[state=checked]:bg-emerald-500 h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
                            />
                          </div>
                        </div>
                      ))}
                      {methodsOfType.length === 0 && (
                        <p className="text-xs text-slate-400 italic">Nenhum adicionado.</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="text-center py-6 text-sm text-slate-500 font-medium bg-slate-50 rounded-lg border border-dashed border-slate-300">
            Nenhum contato adicionado. Clique no botão acima para adicionar.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
