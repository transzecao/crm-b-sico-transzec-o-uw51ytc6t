import usePortalStore from '@/stores/usePortalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

export default function PortalAdmin() {
  const [adminRole, setAdminRole] = useState('Comercial')

  const {
    users,
    collections,
    quotes,
    docRequests,
    messages,
    approveUser,
    rejectUser,
    updateCollectionSlot,
  } = usePortalStore()
  const { toast } = useToast()

  const pendingUsers = users.filter((u) => u.status === 'pending')
  const urgentDocs = docRequests.filter((d) => d.status === 'urgent')
  const pendingCols = collections.filter(
    (c) => c.status === 'pending' || c.status === 'requested_confirmation',
  )
  const financeMsgs = messages.filter((m) => m.department === 'Financeiro')
  const coletaMsgs = messages.filter((m) => m.department === 'Coleta')

  return (
    <div className="space-y-6 bg-slate-50 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Painel Administrativo do Portal
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Acesso segmentado por perfil e ownership de ferramentas.
          </p>
        </div>
        <div className="w-full md:w-64">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Simular Perfil Logado</p>
          <Select value={adminRole} onValueChange={setAdminRole}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comercial">Supervisor Comercial</SelectItem>
              <SelectItem value="Coleta">Supervisor Coleta</SelectItem>
              <SelectItem value="Financeiro">Supervisor Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={adminRole.toLowerCase()} className="w-full">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-4 h-auto flex-wrap w-full hidden">
          <TabsTrigger value="comercial">Comercial</TabsTrigger>
          <TabsTrigger value="coleta">Coleta</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="comercial" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
            <h3 className="font-bold text-blue-800">Acesso Restrito - Supervisor Comercial</h3>
            <p className="text-sm text-blue-600">
              Você gerencia a base geral de clientes e a aprovação de novos cadastros no portal.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Novos Cadastros (Supervisor Comercial)</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-white mb-2 shadow-sm"
                >
                  <div>
                    <p className="font-bold">
                      {u.name}{' '}
                      <span className="text-sm font-normal text-slate-500">({u.cnpj})</span>
                    </p>
                    <p className="text-sm text-slate-600">
                      {u.email} - {u.phone}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                      onClick={() => {
                        approveUser(u.id)
                        toast({ title: 'Aprovado e ID gerado. Email enviado.' })
                      }}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="outline"
                      className="text-rose-600 border-rose-600 hover:bg-rose-50"
                      onClick={() => rejectUser(u.id)}
                    >
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
              {pendingUsers.length === 0 && (
                <p className="text-slate-500">Nenhum cadastro pendente.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coleta" className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-4">
            <h3 className="font-bold text-emerald-800">Acesso Restrito - Supervisor Coleta</h3>
            <p className="text-sm text-emerald-600">
              Gestão exclusiva das parametrizações e agendamentos da ferramenta de Coleta.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Coleta (Funcionário / Supervisor Coleta)</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCols.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-white mb-2 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold">
                        ID: {c.displayId} - {c.originName} ➔ {c.destName}
                      </p>
                      {c.status === 'requested_confirmation' && (
                        <Badge className="bg-amber-500">Confirmação Solicitada</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      NFe: {c.invoiceNumber} | Peso: {c.weight}kg | {c.freightType}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      updateCollectionSlot(c.id, '25 de Março - Manhã')
                      toast({ title: 'Janela confirmada e cliente notificado.' })
                    }}
                  >
                    Confirmar Data/Período
                  </Button>
                </div>
              ))}
              {pendingCols.length === 0 && (
                <p className="text-slate-500">Nenhuma coleta pendente.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mensagens da Coleta</CardTitle>
            </CardHeader>
            <CardContent>
              {coletaMsgs.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border mb-2">
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    Cliente ID: {m.customerId} - {m.date}
                  </p>
                  <p className="text-sm">{m.message}</p>
                </div>
              ))}
              {coletaMsgs.length === 0 && <p className="text-slate-500">Nenhuma mensagem.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mb-4">
            <h3 className="font-bold text-rose-800">Acesso Restrito - Supervisor Financeiro</h3>
            <p className="text-sm text-rose-600">
              Gestão exclusiva das ferramentas de Cotação e Solicitação de Documentos Financeiros.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Urgentes (Supervisor Financeiro)</CardTitle>
              </CardHeader>
              <CardContent>
                {urgentDocs.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 border rounded-xl flex flex-col items-start bg-rose-50 mb-2 shadow-sm gap-2"
                  >
                    <div>
                      <Badge variant="destructive" className="mb-2">
                        URGENTE
                      </Badge>
                      <p className="font-bold">
                        Tipo: {d.type} - Cliente {d.customerId}
                      </p>
                      <p className="text-sm text-slate-600">{JSON.stringify(d.data)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({ title: 'Enviado para o cliente!' })}
                    >
                      Marcar como Resolvido
                    </Button>
                  </div>
                ))}
                {urgentDocs.length === 0 && (
                  <p className="text-slate-500">Nenhuma solicitação urgente.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mensagens Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                {financeMsgs.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl border mb-2">
                    <p className="text-xs font-bold text-slate-500 mb-1">
                      Cliente ID: {m.customerId} - {m.date}
                    </p>
                    <p className="text-sm">{m.message}</p>
                  </div>
                ))}
                {financeMsgs.length === 0 && <p className="text-slate-500">Nenhuma mensagem.</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cotações (Financeiro)</CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-white mb-2 shadow-sm"
                >
                  <div>
                    <p className="font-bold">
                      Cód: {q.quoteCode} - {q.origin} ➔ {q.dest}
                    </p>
                    <p className="text-sm text-slate-500">
                      Cliente {q.customerId} | Peso: {q.weight}kg | Data: {q.date}
                    </p>
                  </div>
                  <span className="font-bold text-[#800020]">R$ {q.value.toFixed(2)}</span>
                </div>
              ))}
              {quotes.length === 0 && <p className="text-slate-500">Nenhuma cotação realizada.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
