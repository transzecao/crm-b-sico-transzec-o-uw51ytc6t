import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, Edit, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'
import { BrainAnalysis } from '@/components/BrainAnalysis'
import { InteractionsTimeline } from '@/components/InteractionsTimeline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function Company360() {
  const { id } = useParams()
  const { state } = useCrmStore()
  const company = state.companies.find((c) => c.id === id)

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Building2 className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Empresa não encontrada</h2>
        <Button asChild variant="outline">
          <Link to="/empresas">Voltar</Link>
        </Button>
      </div>
    )
  }

  const contacts = state.contacts
    .filter((c) => c.companyId === company.id)
    .sort((a, b) => (a.isPrincipal ? -1 : 1))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {company.razaoSocial || company.nomeFantasia || 'Sem Nome'}
            </h1>
            <p className="text-muted-foreground">
              CNPJ: {company.cnpj} | {company.tipoCarga || 'Carga N/A'}
            </p>
          </div>
        </div>
        {!['Diretoria', 'Coleta'].includes(state.role) && (
          <Button variant="outline" asChild>
            <Link to={`/empresa/${company.id}/editar`}>
              <Edit className="w-4 h-4 mr-2" /> Editar Perfil
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <BrainAnalysis />

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 p-0 px-2">
                  <TabsTrigger
                    value="timeline"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Interações
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Detalhes da Empresa
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Descrição do Negócio
                  </TabsTrigger>
                </TabsList>
                <div className="p-6">
                  <TabsContent value="timeline" className="mt-0">
                    <InteractionsTimeline />
                  </TabsContent>
                  <TabsContent value="details" className="mt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                        <p className="text-sm">{company.endereco || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tipo de Carga</p>
                        <p className="text-sm">{company.tipoCarga || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
                        <p className="text-sm">{company.razaoSocial || '-'}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="business" className="mt-0">
                    {company.descricaoNegocio ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {company.descricaoNegocio}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Nenhuma descrição cadastrada para esta empresa.
                      </p>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-muted/30">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Contatos Vinculados</h3>
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-background p-3 rounded-md border shadow-sm relative"
                >
                  {contact.isPrincipal && (
                    <div className="absolute top-3 right-3" title="Contato Principal">
                      <Star className="w-4 h-4 text-warning" fill="currentColor" />
                    </div>
                  )}
                  <p className="font-medium text-sm pr-6">{contact.name}</p>
                  <div className="mt-2 space-y-1">
                    {contact.methods
                      .sort((a, b) => (a.isPrincipal ? -1 : 1))
                      .map((m) => (
                        <p
                          key={m.id}
                          className="text-xs text-muted-foreground flex items-center gap-1.5"
                        >
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1 py-0 h-4 uppercase"
                          >
                            {m.type}
                          </Badge>
                          <span className={m.isPrincipal ? 'font-medium text-foreground' : ''}>
                            {m.value}
                          </span>
                          {m.isPrincipal && (
                            <Star className="w-3 h-3 text-warning/70 ml-auto" fill="currentColor" />
                          )}
                        </p>
                      ))}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum contato cadastrado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
