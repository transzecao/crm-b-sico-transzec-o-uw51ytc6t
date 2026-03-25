import { useState, useMemo } from 'react'
import {
  Plus,
  Copy,
  Edit2,
  Trash2,
  ShieldAlert,
  KeyRound,
  Filter,
  Save,
  History,
  Mail,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import useCrmStore, { UserLogin } from '@/stores/useCrmStore'
import { cn } from '@/lib/utils'

export default function LoginAdmin() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [filterSector, setFilterSector] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLogin, setEditingLogin] = useState<UserLogin | null>(null)
  const [formData, setFormData] = useState<Partial<UserLogin>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Determine user permissions based on role
  const role = state.role
  const isMaster = role === 'Master'
  const isSupervisor = role === 'Supervisor'

  // Map roles to sectors for viewing permissions
  const userSectorMap: Record<string, string> = {
    Comercial: 'Comercial',
    Supervisor: 'Comercial',
    Financeiro: 'Financeiro',
    Coleta: 'Coleta',
    Marketing: 'Comercial',
    Master: 'Todos',
    Diretoria: 'Todos',
  }
  const mySector = userSectorMap[role] || 'Nenhum'

  const canEditAny = isMaster || isSupervisor
  const canDeleteAny = isMaster || isSupervisor

  const canEditLogin = (login: UserLogin) => {
    if (isMaster) return true
    if (isSupervisor && login.sector === mySector) return true
    return false
  }

  const visibleLogins = useMemo(() => {
    return state.userLogins.filter((l) => {
      // 1. Check viewing permission
      if (mySector !== 'Todos' && l.sector !== mySector) return false
      // 2. Check selected filter
      if (filterSector !== 'all' && l.sector !== filterSector) return false
      return true
    })
  }, [state.userLogins, mySector, filterSector])

  const generateLink = (name: string, sector: string) => {
    if (!name || !sector) return ''
    const cleanName = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return `https://transzecao.com.br/login/${cleanName}-${sector.toLowerCase()}`
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const newData = { ...prev, name }
      if (!editingLogin && newData.sector) {
        newData.accessLink = generateLink(name, newData.sector)
      }
      return newData
    })
  }

  const handleSectorChange = (sector: string) => {
    setFormData((prev) => {
      const newData = { ...prev, sector }
      if (!editingLogin && newData.name) {
        newData.accessLink = generateLink(newData.name, sector)
      }
      return newData
    })
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name?.trim()) errors.name = 'Nome do Usuário é obrigatório.'
    if (!formData.sector) errors.sector = 'Selecione um setor.'

    const linkPattern = /^https:\/\/[a-zA-Z0-9.-]+\.com(\.br)?\/[a-zA-Z0-9./-]+$/
    if (!formData.accessLink || !linkPattern.test(formData.accessLink)) {
      errors.accessLink = 'O link deve ser uma URL HTTPS válida da plataforma.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: 'Erros no formulário',
        description: 'Corrija os campos indicados antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    const now = new Date().toLocaleString('pt-BR')
    const logAction = editingLogin
      ? `Editou o login de ${formData.name}`
      : `Criou novo login para ${formData.name}`

    let updatedLogins = [...state.userLogins]

    if (editingLogin) {
      updatedLogins = updatedLogins.map((l) =>
        l.id === editingLogin.id
          ? ({
              ...l,
              ...formData,
              updatedAt: now,
            } as UserLogin)
          : l,
      )
      toast({
        title: 'Acesso Atualizado',
        description: `Login de ${formData.name} salvo com sucesso.`,
      })
    } else {
      const newLogin: UserLogin = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        sector: formData.sector!,
        accessLink: formData.accessLink!,
        status: (formData.status as 'Ativo' | 'Inativo') || 'Ativo',
        createdAt: now,
        updatedAt: now,
      }
      updatedLogins.push(newLogin)

      // Email Automation Mock
      toast({
        title: 'Automação de E-mail Disparada',
        description: `Enviando e-mail para ${newLogin.name} com o link de acesso seguro.`,
        action: (
          <div className="p-1 bg-indigo-100 rounded-full">
            <Mail className="w-4 h-4 text-indigo-600" />
          </div>
        ),
      })
    }

    const newAuditLog = {
      date: now,
      user: state.currentUser.name,
      action: logAction,
    }

    updateState({
      userLogins: updatedLogins,
      loginAuditLogs: [newAuditLog, ...state.loginAuditLogs].slice(0, 50),
    })

    setModalOpen(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (!canDeleteAny) return
    const updatedLogins = state.userLogins.filter((l) => l.id !== id)

    const newAuditLog = {
      date: new Date().toLocaleString('pt-BR'),
      user: state.currentUser.name,
      action: `Excluiu permanentemente o login de ${name}`,
    }

    updateState({
      userLogins: updatedLogins,
      loginAuditLogs: [newAuditLog, ...state.loginAuditLogs].slice(0, 50),
    })

    toast({
      title: 'Login Excluído',
      description: `O acesso de ${name} foi removido do sistema.`,
      variant: 'default',
    })
  }

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: 'Link Copiado',
      description: 'Link de acesso copiado para a área de transferência.',
    })
  }

  const openNewModal = () => {
    setEditingLogin(null)
    setFormData({ status: 'Ativo', name: '', sector: '', accessLink: '' })
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (login: UserLogin) => {
    setEditingLogin(login)
    setFormData({ ...login })
    setFormErrors({})
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 bg-slate-50/30 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-slate-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl border border-indigo-200/80 text-indigo-700 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Administração de Logins
            </h1>
            <p className="text-slate-600 font-medium mt-1">
              Painel centralizado para gerenciar acessos por setor e monitorar auditoria.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canEditAny && (
            <Button
              onClick={openNewModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Acesso
            </Button>
          )}
        </div>
      </div>

      {!canEditAny && mySector !== 'Todos' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-amber-900">
            Você possui acesso apenas de leitura aos logins do setor <strong>{mySector}</strong>.
            Para gerenciar acessos ou visualizar outras áreas, contate um Supervisor ou usuário
            Master.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                Tabela de Usuários Ativos
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger className="w-[180px] bg-white border-slate-200">
                    <SelectValue placeholder="Filtrar por Setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Setores</SelectItem>
                    <SelectItem value="Coleta">Coleta</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Nome do Usuário</TableHead>
                    <TableHead className="font-bold text-slate-700">Setor</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="font-bold text-slate-700">Link de Acesso</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleLogins.map((login) => (
                    <TableRow key={login.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">
                        {login.name}
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          Criado: {login.createdAt.split(' ')[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-700 font-medium"
                        >
                          {login.sector}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'font-bold',
                            login.status === 'Ativo'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-100',
                          )}
                        >
                          {login.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <span
                            className="text-xs text-slate-500 truncate"
                            title={login.accessLink}
                          >
                            {login.accessLink}
                          </span>
                          <button
                            onClick={() => copyToClipboard(login.accessLink)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors shrink-0"
                            title="Copiar Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canEditLogin(login) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(login)}
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                          {canDeleteAny && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(login.id, login.name)}
                              className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {visibleLogins.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        Nenhum login encontrado para os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm sticky top-20">
            <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
                <History className="w-4 h-4 text-slate-500" /> Histórico e Auditoria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                {state.loginAuditLogs.map((log, i) => (
                  <div
                    key={i}
                    className="text-xs border-l-2 border-indigo-200 pl-3 py-1 relative group hover:bg-slate-50 rounded-r-md transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider mb-0.5">
                      {log.date}
                    </span>
                    <span className="font-bold text-indigo-900">{log.user}</span>{' '}
                    <span className="text-slate-600 font-medium leading-tight">{log.action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md border-slate-200 shadow-xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              {editingLogin ? (
                <Edit2 className="w-5 h-5 text-indigo-500" />
              ) : (
                <Plus className="w-5 h-5 text-indigo-500" />
              )}
              {editingLogin ? 'Editar Login' : 'Novo Login e Envio de Acesso'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">
                Nome do Usuário <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                className={cn(
                  'focus-visible:ring-indigo-500/50',
                  formErrors.name && 'border-rose-400',
                )}
                placeholder="Ex: Carlos Silva"
              />
              {formErrors.name && (
                <p className="text-[10px] text-rose-500 font-bold">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">
                Setor Operacional <span className="text-rose-500">*</span>
              </Label>
              <Select value={formData.sector || ''} onValueChange={handleSectorChange}>
                <SelectTrigger
                  className={cn(
                    'w-full focus:ring-indigo-500/50',
                    formErrors.sector && 'border-rose-400',
                  )}
                >
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coleta">Coleta</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.sector && (
                <p className="text-[10px] text-rose-500 font-bold">{formErrors.sector}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Link de Acesso Único</Label>
              <Input
                value={formData.accessLink || ''}
                onChange={(e) => setFormData({ ...formData, accessLink: e.target.value })}
                className={cn(
                  'bg-slate-50 font-mono text-xs focus-visible:ring-indigo-500/50',
                  formErrors.accessLink && 'border-rose-400',
                )}
                placeholder="https://..."
              />
              {formErrors.accessLink && (
                <p className="text-[10px] text-rose-500 font-bold">{formErrors.accessLink}</p>
              )}
              {!editingLogin && (
                <p className="text-[10px] text-slate-500">
                  Auto-gerado. Um e-mail com este link será enviado ao salvar.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg mt-2">
              <div className="space-y-0.5">
                <Label className="text-slate-800 font-bold">Status da Conta</Label>
                <p className="text-xs text-slate-500">
                  Contas inativas não podem acessar a plataforma.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  {formData.status}
                </span>
                <Switch
                  checked={formData.status === 'Ativo'}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, status: v ? 'Ativo' : 'Inativo' })
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            {editingLogin && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <Label className="text-[10px] uppercase text-slate-500">Data de Criação</Label>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-1.5 rounded">
                    {editingLogin.createdAt}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase text-slate-500">Última Atualização</Label>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-1.5 rounded">
                    {editingLogin.updatedAt}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="w-4 h-4 mr-2" /> Salvar e Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
