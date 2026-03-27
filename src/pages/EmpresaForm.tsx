import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Building2, MapPin, AlertCircle } from 'lucide-react'
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
import useCrmStore, { Company, Contact, Lead } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import { CompanyActionHub } from '@/components/CompanyActionHub'
import { CompanyContactsForm } from '@/components/CompanyContactsForm'
import { CompanyAddressFields } from '@/components/CompanyAddressFields'
import { Badge } from '@/components/ui/badge'

export default function EmpresaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, updateState, logAccess } = useCrmStore()
  const { toast } = useToast()

  const existingCompany = id ? state.companies.find((c) => c.id === id) : undefined
  const existingContacts = id ? state.contacts.filter((c) => c.companyId === id) : []

  const isReadOnly = ![
    'Acesso Master',
    'Supervisor Comercial',
    'Funcionário Comercial',
    'Funcionário Coleta',
  ].includes(state.role)

  const [formData, setFormData] = useState<Partial<Company>>({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    descricaoNegocio: '',
    observacoes: '',
    pipeline: undefined,
    segmento: undefined,
    clusters: [],
    customData: {},
  })

  const [clusterInput, setClusterInput] = useState('')
  const [contacts, setContacts] = useState<Partial<Contact>[]>([])
  const [error, setError] = useState({ cnpj: '', form: '' })

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

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return
    const rawVal = e.target.value.replace(/\D/g, '')
    const formatted = formatCnpj(rawVal)
    setFormData({ ...formData, cnpj: formatted })

    const rawCnpj = formatted.replace(/\D/g, '')
    if (rawCnpj.length > 0 && rawCnpj.length < 14) {
      setError((prev) => ({ ...prev, cnpj: 'CNPJ Incompleto (14 dígitos)' }))
    } else if (rawCnpj.length === 14) {
      setError((prev) => ({ ...prev, cnpj: '' }))
    }
  }

  const handleSave = () => {
    if (isReadOnly) {
      toast({
        title: 'Acesso Negado',
        description: 'Seu perfil possui apenas permissão de leitura nesta tela.',
        variant: 'destructive',
      })
      return
    }

    let hasError = false
    const newError = { cnpj: '', form: '' }

    if (!formData.nomeFantasia?.trim()) {
      newError.form = 'Nome Fantasia é obrigatório.'
      hasError = true
    }

    const rawCnpj = formData.cnpj?.replace(/\D/g, '') || ''
    if (formData.cnpj && rawCnpj.length !== 14) {
      newError.cnpj = 'O CNPJ deve conter exatamente 14 dígitos numéricos para salvar.'
      hasError = true
    }

    setError(newError)
    if (hasError) {
      toast({
        title: 'Corrija os erros',
        variant: 'destructive',
        description: newError.form || newError.cnpj,
      })
      return
    }

    try {
      const companyId = existingCompany
        ? existingCompany.id
        : Math.random().toString(36).substr(2, 9)

      const finalPipeline = existingCompany ? formData.pipeline : 'Pipeline de Prospecção'

      const newCompany = {
        ...formData,
        id: companyId,
        pipeline: finalPipeline,
        createdBy: existingCompany ? existingCompany.createdBy : state.currentUser.name,
      } as Company

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
        logAccess(`Editou Empresa: ${newCompany.nomeFantasia}`)
        toast({ title: 'Empresa atualizada!' })
      } else {
        const newLead: Lead = {
          id: Math.random().toString(36).substr(2, 9),
          companyId,
          title: newCompany.nomeFantasia || newCompany.razaoSocial || 'Nova Empresa',
          pipeline: 'Prospection',
          stage: 'Primeiro contato',
          value: 0,
          owner: state.currentUser.name,
          ownerAvatar: state.currentUser.avatar,
          updatedBy: state.currentUser.name,
          updatedAt: new Date().toLocaleString('pt-BR'),
          createdAt: new Date().toLocaleDateString('pt-BR'),
          score: 'Warm',
        }

        updateState({
          companies: [...state.companies, newCompany],
          contacts: [...state.contacts, ...finalContacts],
          leads: [...state.leads, newLead],
        })
        logAccess(`Cadastrou Empresa: ${newCompany.nomeFantasia}`)
        toast({
          title: 'Empresa e Lead criados!',
          description: 'Inserido na etapa de Primeiro Contato.',
        })
        navigate(`/empresa/${companyId}/editar`, { replace: true })
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro de Sistema',
        description: 'Não foi possível salvar.',
      })
    }
  }

  const addCluster = () => {
    if (clusterInput.trim() && !isReadOnly) {
      setFormData((prev) => ({
        ...prev,
        clusters: [...(prev.clusters || []), clusterInput.trim()],
      }))
      setClusterInput('')
    }
  }

  const removeCluster = (index: number) => {
    if (isReadOnly) return
    setFormData((prev) => ({
      ...prev,
      clusters: prev.clusters?.filter((_, i) => i !== index),
    }))
  }

  const pageTitle = !existingCompany ? 'Novo Cadastro' : formData.nomeFantasia

  const renderLabel = (label: string, field: string, required = false) => (
    <Label
      htmlFor={field}
      className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"
    >
      {label}{' '}
      {required && (
        <span className="text-red-500" aria-hidden="true" title="Campo Obrigatório">
          *
        </span>
      )}
    </Label>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -mx-4 -mt-4 bg-slate-50 text-slate-800">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mr-2 text-slate-500 hover:text-primary"
          >
            <Link to="/empresas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/empresas')}
            className="h-9 font-medium"
          >
            {isReadOnly ? 'Voltar' : 'Cancelar'}
          </Button>
          {!isReadOnly && (
            <Button
              onClick={handleSave}
              className="h-9 bg-primary hover:bg-primary/90 text-white font-bold shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Cadastro
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 lg:p-8 items-center">
          <div className="w-full max-w-4xl space-y-6">
            {isReadOnly && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  Seu perfil possui apenas acesso de visualização a este cadastro.
                </p>
              </div>
            )}

            <Card className="shadow-sm border-slate-200 bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <Building2 className="w-4 h-4 text-primary" /> Dados Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {renderLabel('Nome Fantasia', 'nomeFantasia', true)}
                    <Input
                      id="nomeFantasia"
                      value={formData.nomeFantasia || ''}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                      disabled={isReadOnly}
                      className={cn(
                        'bg-white border-slate-200 focus-visible:ring-primary',
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
                      disabled={isReadOnly}
                      className="bg-white border-slate-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    {renderLabel('CNPJ', 'cnpj', true)}
                    <Input
                      id="cnpj"
                      value={formData.cnpj || ''}
                      onChange={handleCnpjChange}
                      disabled={isReadOnly}
                      maxLength={18}
                      className={cn(
                        'bg-white font-mono border-slate-200 focus-visible:ring-primary',
                        error.cnpj && 'border-red-500 focus-visible:ring-red-500 text-red-600',
                      )}
                      placeholder="00.000.000/0000-00"
                    />
                    {error.cnpj && (
                      <span className="text-[10px] text-red-500 font-bold block mt-1 absolute -bottom-4 left-0">
                        {error.cnpj}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {renderLabel('Segmento', 'segmento')}
                    <Select
                      value={formData.segmento || ''}
                      onValueChange={(v) => setFormData({ ...formData, segmento: v })}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="bg-white border-slate-200 focus:ring-primary">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Autopeças">Autopeças</SelectItem>
                        <SelectItem value="Metalúrgico">Metalúrgico</SelectItem>
                        <SelectItem value="Materiais Delicados">Materiais Delicados</SelectItem>
                        <SelectItem value="Carga Geral">Carga Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2 pt-2 border-t border-slate-100">
                    <Label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Clusters de Atuação
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={clusterInput}
                        onChange={(e) => setClusterInput(e.target.value)}
                        disabled={isReadOnly}
                        onKeyDown={(e) => e.key === 'Enter' && addCluster()}
                        placeholder="Adicionar região (ex: Campinas)"
                        className="bg-white border-slate-200 max-w-sm"
                      />
                      <Button
                        type="button"
                        onClick={addCluster}
                        disabled={isReadOnly || !clusterInput.trim()}
                        variant="secondary"
                        className="bg-secondary text-white hover:bg-secondary/90"
                      >
                        + Adicionar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.clusters?.map((cluster, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          onClick={() => removeCluster(i)}
                        >
                          {cluster} &times;
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <CompanyAddressFields
                    formData={formData}
                    setFormData={setFormData}
                    isReadOnly={isReadOnly}
                  />

                  <div className="space-y-2 md:col-span-2 pt-2 border-t border-slate-100">
                    {renderLabel('Observações', 'observacoes')}
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes || ''}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      disabled={isReadOnly}
                      className="bg-white min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <CompanyContactsForm
              contacts={contacts}
              setContacts={setContacts}
              isReadOnly={isReadOnly}
            />

            <div className="h-8"></div>
          </div>
        </div>

        <div className="hidden lg:flex w-[320px] bg-slate-50 border-l border-slate-200 flex-col h-full shrink-0 shadow-inner z-0 relative">
          <CompanyActionHub company={existingCompany} contacts={contacts as Contact[]} />
        </div>
      </div>
    </div>
  )
}
