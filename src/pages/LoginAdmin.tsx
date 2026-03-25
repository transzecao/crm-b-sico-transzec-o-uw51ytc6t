import { useState, useMemo } from 'react'
import { Copy, Edit2, Trash2, ShieldAlert, KeyRound, Filter, History } from 'lucide-react'
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
import { cn } from '@/lib/utils'

export default function LoginAdmin() {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const [filterSector, setFilterSector] = useState<string>('all')

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({ title: 'Link Copiado', description: 'Link de acesso copiado.' })
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
              Governança e Acessos
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Gerenciamento de usuários e auditoria do sistema.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                Usuários do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Nome</TableHead>
                    <TableHead className="font-bold text-slate-700">Perfil/Role</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="font-bold text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.userLogins.map((login) => (
                    <TableRow key={login.id} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-slate-900">{login.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white">
                          {login.sector}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            login.status === 'Ativo' ? 'bg-emerald-500 text-white' : 'bg-slate-300'
                          }
                        >
                          {login.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(login.accessLink)}
                          className="text-primary hover:bg-primary/10 font-bold"
                        >
                          <Copy className="w-4 h-4 mr-2" /> Copiar Link
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {state.userLogins.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                        Nenhum usuário cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
                <History className="w-4 h-4 text-secondary" /> Auditoria Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
                {state.accessLogs.map((log, i) => (
                  <div
                    key={i}
                    className="text-xs border-l-2 border-primary pl-3 py-1 bg-slate-50 rounded-r-md"
                  >
                    <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                      {new Date(log.date).toLocaleString('pt-BR')}
                    </span>
                    <span className="font-black text-slate-800">{log.user}</span>
                    <span className="text-slate-600 font-medium"> ({log.role}) acessou </span>
                    <span className="font-bold text-primary">{log.module}</span>
                  </div>
                ))}
                {state.accessLogs.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">Nenhum log registrado.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
