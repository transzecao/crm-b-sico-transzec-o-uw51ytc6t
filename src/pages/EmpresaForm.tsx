import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Building2, Link as LinkIcon, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -mx-4 -mt-4 bg-[#f8fafc] text-slate-800 font-sans">
      {/* Top App Header / Utility Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/empresas')} className="h-9">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="h-9 bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Ficha 360
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area (F-Pattern Left) */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* F-Pattern Top Block: Strategic Summary */}
          <div className="bg-white p-6 px-8 border-b shadow-sm shrink-0 z-0">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-700">Resumo Estratégico</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Breve descrição da empresa
                </Label>
                <Input
                  value={formData.descricaoNegocio || ''}
                  onChange={(e) => setFormData({ ...formData, descricaoNegocio: e.target.value })}
                  placeholder="Ex: Empresa metalúrgica de Campinas atuando com cargas pesadas..."
                  className="bg-slate-50 focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Pipeline de Destino
                </Label>
                <Select
                  value={formData.pipeline || ''}
                  onValueChange={(v) => setFormData({ ...formData, pipeline: v })}
                >
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pipeline de Prospecção">Pipeline de Prospecção</SelectItem>
                    <SelectItem value="Pipeline de Nutrição">Pipeline de Nutrição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  Origem do Negócio
                </Label>
                <Select
                  value={formData.origin || ''}
                  onValueChange={(v) => setFormData({ ...formData, origin: v })}
                >
                  <SelectTrigger className="bg-slate-50">
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
          </div>

          {/* F-Pattern Vertical Block: Detailed Data */}
          <div className="p-8 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-bold text-slate-700">Dados Cadastrais</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">
                    CNPJ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.cnpj || ''}
                    onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })}
                    maxLength={18}
                    className={cn('bg-slate-50 font-mono', error && 'border-red-500')}
                    placeholder="00.000.000/0000-00"
                  />
                  {error && <span className="text-xs text-red-500">{error}</span>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Razão Social / Nome</Label>
                  <Input
                    value={formData.razaoSocial || ''}
                    onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Nome Fantasia</Label>
                  <Input
                    value={formData.nomeFantasia || ''}
                    onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Endereço Principal</Label>
                  <Input
                    value={formData.endereco || ''}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className="bg-slate-50"
                    placeholder="Rua, Cidade, UF"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Site da empresa prospectada
                  </Label>
                  <Input
                    type="url"
                    value={formData.siteProspectado || ''}
                    onChange={(e) => setFormData({ ...formData, siteProspectado: e.target.value })}
                    className="bg-slate-50 text-blue-600"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Link do site pesquisado
                  </Label>
                  <Input
                    type="url"
                    value={formData.sitePesquisado || ''}
                    onChange={(e) => setFormData({ ...formData, sitePesquisado: e.target.value })}
                    className="bg-slate-50 text-blue-600"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            </section>

            <CompanyContactsForm contacts={contacts} setContacts={setContacts} />
            <CompanyCustomFieldsForm formData={formData} setFormData={setFormData} />

            {/* Bottom spacer */}
            <div className="h-8"></div>
          </div>
        </div>

        {/* Side Panel (F-Pattern Right Action Zone) */}
        <div className="w-[420px] bg-slate-50/80 border-l border-slate-200 flex flex-col h-full shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-0 relative">
          <CompanyActionHub company={existingCompany} />
        </div>
      </div>
    </div>
  )
}
