import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Building2, Briefcase, MapPin, AlignLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Badge } from '@/components/ui/badge'

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
    observacoes: '',
    pipeline: undefined,
    origin: undefined,
    segmento: undefined,
    clusters: [],
    siteProspectado: '',
    sitePesquisado: '',
    customData: {},
  })

  const [clusterInput, setClusterInput] = useState('')
  const [contacts, setContacts] = useState<Partial<Contact>[]>([])
  const [error, setError] = useState({ cnpj: '', form: '' })

  const isMaster = state.role === 'Master'

  useEffect(() => {
    if (existingCompany) {
      setFormData({
        ...existingCompany,
        customData: existingCompany.customData || {},
        clusters: existingCompany.clusters || [],
      })
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

  const toggleMandatory = (field: string) => {
    if (!isMaster) return
    const newMandatory = new Set(state.mandatoryFields)
    if (newMandatory.has(field)) newMandatory.delete(field)
    else newMandatory.add(field)
    updateState({ mandatoryFields: Array.from(newMandatory) })
  }

  const isMandatory = (field: string) =>
    state.mandatoryFields.includes(field) || field === 'nomeFantasia'

  const handleSave = () => {
    let hasError = false
    const newError = { cnpj: '', form: '' }

    state.mandatoryFields.forEach((field) => {
      if (!(formData as any)[field] || !(formData as any)[field].toString().trim()) {
        newError.form = 'Preencha todos os campos obrigatórios (*)'
        hasError = true
      }
    })

    if (!formData.nomeFantasia?.trim()) {
      newError.form = 'Nome Fantasia é obrigatório.'
      hasError = true
    }

    const rawCnpj = formData.cnpj?.replace(/\D/g, '') || ''
    if (formData.cnpj && rawCnpj.length !== 14) {
      newError.cnpj = 'CNPJ inválido. Exatamente 14 números são requeridos.'
      hasError = true
    }

    setError(newError)
    if (hasError) {
      toast({
        title: 'Corrija os erros do formulário.',
        variant: 'destructive',
        description: newError.form || newError.cnpj,
      })
      return
    }

    try {
      const companyId = existingCompany
        ? existingCompany.id
        : Math.random().toString(36).substr(2, 9)
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
        toast({ title: 'Ficha da empresa atualizada!' })
      } else {
        updateState({
          companies: [...state.companies, newCompany],
          contacts: [...state.contacts, ...finalContacts],
        })
        toast({ title: 'Empresa cadastrada com sucesso!' })
        navigate(`/empresa/${companyId}/editar`, { replace: true })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Sistema',
        description: 'Não foi possível salvar a ficha da empresa com integridade.',
      })
    }
  }

  const addCluster = () => {
    if (clusterInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        clusters: [...(prev.clusters || []), clusterInput.trim()],
      }))
      setClusterInput('')
    }
  }

  const removeCluster = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      clusters: prev.clusters?.filter((_, i) => i !== index),
    }))
  }

  const pageTitle = !existingCompany
    ? 'Nova Empresa'
    : formData.nomeFantasia || formData.razaoSocial || 'Ficha da Empresa'

  const renderLabel = (label: string, field: string) => (
    <Label
      htmlFor={field}
      className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"
    >
      {label}{' '}
      {isMandatory(field) && (
        <span className="text-red-500" aria-hidden="true" title="Campo Obrigatório">
          *
        </span>
      )}
      {isMaster && field !== 'nomeFantasia' && (
        <button
          type="button"
          onClick={() => toggleMandatory(field)}
          className="text-slate-300 hover:text-amber-500 ml-1"
          title="Tornar obrigatório (Master)"
          aria-label={`Tornar ${label} obrigatório`}
        >
          <Star className="w-3 h-3" fill={isMandatory(field) ? 'currentColor' : 'none'} />
        </button>
      )}
    </Label>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -mx-4 -mt-4 bg-slate-50/50 text-slate-800 font-sans">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-blue-100 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Voltar para a lista de empresas"
            className="mr-2 text-slate-500 hover:text-slate-800"
          >
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <div className="bg-blue-100/60 p-2 rounded-lg border border-blue-200" aria-hidden="true">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-blue-950 tracking-tight">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/empresas')}
            className="h-9 font-medium"
            aria-label="Cancelar edição"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            aria-label="Salvar Ficha da Empresa 360"
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" aria-hidden="true" /> Salvar Ficha 360
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-blue-50/10">
        <div className="flex-1 overflow-y-auto flex flex-col p-6 lg:p-8 items-center">
          <div className="w-full max-w-4xl space-y-6">
            {error.form && (
              <div
                className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm font-medium"
                role="alert"
                aria-live="assertive"
              >
                {error.form}
              </div>
            )}

            <Card className="shadow-sm border-blue-100/60 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-3.5 px-6">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
                  <Building2 className="w-4 h-4 text-blue-600" aria-hidden="true" /> Dados
                  Cadastrais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {renderLabel('Nome Fantasia', 'nomeFantasia')}
                    <Input
                      id="nomeFantasia"
                      value={formData.nomeFantasia || ''}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                      aria-required={isMandatory('nomeFantasia')}
                      aria-invalid={error.form && !formData.nomeFantasia ? 'true' : 'false'}
                      className={cn(
                        'bg-white border-slate-200 focus-visible:ring-blue-500/50',
                        error.form && !formData.nomeFantasia && 'border-red-400',
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    {renderLabel('Razão Social', 'razaoSocial')}
                    <Input
                      id="razaoSocial"
                      value={formData.razaoSocial || ''}
                      onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                      aria-required={isMandatory('razaoSocial')}
                      className="bg-white border-slate-200 focus-visible:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    {renderLabel('CNPJ', 'cnpj')}
                    <Input
                      id="cnpj"
                      value={formData.cnpj || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })
                      }
                      maxLength={18}
                      aria-required={isMandatory('cnpj')}
                      aria-invalid={!!error.cnpj}
                      aria-describedby={error.cnpj ? 'cnpj-error' : undefined}
                      className={cn(
                        'bg-white font-mono border-slate-200 focus-visible:ring-blue-500/50',
                        error.cnpj && 'border-red-500',
                      )}
                      placeholder="00.000.000/0000-00"
                    />
                    {error.cnpj && (
                      <span
                        id="cnpj-error"
                        className="text-[10px] text-red-500 font-medium"
                        role="alert"
                      >
                        {error.cnpj}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {renderLabel('Endereço Principal', 'endereco')}
                    <Input
                      id="endereco"
                      value={formData.endereco || ''}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      aria-required={isMandatory('endereco')}
                      className="bg-white border-slate-200 focus-visible:ring-blue-500/50"
                      placeholder="Rua, Cidade, UF"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="clusterInput"
                      className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Clusters / Praças de
                      Atuação
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="clusterInput"
                        value={clusterInput}
                        onChange={(e) => setClusterInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCluster()
                          }
                        }}
                        placeholder="Ex: Campinas, Sul de Minas..."
                        className="bg-white border-slate-200 focus-visible:ring-blue-500/50 max-w-md"
                      />
                      <Button
                        type="button"
                        onClick={addCluster}
                        variant="secondary"
                        aria-label="Adicionar novo cluster"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1" role="list">
                      {formData.clusters?.map((cluster, i) => (
                        <Badge
                          key={i}
                          role="listitem"
                          variant="outline"
                          className="bg-white text-blue-800 border-blue-200 px-2 py-0.5 rounded-md cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                          onClick={() => removeCluster(i)}
                          aria-label={`Remover cluster ${cluster}`}
                        >
                          {cluster} &times;
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-blue-100/60 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-3.5 px-6">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
                  <Briefcase className="w-4 h-4 text-blue-600" aria-hidden="true" /> Resumo
                  Estratégico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    {renderLabel('Pipeline de Destino', 'pipeline')}
                    <Select
                      value={formData.pipeline || ''}
                      onValueChange={(v) => setFormData({ ...formData, pipeline: v })}
                    >
                      <SelectTrigger
                        id="pipeline"
                        className="bg-white border-slate-200 focus:ring-blue-500/50"
                        aria-label="Selecione o Pipeline de destino"
                      >
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
                  <div className="space-y-2 md:col-span-2">
                    {renderLabel('Segmento de Atuação', 'segmento')}
                    <Select
                      value={formData.segmento || ''}
                      onValueChange={(v) => setFormData({ ...formData, segmento: v })}
                    >
                      <SelectTrigger
                        id="segmento"
                        className="bg-white border-slate-200 focus:ring-blue-500/50"
                        aria-label="Selecione o Segmento de atuação da empresa"
                      >
                        <SelectValue placeholder="Selecione o segmento..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Autopeças">Autopeças</SelectItem>
                        <SelectItem value="Metalúrgica">Metalúrgica</SelectItem>
                        <SelectItem value="Varejo">Varejo</SelectItem>
                        <SelectItem value="Químico">Químico / Fertilizantes</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-4">
                    <Label
                      htmlFor="observacoes"
                      className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5"
                    >
                      <AlignLeft className="w-3.5 h-3.5" aria-hidden="true" /> Observações Gerais
                    </Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes || ''}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      placeholder="Informações adicionais relevantes sobre a empresa..."
                      className="bg-white min-h-[100px] border-slate-200 focus-visible:ring-blue-500/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <CompanyContactsForm contacts={contacts} setContacts={setContacts} />
            <CompanyCustomFieldsForm formData={formData} setFormData={setFormData} />

            <div className="h-8"></div>
          </div>
        </div>

        <div className="w-[420px] bg-slate-50/80 border-l border-slate-200/80 flex flex-col h-full shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] z-0 relative">
          <CompanyActionHub company={existingCompany} />
        </div>
      </div>
    </div>
  )
}
