import { useState } from 'react'
import { Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useCrmStore, { Contact } from '@/stores/useCrmStore'
import { ContatoModal } from '@/components/ContatoModal'
import { Badge } from '@/components/ui/badge'

export default function Contatos() {
  const { state } = useCrmStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>()

  const canEdit = !['Diretoria'].includes(state.role)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-950">Contatos</h1>
          <p className="text-orange-700/80">Gerencie as pessoas vinculadas às empresas.</p>
        </div>
        {canEdit && (
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => {
              setSelectedContact(undefined)
              setModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Contato
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.contacts.map((contact) => {
          const company = state.companies.find((c) => c.id === contact.companyId)
          const principal = contact.methods.find((m) => m.isPrincipal) || contact.methods[0]

          return (
            <Card
              key={contact.id}
              className="relative overflow-hidden group border-orange-100 hover:border-orange-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-orange-50/30"
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-orange-950">{contact.name}</h3>
                    <p className="text-sm text-orange-800/70">
                      {company?.razaoSocial || 'Empresa desconhecida'}
                    </p>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                      onClick={() => {
                        setSelectedContact(contact)
                        setModalOpen(true)
                      }}
                    >
                      Editar
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800/60">Contato Principal:</p>
                  {principal && (
                    <div className="flex items-center gap-2 bg-orange-50/80 border border-orange-100 p-2 rounded-md">
                      <Star className="w-4 h-4 text-orange-500" fill="currentColor" />
                      <Badge
                        variant="outline"
                        className="capitalize border-orange-200 text-orange-800 bg-white"
                      >
                        {principal.type}
                      </Badge>
                      <span className="text-sm truncate font-medium text-orange-900">
                        {principal.value}
                      </span>
                    </div>
                  )}
                  {contact.methods.length > 1 && (
                    <p className="text-xs text-orange-600/70 mt-2">
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
