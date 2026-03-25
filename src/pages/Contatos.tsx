import { useState } from 'react'
import { Plus, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useCrmStore, { Contact } from '@/stores/useCrmStore'
import { ContatoModal } from '@/components/ContatoModal'
import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-6 bg-blue-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-blue-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100/60 p-3 rounded-xl border border-blue-200/50 text-blue-600 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">Contatos</h1>
            <p className="text-blue-700/80 font-medium mt-1">
              Gerencie as pessoas vinculadas às contas comerciais.
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
            onClick={() => {
              setSelectedContact(undefined)
              setModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Contato
          </Button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {state.contacts.map((contact) => {
          const company = state.companies.find((c) => c.id === contact.companyId)
          const principal = contact.methods.find((m) => m.isPrincipal) || contact.methods[0]

          return (
            <Card
              key={contact.id}
              className="relative overflow-hidden group border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/40 pointer-events-none" />
              <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-bold text-lg text-blue-950 leading-tight">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-blue-700/80 font-medium mt-0.5">
                      {company?.razaoSocial || 'Empresa desconhecida'}
                    </p>
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                      onClick={() => {
                        setSelectedContact(contact)
                        setModalOpen(true)
                      }}
                    >
                      Editar
                    </Button>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-blue-100/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-800/60">
                    Contato Principal
                  </p>
                  {principal && (
                    <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-100 p-2.5 rounded-lg shadow-sm">
                      <div className="bg-white p-1 rounded-md shadow-sm border border-blue-100">
                        <Star className="w-4 h-4 text-blue-500" fill="currentColor" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-blue-600/70">
                          {principal.type}
                        </span>
                        <span className="text-sm truncate font-semibold text-blue-950">
                          {principal.value}
                        </span>
                      </div>
                    </div>
                  )}
                  {contact.methods.length > 1 && (
                    <p className="text-xs font-medium text-blue-600/70 pt-1 text-center bg-blue-50/30 rounded py-1">
                      + {contact.methods.length - 1} outros meios cadastrados
                    </p>
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
