import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  RefreshCw,
  Settings,
  FileText,
  ChevronDown,
  Plus,
  Trash,
  Star,
  Save,
  Link as LinkIcon,
  Briefcase,
  Building2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCnpj } from '@/utils/formatters'
import useCrmStore, { Company, Contact } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PIPELINE_STAGES = [
  'LEAD NOVO',
  'CONTATO/CONEXÃO',
  'QUALIFICAÇÃO/PROPOSTA',
  'NEGOCIAÇÃO',
  'FECHAR NEGÓCIO',
]

export default function EmpresaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
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
    siteProspectado: '',
    sitePesquisado: '',
  })

  const [contacts, setContacts] = useState<Partial<Contact>[]>([])
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('contatos')

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
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h2 className="text-2xl font-bold">Empresa não encontrada</h2>
        <Button asChild variant="outline">
          <Link to="/empresas">Voltar</Link>
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    const rawCnpj = formData.cnpj?.replace(/\D/g, '') || ''
    if (rawCnpj.length !== 14) {
      setError('CNPJ inválido. Deve conter exatamente 14 números.')
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
      toast({ title: 'Dados salvos com sucesso!' })
    } else {
      updateState({
        companies: [...state.companies, newCompany],
        contacts: [...state.contacts, ...finalContacts],
      })
      toast({ title: 'Empresa e contatos criados com sucesso!' })
    }
    navigate('/empresas')
  }

  // Contact Handlers
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
    setContacts(contacts.map((c, i) => ({ ...c, isPrincipal: i === index })))
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

  const renderMethodGroup = (contactIndex: number, type: 'email' | 'whatsapp' | 'phone') => {
    const labels = { email: 'E-mails', whatsapp: 'WhatsApp', phone: 'Telefones' }
    const contactMethods = contacts[contactIndex].methods || []
    const groupMethods = contactMethods
      .filter((m) => m.type === type)
      .sort((a, b) => (a.isPrincipal ? -1 : 1))

    return (
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {labels[type]}
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addMethod(contactIndex, type)}
            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>
        {groupMethods.length === 0 && (
          <p className="text-xs text-slate-400 italic">Nenhum cadastrado</p>
        )}
        {groupMethods.map((m) => (
          <div key={m.id} className="flex items-center gap-2 group">
            <button
              type="button"
              onClick={() => togglePrincipalMethod(contactIndex, m.id)}
              className={cn(
                'transition-colors p-1 rounded hover:bg-slate-100',
                m.isPrincipal ? 'text-amber-400' : 'text-slate-300 hover:text-slate-400',
              )}
              title="Marcar como principal"
            >
              <Star className="w-4 h-4" fill={m.isPrincipal ? 'currentColor' : 'none'} />
            </button>
            <Input
              value={m.value}
              onChange={(e) => updateMethod(contactIndex, m.id, e.target.value)}
              placeholder={`Inserir ${type}...`}
              className="h-8 text-sm bg-white"
            />
            <button
              type="button"
              onClick={() => removeMethod(contactIndex, m.id)}
              className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  const sortedContacts = [...contacts].sort((a, b) => (a.isPrincipal ? -1 : 1))

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -mx-4 -mt-4 bg-slate-50 text-slate-800 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            {existingCompany ? `Empresa: ${formData.razaoSocial || 'Sem Nome'}` : 'Nova Empresa'}
          </h1>
          <div className="flex items-center gap-1 text-sm bg-slate-100 px-3 py-1 rounded text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors border border-slate-200">
            Pipeline Prospecção <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-4 border-r pr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full">
              <Mail className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1 ml-1">
              Extensões <ChevronDown className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              Documento <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => navigate('/empresas')} className="h-8">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" /> Salvar Dados
          </Button>
        </div>
      </div>

      {/* Pipeline Status Bar (Visual only for layout requirement) */}
      <div className="flex bg-slate-100 p-3 pb-0 px-6 gap-1 overflow-x-auto border-b">
        {PIPELINE_STAGES.map((stage, i) => (
          <div
            key={stage}
            className={cn(
              'relative flex items-center justify-center px-4 py-2 text-[10px] font-bold uppercase tracking-wide flex-1 min-w-[140px] transition-colors',
              i === 0
                ? 'bg-blue-400 text-white rounded-t-md'
                : i === 1
                  ? 'bg-blue-300 text-white rounded-t-md'
                  : 'bg-slate-200 text-slate-500 rounded-t-md border-b-2 border-transparent',
              i === 0 && 'border-b-2 border-blue-500',
            )}
            style={{
              clipPath:
                i === 0
                  ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                  : i === PIPELINE_STAGES.length - 1
                    ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)'
                    : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
              marginLeft: i > 0 ? '-6px' : '0',
              zIndex: PIPELINE_STAGES.length - i,
            }}
          >
            {stage}
            {i === 0 && (
              <span className="ml-2 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center text-[8px]">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Company Core Data */}
        <div className="w-[320px] lg:w-[380px] bg-white border-r flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Sobre a Empresa
            </h2>
            <span className="text-xs text-blue-500 cursor-pointer hover:underline">editar</span>
          </div>

          <div className="p-5 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500 flex items-center gap-1">
                CNPJ <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                className={cn('h-8 font-medium', error && 'border-red-500 ring-red-500')}
              />
              {error && <p className="text-[10px] text-red-500">{error}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Razão Social / Nome</Label>
              <Input
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                placeholder="Nome da Empresa"
                className="h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Link do site da empresa prospectada
              </Label>
              <Input
                value={formData.siteProspectado}
                onChange={(e) => setFormData({ ...formData, siteProspectado: e.target.value })}
                placeholder="https://..."
                className="h-8 text-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Link do site pesquisado
              </Label>
              <Input
                value={formData.sitePesquisado}
                onChange={(e) => setFormData({ ...formData, sitePesquisado: e.target.value })}
                placeholder="https://..."
                className="h-8 text-blue-600"
              />
            </div>

            <div className="pt-4 border-t space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Detalhes
              </h3>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Endereço Principal</Label>
                <Input
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, Número, Cidade - UF"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Tipo de Carga</Label>
                <Input
                  value={formData.tipoCarga}
                  onChange={(e) => setFormData({ ...formData, tipoCarga: e.target.value })}
                  placeholder="Ex: Seca, Refrigerada"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Area - Tabs & Contacts */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="bg-white border-b px-2">
              <TabsList className="h-12 bg-transparent p-0 border-none gap-6 flex justify-start w-full">
                <TabsTrigger
                  value="contatos"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none px-2 font-medium"
                >
                  Contatos
                </TabsTrigger>
                <TabsTrigger
                  value="descricao"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none px-2 font-medium"
                >
                  Descrição do Negócio
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none px-2 font-medium"
                >
                  Histórico
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Contatos Tab Content */}
              <TabsContent value="contatos" className="m-0 h-full">
                <div className="max-w-4xl space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Gestão de Contatos
                      </h2>
                      <p className="text-sm text-slate-500">
                        Adicione as pessoas responsáveis na empresa e seus canais.
                      </p>
                    </div>
                    <Button
                      onClick={addContact}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Novo Contato
                    </Button>
                  </div>

                  {contacts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                      <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-500 mb-4">Nenhum contato adicionado ainda.</p>
                      <Button onClick={addContact} variant="outline">
                        Adicionar o primeiro contato
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {sortedContacts.map((contact) => {
                        const originalIndex = contacts.findIndex((c) => c.id === contact.id)
                        return (
                          <div
                            key={contact.id}
                            className={cn(
                              'bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200',
                              contact.isPrincipal
                                ? 'border-amber-300 ring-1 ring-amber-100'
                                : 'border-slate-200',
                            )}
                          >
                            <div
                              className={cn(
                                'px-5 py-3 border-b flex items-center justify-between',
                                contact.isPrincipal ? 'bg-amber-50/50' : 'bg-slate-50',
                              )}
                            >
                              <div className="flex items-center gap-3 w-full max-w-md">
                                <button
                                  type="button"
                                  onClick={() => togglePrincipalContact(originalIndex)}
                                  className={cn(
                                    'p-1.5 rounded-full transition-colors',
                                    contact.isPrincipal
                                      ? 'text-amber-500 bg-amber-100'
                                      : 'text-slate-400 hover:bg-slate-200',
                                  )}
                                  title="Definir como Contato Principal"
                                >
                                  <Star
                                    className="w-5 h-5"
                                    fill={contact.isPrincipal ? 'currentColor' : 'none'}
                                  />
                                </button>
                                <Input
                                  value={contact.name}
                                  onChange={(e) =>
                                    updateContact(originalIndex, 'name', e.target.value)
                                  }
                                  placeholder="Nome do Contato (ex: João Silva)"
                                  className="font-semibold text-base border-transparent hover:border-slate-200 focus:border-blue-500 bg-transparent px-2 h-9"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContact(originalIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                Remover
                              </Button>
                            </div>

                            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-8">
                              {renderMethodGroup(originalIndex, 'email')}
                              {renderMethodGroup(originalIndex, 'whatsapp')}
                              {renderMethodGroup(originalIndex, 'phone')}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Descrição Tab Content */}
              <TabsContent value="descricao" className="m-0">
                <div className="max-w-4xl bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" /> Detalhes da Operação
                  </h2>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      Descreva aqui os detalhes da operação, perfil do cliente, principais dores,
                      mercadorias transportadas, etc.
                    </p>
                    <Textarea
                      value={formData.descricaoNegocio}
                      onChange={(e) =>
                        setFormData({ ...formData, descricaoNegocio: e.target.value })
                      }
                      placeholder="Insira as anotações detalhadas aqui..."
                      className="min-h-[300px] text-base leading-relaxed bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Histórico Tab Content */}
              <TabsContent value="historico" className="m-0">
                <div className="max-w-4xl flex items-center justify-center h-64 bg-white rounded-lg border border-dashed text-slate-400">
                  <p>Módulo de histórico unificado em construção.</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
