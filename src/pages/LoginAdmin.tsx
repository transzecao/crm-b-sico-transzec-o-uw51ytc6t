import { useState, useEffect } from 'react'
import { ShieldAlert, KeyRound, History, ArrowRightLeft, Plus, Mail } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import useCrmStore from '@/stores/useCrmStore'
import {
  getUsersList,
  getLoginHistory,
  getInvitations,
  getAuditLogs,
  updateUser,
  createInvitation,
} from '@/services/governance'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

export default function LoginAdmin() {
  const { state } = useCrmStore()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Cliente')
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const [editingUser, setEditingUser] = useState<any>(null)
  const [editRole, setEditRole] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    if (state.role === 'Acesso Master') {
      loadData()
    }
  }, [state.role])

  useRealtime('invitations', () => {
    if (state.role === 'Acesso Master') {
      getInvitations().then(setInvitations)
    }
  })

  const loadData = async () => {
    const [u, h, i, a] = await Promise.all([
      getUsersList(),
      getLoginHistory(),
      getInvitations(),
      getAuditLogs(),
    ])
    setUsers(u)
    setHistory(h)
    setInvitations(i)
    setAuditLogs(a)
  }

  const handleInvite = async () => {
    if (!inviteEmail.includes('@')) {
      toast({ title: 'E-mail inválido', variant: 'destructive' })
      return
    }
    try {
      await createInvitation({
        email: inviteEmail,
        role: inviteRole,
      })
      toast({ title: 'Convite enviado!', description: 'O usuário receberá o link por e-mail.' })
      setIsInviteOpen(false)
      setInviteEmail('')
    } catch (e: any) {
      console.error('Erro ao criar convite:', e)
      const fieldErrors = extractFieldErrors(e)
      const errorMsg = getErrorMessage(e)

      let description = errorMsg || 'Falha ao criar o registro de convite.'
      if (fieldErrors.email) {
        description = `Erro no e-mail: ${fieldErrors.email}`
      } else if (fieldErrors.status) {
        description = `Erro no status: ${fieldErrors.status}`
      }

      toast({
        title: 'Erro ao convidar',
        description,
        variant: 'destructive',
      })
    }
  }

  const openEdit = (user: any) => {
    setEditingUser(user)
    setEditRole(user.role || 'Cliente')
    setEditStatus(user.status || 'pending')
    setIsEditOpen(true)
  }

  const handleUpdateUser = async () => {
    try {
      await updateUser(editingUser.id, { role: editRole, status: editStatus })
      toast({ title: 'Usuário atualizado com sucesso' })
      setIsEditOpen(false)
      loadData()
    } catch (e) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  if (state.role !== 'Acesso Master') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500">
          Apenas o perfil "Acesso Master" pode visualizar esta página.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Painel de Governança
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Gerencie acessos, convites e visualize o histórico de atividades.
            </p>
          </div>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="w-4 h-4 mr-2" /> Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>E-mail do Usuário</Label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Perfil de Acesso</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acesso Master">Acesso Master</SelectItem>
                    <SelectItem value="Supervisor Financeiro">Supervisor Financeiro</SelectItem>
                    <SelectItem value="Supervisor Comercial">Supervisor Comercial</SelectItem>
                    <SelectItem value="Supervisor Coleta">Supervisor Coleta</SelectItem>
                    <SelectItem value="Funcionário Comercial">Funcionário Comercial</SelectItem>
                    <SelectItem value="Funcionário Marketing">Funcionário Marketing</SelectItem>
                    <SelectItem value="Funcionário Coleta">Funcionário Coleta</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-slate-50 p-3 rounded-md border text-sm text-slate-600">
                <strong>Mensagem:</strong> Olá! Você foi convidado a criar uma conta no CRM da
                Transzecão. Clique no link abaixo para se cadastrar.
              </div>
              <Button onClick={handleInvite} className="w-full">
                <Mail className="w-4 h-4 mr-2" /> Enviar Convite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4 bg-white border border-slate-200 p-1 shadow-sm rounded-lg h-auto flex flex-wrap w-fit">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-2 px-4 font-semibold"
          >
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="invites"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-2 px-4 font-semibold"
          >
            Convites Pendentes
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-2 px-4 font-semibold"
          >
            Histórico de Logins
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-2 px-4 font-semibold"
          >
            Auditoria de Ações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-800">Usuários Cadastrados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nome / E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Atividade</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-bold text-slate-900">{u.name || 'Sem Nome'}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.role || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            u.status === 'active'
                              ? 'bg-emerald-500 text-white'
                              : u.status === 'inactive'
                                ? 'bg-rose-500 text-white'
                                : 'bg-amber-500 text-white'
                          }
                        >
                          {u.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {u.last_activity
                          ? new Date(u.last_activity).toLocaleString('pt-BR')
                          : 'Nunca acessou'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(u)}
                          className="text-primary font-bold"
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-800">Convites Enviados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil Solicitado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data do Convite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.email}</TableCell>
                      <TableCell>{i.role}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{i.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(i.created).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {invitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Nenhum convite pendente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-secondary" /> Histórico de Acessos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(h.created).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-bold">
                        {h.expand?.user_id?.email || h.user_id}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs font-mono">
                        {h.ip_address}
                      </TableCell>
                    </TableRow>
                  ))}
                  {history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        Nenhum acesso registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" /> Log de Operações Governança
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Valor Anterior</TableHead>
                    <TableHead>Novo Valor</TableHead>
                    <TableHead>Impacto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(l.created).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{l.parameter}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{l.old_value}</TableCell>
                      <TableCell className="text-xs text-emerald-700 font-bold">
                        {l.new_value}
                      </TableCell>
                      <TableCell className="text-xs">{l.impact}</TableCell>
                    </TableRow>
                  ))}
                  {auditLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhum log registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Permissões</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acesso Master">Acesso Master</SelectItem>
                  <SelectItem value="Supervisor Financeiro">Supervisor Financeiro</SelectItem>
                  <SelectItem value="Supervisor Comercial">Supervisor Comercial</SelectItem>
                  <SelectItem value="Supervisor Coleta">Supervisor Coleta</SelectItem>
                  <SelectItem value="Funcionário Comercial">Funcionário Comercial</SelectItem>
                  <SelectItem value="Funcionário Marketing">Funcionário Marketing</SelectItem>
                  <SelectItem value="Funcionário Coleta">Funcionário Coleta</SelectItem>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateUser} className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
