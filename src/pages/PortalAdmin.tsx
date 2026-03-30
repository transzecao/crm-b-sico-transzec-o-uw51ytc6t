import usePortalStore from '@/stores/usePortalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function PortalAdmin() {
  const { users, collections, quotes, docRequests, approveUser, rejectUser, updateCollectionSlot } =
    usePortalStore()
  const { toast } = useToast()

  const pendingUsers = users.filter((u) => u.status === 'pending')
  const urgentDocs = docRequests.filter((d) => d.status === 'urgent')
  const pendingCols = collections.filter((c) => c.status === 'pending')

  return (
    <div className="space-y-6 bg-slate-50 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl animate-fade-in-up">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Gestão do Portal do Cliente
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gerencie acessos, solicitações e configurações do portal.
          </p>
        </div>
      </div>

      <Tabs defaultValue="approvals" className="w-full">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-4 h-auto flex-wrap">
          <TabsTrigger value="approvals" className="flex-1 py-2">
            Aprovações ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="coletas" className="flex-1 py-2">
            Coletas ({pendingCols.length})
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex-1 py-2">
            Docs Urgentes ({urgentDocs.length})
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex-1 py-2">
            Cotações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Novos Cadastros (Supervisor Comercial)</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-white mb-2"
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

        <TabsContent value="coletas">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Coleta (Funcionário Coleta)</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCols.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-white mb-2"
                >
                  <div>
                    <p className="font-bold">
                      ID: {c.displayId} - {c.originName} ➔ {c.destName}
                    </p>
                    <p className="text-sm text-slate-500">
                      NFe: {c.invoiceNumber} | Peso: {c.weight}kg | {c.freightType}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      updateCollectionSlot(c.id, 'Amanhã - Manhã')
                      toast({ title: 'Janela confirmada.' })
                    }}
                  >
                    Definir Janela
                  </Button>
                </div>
              ))}
              {pendingCols.length === 0 && (
                <p className="text-slate-500">Nenhuma coleta pendente.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Documentos (Supervisor Financeiro)</CardTitle>
            </CardHeader>
            <CardContent>
              {urgentDocs.map((d) => (
                <div
                  key={d.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-rose-50 mb-2"
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
        </TabsContent>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cotações dos Clientes (Financeiro)</CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-4 border rounded-xl flex justify-between items-center bg-white mb-2"
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
