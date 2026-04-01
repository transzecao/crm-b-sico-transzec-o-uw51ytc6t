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
import { useAuth } from '@/hooks/use-auth'
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
  const { user } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('employee')
  const [inviteSetor, setInviteSetor] = useState('geral')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const [editingUser, setEditingUser] = useState<any>(null)
  const [editRole, setEditRole] = useState('')
  const [editSetor, setEditSetor] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData()
    }
  }, [user])

  useRealtime('invitations', () => {
    if (user?.role === 'admin') {
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
    setIsInviting(true)
    try {
      await createInvitation({
        email: inviteEmail,
        role: inviteRole,
        setor: inviteSetor,
      })
      toast({ title: 'Convite enviado!', description: 'O usuário receberá o link por e-mail.' })
      setIsInviteOpen(false)
      setInviteEmail('')
    } catch (e: any) {
      const errorMsg = getErrorMessage(e)
      toast({
        title: 'Erro ao convidar',
        description: errorMsg || 'Falha ao criar o registro de convite.',
        variant: 'destructive',
      })
    } finally {
      setIsInviting(false)
    }
  }

  const openEdit = (u: any) => {
    setEditingUser(u)
    setEditRole(u.role || 'employee')
    setEditSetor(u.setor || 'geral')
    setEditStatus(u.status || 'pending')
    setIsEditOpen(true)
  }

  const handleUpdateUser = async () => {
    try {
      await updateUser(editingUser.id, { role: editRole, setor: editSetor, status: editStatus })
      toast({ title: 'Usuário atualizado com sucesso' })
      setIsEditOpen(false)
      loadData()
    } catch (e) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500" />
        <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500">Apenas administradores podem visualizar esta página.</p>
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
                    <SelectItem value="admin">Administrador (Master)</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="employee">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Setor</Label>
                <Select value={inviteSetor} onValueChange={setInviteSetor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="coleta">Coleta</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} className="w-full" disabled={isInviting}>
                {isInviting ? (
                  <span className="animate-spin mr-2 border-2 border-white/20 border-t-white rounded-full w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isInviting ? 'Enviando...' : 'Enviar Convite'}
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
        </TabsList>

        <TabsContent value="users">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nome / E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Status</TableHead>
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
                        <Badge variant="secondary">{u.setor || 'geral'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            u.status === 'active'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-500 text-white'
                          }
                        >
                          {u.status || 'pending'}
                        </Badge>
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
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
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
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.email}</TableCell>
                      <TableCell>{i.role}</TableCell>
                      <TableCell>{i.setor}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{i.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {invitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500">
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
                      <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                        Nenhum acesso registrado.
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
                  <SelectItem value="admin">Administrador (Master)</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="employee">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Setor</Label>
              <Select value={editSetor} onValueChange={setEditSetor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="coleta">Coleta</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
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
