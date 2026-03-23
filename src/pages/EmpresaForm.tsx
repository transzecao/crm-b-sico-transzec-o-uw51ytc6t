import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash, Star, Save, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatCnpj } from '@/utils/formatters'
import useCrmStore, { Company, Contact } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function EmpresaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'geral'

  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const existingCompany = id ? state.companies.find((c) => c.id === id) : undefined
  const existingContacts = id ? state.contacts.filter((c) => c.companyId === id) : []

  const [formData, setFormData] = useState<Partial<Company>>({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    tipoCarga: '',
    endereco: '',
    descricaoNegocio: '',
  })

  const [contacts, setContacts] = useState<Partial<Contact>[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingCompany) {
      setFormData(existingCompany)
      setContacts(JSON.parse(JSON.stringify(existingContacts)))
    } else {
      setContacts([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (id && !existingCompany && state.companies.length > 0) {
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

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val })
  }

  const handleSave = () => {
    const rawCnpj = formData.cnpj?.replace(/\D/g, '') || ''
    if (rawCnpj.length !== 14) {
      setError('CNPJ inválido. Deve conter exatamente 14 números.')
      setSearchParams({ tab: 'geral' })
      return
    }
    setError('')

    const companyId = existingCompany ? existingCompany.id : Math.random().toString(36).substr(2, 9)
    const newCompany = { ...formData, id: companyId } as Company

    const finalContacts = contacts.map((c) => ({
      ...c,
      id: c.id || Math.random().toString(36).substr(2, 9),
      companyId,
      name: c.name || 'Sem Nome',
      methods: c.methods || [],
    })) as Contact[]

    if (existingCompany) {
      updateState({
        companies: state.companies.map((c) => (c.id === companyId ? newCompany : c)),
        contacts: [...state.contacts.filter((c) => c.companyId !== companyId), ...finalContacts],
      })
      toast({ title: 'Empresa atualizada com sucesso' })
    } else {
      updateState({
        companies: [...state.companies, newCompany],
        contacts: [...state.contacts, ...finalContacts],
      })
      toast({ title: 'Empresa criada com sucesso' })
    }

    navigate('/empresas')
  }

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

  const updateContact = (index: number, field: string, value: any) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setContacts(newContacts)
  }

  const removeContact = (index: number) => {
    const newContacts = [...contacts]
    newContacts.splice(index, 1)
    if (newContacts.length > 0 && !newContacts.find((c) => c.isPrincipal)) {
      newContacts[0].isPrincipal = true
    }
    setContacts(newContacts)
  }

  const togglePrincipalContact = (index: number) => {
    const newContacts = contacts.map((c, i) => ({ ...c, isPrincipal: i === index }))
    setContacts(newContacts)
  }

  const addMethod = (contactIndex: number, type: 'email' | 'whatsapp' | 'phone') => {
    const newContacts = [...contacts]
    const currentMethods = newContacts[contactIndex].methods || []
    newContacts[contactIndex].methods = [
      ...currentMethods,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        value: '',
        isPrincipal: currentMethods.length === 0,
      },
    ]
    setContacts(newContacts)
  }

  const updateMethod = (contactIndex: number, methodId: string, value: string) => {
    const newContacts = [...contacts]
    const methods = newContacts[contactIndex].methods || []
    newContacts[contactIndex].methods = methods.map((m) =>
      m.id === methodId ? { ...m, value } : m,
    )
    setContacts(newContacts)
  }

  const removeMethod = (contactIndex: number, methodId: string) => {
    const newContacts = [...contacts]
    let methods = newContacts[contactIndex].methods || []
    methods = methods.filter((m) => m.id !== methodId)
    if (methods.length > 0 && !methods.find((m) => m.isPrincipal)) {
      methods[0].isPrincipal = true
    }
    newContacts[contactIndex].methods = methods
    setContacts(newContacts)
  }

  const togglePrincipalMethod = (contactIndex: number, methodId: string) => {
    const newContacts = [...contacts]
    const methods = newContacts[contactIndex].methods || []
    newContacts[contactIndex].methods = methods.map((m) => ({
      ...m,
      isPrincipal: m.id === methodId,
    }))
    setContacts(newContacts)
  }

  const sortedContacts = [...contacts].sort((a, b) => (a.isPrincipal ? -1 : 1))

  const renderMethodGroup = (
    contactIndex: number,
    title: string,
    type: 'email' | 'whatsapp' | 'phone',
    methods: any[],
  ) => {
    const groupMethods = methods
      .filter((m) => m.type === type)
      .sort((a, b) => (a.isPrincipal ? -1 : 1))

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <Label className="text-sm font-semibold">{title}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addMethod(contactIndex, type)}
          >
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>
        {groupMethods.length === 0 && (
          <p className="text-xs text-muted-foreground">Nenhum {title.toLowerCase()} cadastrado.</p>
        )}
        <div className="space-y-2">
          {groupMethods.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => togglePrincipalMethod(contactIndex, m.id)}
                className={cn(
                  'shrink-0 h-8 w-8',
                  m.isPrincipal ? 'text-warning' : 'text-muted-foreground',
                )}
                title="Marcar como principal"
              >
                <Star className="w-4 h-4" fill={m.isPrincipal ? 'currentColor' : 'none'} />
              </Button>
              <Input
                value={m.value}
                onChange={(e) => updateMethod(contactIndex, m.id, e.target.value)}
                placeholder={`Digite o ${type}...`}
                className="h-8"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMethod(contactIndex, m.id)}
                className="text-destructive shrink-0 h-8 w-8"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {existingCompany ? 'Editar Empresa' : 'Nova Empresa'}
            </h1>
            <p className="text-muted-foreground">
              {existingCompany
                ? 'Atualize os dados e contatos'
                : 'Cadastre um novo cliente ou prospect'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" /> Salvar
        </Button>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="geral" className="py-2">
            Informações Gerais
          </TabsTrigger>
          <TabsTrigger value="contatos" className="py-2">
            Contatos
          </TabsTrigger>
          <TabsTrigger value="descricao" className="py-2">
            Descrição do Negócio
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="geral" className="m-0 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">
                    CNPJ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })}
                    maxLength={18}
                    placeholder="00.000.000/0000-00"
                    className={error ? 'border-destructive' : ''}
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razao">Razão Social</Label>
                    <Input
                      id="razao"
                      value={formData.razaoSocial}
                      onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fantasia">Nome Fantasia</Label>
                    <Input
                      id="fantasia"
                      value={formData.nomeFantasia}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carga">Tipo de Carga (Informativo)</Label>
                  <Input
                    id="carga"
                    value={formData.tipoCarga}
                    onChange={(e) => setFormData({ ...formData, tipoCarga: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contatos" className="m-0 space-y-4">
            {sortedContacts.map((contact) => {
              const originalIndex = contacts.findIndex((c) => c.id === contact.id)
              return (
                <Card key={contact.id} className="border-muted-foreground/20">
                  <CardHeader className="pb-4 bg-muted/20 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3 w-full max-w-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePrincipalContact(originalIndex)}
                        className={cn(
                          'shrink-0',
                          contact.isPrincipal ? 'text-warning' : 'text-muted-foreground',
                        )}
                        title="Marcar como contato principal"
                      >
                        <Star
                          className="w-5 h-5"
                          fill={contact.isPrincipal ? 'currentColor' : 'none'}
                        />
                      </Button>
                      <Input
                        value={contact.name}
                        onChange={(e) => updateContact(originalIndex, 'name', e.target.value)}
                        placeholder="Nome do Contato (ex: João Silva)"
                        className="font-semibold text-base"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => removeContact(originalIndex)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 grid md:grid-cols-3 gap-6">
                    {renderMethodGroup(originalIndex, 'E-mails', 'email', contact.methods || [])}
                    {renderMethodGroup(
                      originalIndex,
                      'WhatsApp',
                      'whatsapp',
                      contact.methods || [],
                    )}
                    {renderMethodGroup(originalIndex, 'Telefones', 'phone', contact.methods || [])}
                  </CardContent>
                </Card>
              )
            })}

            {contacts.length === 0 && (
              <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground mb-4">Nenhum contato adicionado ainda.</p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={addContact}
              className="w-full border-dashed h-12"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Contato
            </Button>
          </TabsContent>

          <TabsContent value="descricao" className="m-0 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Detalhes e Natureza do Negócio</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva aqui os detalhes da operação, perfil do cliente, principais dores, etc..."
                    value={formData.descricaoNegocio}
                    onChange={(e) => setFormData({ ...formData, descricaoNegocio: e.target.value })}
                    className="min-h-[250px] resize-y text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Estas informações ajudam a equipe a entender melhor o contexto do cliente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
