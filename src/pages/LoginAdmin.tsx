import { useState, useEffect } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  createInvitation,
  getInvitations,
  getUsersList,
  getLoginHistory,
  getActionLogs,
} from '@/services/governance'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function LoginAdmin() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('func_comercial')
  const [loading, setLoading] = useState(false)
  const [invitations, setInvitations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [actionLogs, setActionLogs] = useState<any[]>([])
  const { toast } = useToast()

  const loadData = async () => {
    setInvitations(await getInvitations())
    setUsers(await getUsersList())
    setHistory(await getLoginHistory())
    setActionLogs(await getActionLogs())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createInvitation({ email, role, setor: role })
      toast({ title: 'Convite enviado com sucesso!' })
      setEmail('')
      loadData()
    } catch (err: any) {
      toast({ title: 'Erro ao convidar', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Governança & Acessos</h1>
      </div>

      <Tabs defaultValue="invites">
        <TabsList className="mb-4">
          <TabsTrigger value="invites">Convites</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="history">Histórico de Login</TabsTrigger>
          <TabsTrigger value="actions">Auditoria de Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="invites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Convidar Novo Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 w-64">
                  <Label>Perfil de Acesso (Role)</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="sup_financeiro">Sup. Financeiro</SelectItem>
                      <SelectItem value="sup_comercial">Sup. Comercial</SelectItem>
                      <SelectItem value="sup_coleta">Sup. Coleta</SelectItem>
                      <SelectItem value="func_comercial">Func. Comercial</SelectItem>
                      <SelectItem value="func_marketing">Func. Marketing</SelectItem>
                      <SelectItem value="func_coleta">Func. Coleta</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Convite'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convites Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.email}</TableCell>
                      <TableCell className="capitalize">{inv.role.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'accepted' ? 'default' : 'secondary'}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(inv.created).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                  {invitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500">
                        Nenhum convite enviado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name || '-'}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell className="capitalize">{u.role?.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge>{u.status || 'ativo'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data / Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{new Date(h.created).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{h.expand?.user_id?.email || '-'}</TableCell>
                      <TableCell>{h.ip_address || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Log de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data / Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionLogs.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.created).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{a.expand?.user_id?.email || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{a.action_type}</Badge>
                      </TableCell>
                      <TableCell>{a.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
