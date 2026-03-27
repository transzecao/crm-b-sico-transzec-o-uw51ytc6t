import { useState } from 'react'
import { Copy, ShieldAlert, KeyRound, History, ArrowRightLeft } from 'lucide-react'
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

export default function LoginAdmin() {
  const { state } = useCrmStore()
  const { toast } = useToast()

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({ title: 'Link Copiado', description: 'Link de acesso copiado.' })
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
              Governança e Acessos
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Gerenciamento de usuários, permissões e auditoria do sistema.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4 bg-white border border-slate-200 p-1 shadow-sm rounded-lg h-auto flex flex-wrap w-fit">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-2 px-4 font-semibold"
          >
            Usuários e Acessos
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            data-tour="tour-audit"
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-2 px-4 font-semibold"
          >
            Auditoria de Ações (Master)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-0">
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
                                login.status === 'Ativo'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-300'
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
                    <History className="w-4 h-4 text-secondary" /> Log de Acessos Recentes
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
                      <p className="text-sm text-slate-500 text-center py-4">
                        Nenhum log registrado.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-0">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" /> Log Detalhado de Operações
                (Action Audit)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 whitespace-nowrap">
                      Data/Hora
                    </TableHead>
                    <TableHead className="font-bold text-slate-700">Usuário</TableHead>
                    <TableHead className="font-bold text-slate-700">Tipo de Ação</TableHead>
                    <TableHead className="font-bold text-slate-700">Entidade Alvo</TableHead>
                    <TableHead className="font-bold text-slate-700">Valor Anterior</TableHead>
                    <TableHead className="font-bold text-slate-700">Novo Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.auditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50">
                      <TableCell className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-bold text-slate-800">{log.userName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {log.actionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700">{log.targetEntity}</TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        <div className="max-w-[200px] truncate" title={log.prevValue}>
                          {log.prevValue}
                        </div>
                      </TableCell>
                      <TableCell className="text-emerald-700 font-medium text-xs">
                        <div className="max-w-[200px] truncate" title={log.newValue}>
                          {log.newValue}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {state.auditLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        Nenhum log de auditoria registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
