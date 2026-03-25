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
    // Make others of the same type not principal
    newC[cIdx].methods?.forEach((m) => {
      if (m.type === type) {
        m.isPrincipal = m.id === mId
      }
    })
    setContacts(newC)
  }

  return (
    <Card className="shadow-sm border-blue-100/60 bg-white/80 backdrop-blur-sm mt-6">
      <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-3.5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
          <Users className="w-4 h-4 text-blue-600" /> Lista de Contatos
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isReadOnly}
          className="border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={addContact}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Contato
        </Button>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-8">
        {contacts.map((c, i) => (
          <div
            key={c.id || i}
            className="flex flex-col bg-slate-50/50 p-4 md:p-5 rounded-xl border border-slate-200 relative shadow-sm"
          >
            {contacts.length > 1 && !isReadOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 absolute top-2 right-2"
                onClick={() => removeContact(i)}
                aria-label="Remover Contato"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="space-y-2 w-full md:w-1/2 pr-8 md:pr-0 mb-4">
              <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Nome do Contato
              </Label>
              <Input
                value={c.name}
                placeholder="Ex: João Silva"
                disabled={isReadOnly}
                className="bg-white focus-visible:ring-blue-500/50 border-slate-300 font-medium text-slate-800"
                onChange={(e) => updateContactName(i, e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-slate-200 pt-4">
              {METHOD_TYPES.map((typeDef) => {
                const methodsOfType = c.methods?.filter((m) => m.type === typeDef.id) || []
                return (
                  <div key={typeDef.id} className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <typeDef.icon className="w-3.5 h-3.5 text-blue-500" /> {typeDef.label}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isReadOnly}
                        className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                        onClick={() => addMethod(i, typeDef.id)}
                        aria-label={`Adicionar ${typeDef.label}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {methodsOfType.map((m) => (
                        <div key={m.id} className="flex flex-col gap-1.5 group">
                          <div className="flex gap-2 items-center">
                            <Input
                              value={m.value}
                              disabled={isReadOnly}
                              placeholder={typeDef.id === 'email' ? 'email@...' : '(00) 0000-0000'}
                              className="bg-white h-8 text-sm focus-visible:ring-blue-500/50"
                              onChange={(e) => updateMethod(i, m.id, e.target.value)}
                            />
                            {!isReadOnly && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMethod(i, m.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <Switch
                              checked={m.isPrincipal}
                              disabled={isReadOnly}
                              onCheckedChange={() => togglePrincipal(i, m.id, typeDef.id)}
                              className="data-[state=checked]:bg-blue-600 h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
                            />
                            <Label className="text-[10px] font-medium text-slate-500 cursor-pointer">
                              Principal
                            </Label>
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
          <div className="text-center py-6 text-sm text-slate-500 font-medium">
            Nenhum contato adicionado.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
