import { useState, useMemo } from 'react'
import { Plus, Copy, Edit2, Trash2, ShieldAlert, KeyRound, Filter, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import useCrmStore, { UserLogin } from '@/stores/useCrmStore'
import { LoginAdminModal } from '@/components/LoginAdminModal'
import { cn } from '@/lib/utils'

export default function LoginAdmin() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [filterSector, setFilterSector] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLogin, setEditingLogin] = useState<UserLogin | null>(null)

  const role = state.role
  const isMasterOrGen = role === 'Master' || role === 'Supervisor Geral'
  const isDir = role === 'Diretoria'

  let mySector = 'Nenhum'
  let canEditMySector = false
  const canEditAny = isMasterOrGen
  const canViewAny = isMasterOrGen || isDir
  const canDeleteAny = isMasterOrGen

  if (role === 'Supervisor Comercial') {
    mySector = 'Comercial'
    canEditMySector = true
  } else if (role === 'Supervisor Financeiro') {
    mySector = 'Financeiro'
    canEditMySector = true
  } else if (role === 'Supervisor Coleta') {
    mySector = 'Coleta'
    canEditMySector = true
  } else if (role === 'Comercial' || role === 'Marketing') {
    mySector = 'Comercial'
  } else if (role === 'Financeiro') {
    mySector = 'Financeiro'
  } else if (role === 'Coleta') {
    mySector = 'Coleta'
  }

  const visibleLogins = useMemo(() => {
    return state.userLogins.filter((l) => {
      if (!canViewAny && l.sector !== mySector) return false
      if (filterSector !== 'all' && l.sector !== filterSector) return false
      return true
    })
  }, [state.userLogins, mySector, filterSector, canViewAny])

  const canEditLogin = (login: UserLogin) => {
    if (canEditAny) return true
    if (canEditMySector && login.sector === mySector) return true
    return false
  }

  const canDeleteLogin = (login: UserLogin) => {
    if (canDeleteAny) return true
    if (canEditMySector && login.sector === mySector) return true
    return false
  }

  const handleDelete = (id: string, name: string) => {
    const login = state.userLogins.find((l) => l.id === id)
    if (!login || !canDeleteLogin(login)) return

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

    toast({ title: 'Login Excluído', description: `O acesso de ${name} foi removido do sistema.` })
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
    setModalOpen(true)
  }

  const openEditModal = (login: UserLogin) => {
    setEditingLogin(login)
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
          {(canEditAny || canEditMySector) && (
            <Button
              onClick={openNewModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Acesso
            </Button>
          )}
        </div>
      </div>

      {!canEditAny && !canViewAny && mySector !== 'Nenhum' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-amber-900">
            Você possui acesso restrito aos logins do setor <strong>{mySector}</strong>.{' '}
            {!canEditMySector && 'Apenas permissão de leitura.'}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
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
                    <TableHead className="font-bold text-slate-700">Data de Criação</TableHead>
                    <TableHead className="font-bold text-slate-700">Última Atualização</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleLogins.map((login) => (
                    <TableRow key={login.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">{login.name}</TableCell>
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
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          {login.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[150px]">
                          <span
                            className="text-xs text-slate-500 truncate"
                            title={login.accessLink}
                          >
                            {login.accessLink}
                          </span>
                          <button
                            onClick={() => copyToClipboard(login.accessLink)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded transition-colors shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs font-medium">
                        {login.createdAt.split(' ')[0]}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs font-medium">
                        {login.updatedAt.split(' ')[0]}
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
                          {canDeleteLogin(login) && (
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
                      <TableCell colSpan={7} className="h-24 text-center text-slate-500">
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
              <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
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

      <LoginAdminModal
        open={modalOpen}
        setOpen={setModalOpen}
        login={editingLogin}
        canEditMySector={canEditMySector}
        mySector={mySector}
      />
    </div>
  )
}
