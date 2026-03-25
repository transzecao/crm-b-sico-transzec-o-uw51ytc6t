import { useState } from 'react'
import { Plus, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useCrmStore, { Contact } from '@/stores/useCrmStore'
import { ContatoModal } from '@/components/ContatoModal'

export default function Contatos() {
  const { state } = useCrmStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()

  const canEdit = ![
    'Diretoria',
    'Coleta',
    'Financeiro',
    'Supervisor Financeiro',
    'Supervisor Coleta',
  ].includes(state.role)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20 text-secondary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contatos</h1>
            <p className="text-slate-500 font-medium mt-1">
              Diretório de pessoas vinculadas às contas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {state.contacts.map((contact) => {
          const company = state.companies.find((c) => c.id === contact.companyId)
          const principal = contact.methods.find((m) => m.isPrincipal) || contact.methods[0]

          return (
            <Card
              key={contact.id}
              className="border-slate-200 bg-white hover:border-primary/50 hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">
                      {company?.nomeFantasia || 'Sem Empresa'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Contato Principal
                  </p>
                  {principal && (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-lg shadow-inner">
                      <div className="bg-white p-1 rounded-md shadow-sm border border-slate-100">
                        <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {principal.type}
                        </span>
                        <span className="text-sm truncate font-bold text-slate-800">
                          {principal.value}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {modalOpen && (
        <ContatoModal open={modalOpen} onOpenChange={setModalOpen} contact={selectedContact} />
      )}
    </div>
  )
}
