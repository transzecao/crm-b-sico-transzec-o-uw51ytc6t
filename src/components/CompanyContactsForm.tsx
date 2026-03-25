import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, Plus, Trash2 } from 'lucide-react'

export function CompanyContactsForm({
  contacts,
  setContacts,
}: {
  contacts: any[]
  setContacts: any
}) {
  return (
    <Card className="shadow-sm border-blue-100/60 bg-white/80 backdrop-blur-sm mt-6">
      <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-3.5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
          <Users className="w-4 h-4 text-blue-600" /> Contatos Principais
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={() =>
            setContacts([
              ...contacts,
              { id: Math.random().toString(), name: '', methods: [{ type: 'email', value: '' }] },
            ])
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Contato
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {contacts.map((c, i) => (
          <div
            key={c.id || i}
            className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-slate-50/50 p-4 rounded-lg border border-slate-100 relative"
          >
            <div className="flex-1 space-y-2 w-full">
              <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Nome do Contato
              </Label>
              <Input
                value={c.name}
                placeholder="Ex: João Silva"
                className="bg-white focus-visible:ring-blue-500/50"
                onChange={(e) => {
                  const newC = [...contacts]
                  newC[i].name = e.target.value
                  setContacts(newC)
                }}
              />
            </div>
            <div className="flex-1 space-y-2 w-full">
              <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Meio Principal (E-mail/Tel)
              </Label>
              <Input
                value={c.methods?.[0]?.value || ''}
                placeholder="Ex: joao@empresa.com"
                className="bg-white focus-visible:ring-blue-500/50"
                onChange={(e) => {
                  const newC = [...contacts]
                  if (!newC[i].methods) newC[i].methods = [{ type: 'email', value: '' }]
                  newC[i].methods[0].value = e.target.value
                  setContacts(newC)
                }}
              />
            </div>
            {contacts.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 absolute top-2 right-2 md:static"
                onClick={() => setContacts(contacts.filter((_: any, idx: number) => idx !== i))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
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
