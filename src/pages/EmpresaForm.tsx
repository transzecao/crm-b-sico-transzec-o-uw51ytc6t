import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Building2, Link as LinkIcon, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCnpj } from '@/utils/formatters'
import useCrmStore, { Company, Contact } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import { CompanyActionHub } from '@/components/CompanyActionHub'
import { CompanyContactsForm } from '@/components/CompanyContactsForm'
import { CompanyCustomFieldsForm } from '@/components/CompanyCustomFieldsForm'

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
    descricaoNegocio: '',
    pipeline: undefined,
    origin: undefined,
    siteProspectado: '',
    sitePesquisado: '',
    customData: {},
  })

  const [contacts, setContacts] = useState<Partial<Contact>[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingCompany) {
      setFormData({ ...existingCompany, customData: existingCompany.customData || {} })
      setContacts(JSON.parse(JSON.stringify(existingContacts)))
    } else {
      setContacts([
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          isPrincipal: true,
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
  }, [id])

  const handleSave = () => {
    const rawCnpj = formData.cnpj?.replace(/\D/g, '') || ''
    if (rawCnpj.length !== 14) {
      setError('CNPJ inválido (14 dígitos).')
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
      toast({ title: 'Salvo com sucesso!' })
    } else {
      updateState({
        companies: [...state.companies, newCompany],
        contacts: [...state.contacts, ...finalContacts],
      })
      toast({ title: 'Empresa criada!' })
      navigate(`/empresa/${companyId}/editar`, { replace: true })
    }
  }

  const pageTitle = !existingCompany ? 'Nova Empresa' : formData.razaoSocial || 'Ficha da Empresa'

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -mx-4 -mt-4 bg-slate-50/50 text-slate-800 font-sans">
      {/* Top App Header / Utility Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mr-2 text-slate-500 hover:text-slate-800"
          >
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800 tracking-tight">
            <Building2 className="w-5 h-5 text-primary" />
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/empresas')}
            className="h-9 font-medium text-slate-600"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="h-9 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Ficha 360
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area (F-Pattern Left) */}
        <div className="flex-1 overflow-y-auto flex flex-col p-6 lg:p-8 items-center bg-slate-50/30">
          <div className="w-full max-w-4xl space-y-6">
            {/* Resumo Estratégico */}
            <Card className="shadow-sm border-slate-200/60 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-6">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
                  <Briefcase className="w-4 h-4 text-primary" /> Resumo Estratégico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Breve descrição da empresa
                    </Label>
                    <Input
                      value={formData.descricaoNegocio || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, descricaoNegocio: e.target.value })
                      }
                      placeholder="Ex: Empresa metalúrgica de Campinas atuando com cargas pesadas..."
                      className="bg-white focus-visible:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Pipeline de Destino
                    </Label>
                    <Select
                      value={formData.pipeline || ''}
                      onValueChange={(v) => setFormData({ ...formData, pipeline: v })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pipeline de Prospecção">
                          Pipeline de Prospecção
                        </SelectItem>
                        <SelectItem value="Pipeline de Nutrição">Pipeline de Nutrição</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Origem do Negócio
                    </Label>
                    <Select
                      value={formData.origin || ''}
                      onValueChange={(v) => setFormData({ ...formData, origin: v })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Site">Site</SelectItem>
                        <SelectItem value="Formulário do site da Transzecão">
                          Formulário do site
                        </SelectItem>
                        <SelectItem value="Setor Coleta">Setor Coleta</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Outra origem configurável">Outra origem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados Cadastrais */}
            <Card className="shadow-sm border-slate-200/60 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-6">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
                  <Building2 className="w-4 h-4 text-primary" /> Dados Cadastrais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      CNPJ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.cnpj || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })
                      }
                      maxLength={18}
                      className={cn('bg-white font-mono', error && 'border-red-500')}
                      placeholder="00.000.000/0000-00"
                    />
                    {error && <span className="text-[10px] text-red-500 font-medium">{error}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Razão Social / Nome
                    </Label>
                    <Input
                      value={formData.razaoSocial || ''}
                      onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Nome Fantasia
                    </Label>
                    <Input
                      value={formData.nomeFantasia || ''}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Endereço Principal
                    </Label>
                    <Input
                      value={formData.endereco || ''}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="bg-white"
                      placeholder="Rua, Cidade, UF"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5" /> Site da empresa prospectada
                    </Label>
                    <Input
                      type="url"
                      value={formData.siteProspectado || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, siteProspectado: e.target.value })
                      }
                      className="bg-white text-blue-600"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5" /> Link do site pesquisado
                    </Label>
                    <Input
                      type="url"
                      value={formData.sitePesquisado || ''}
                      onChange={(e) => setFormData({ ...formData, sitePesquisado: e.target.value })}
                      className="bg-white text-blue-600"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <CompanyContactsForm contacts={contacts} setContacts={setContacts} />
            <CompanyCustomFieldsForm formData={formData} setFormData={setFormData} />

            {/* Bottom spacer */}
            <div className="h-8"></div>
          </div>
        </div>

        {/* Side Panel (F-Pattern Right Action Zone) */}
        <div className="w-[400px] bg-slate-50/40 border-l border-slate-200/80 flex flex-col h-full shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] z-0 relative">
          <CompanyActionHub company={existingCompany} />
        </div>
      </div>
    </div>
  )
}
