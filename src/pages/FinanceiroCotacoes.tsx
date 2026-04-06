import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import pb from '@/lib/pocketbase/client'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { Check, X, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FinanceiroCotacoes() {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const [docs, setDocs] = useState<any[]>([])
  const [tab, setTab] = useState('todas')

  const isSupervisor = ['Supervisor Financeiro', 'Acesso Master', 'Supervisor_Financeiro'].includes(
    state.role,
  )
  const isFuncFinanceiro = ['Funcionário Financeiro', 'Funcionario_Financeiro'].includes(state.role)

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    try {
      const res = await pb
        .collection('documentos_cotacao')
        .getFullList({ sort: '-created', expand: 'funcionario_financeiro_id,cliente_id' })
      setDocs(res)
    } catch (e) {
      console.error('Error loading docs:', e)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await pb.collection('documentos_cotacao').update(id, { status })
      toast({ title: `Cotação ${status}` })
      loadDocs()
    } catch (e) {
      toast({ title: 'Erro', variant: 'destructive' })
    }
  }

  const getFilteredDocs = () => {
    if (!isFuncFinanceiro) return docs
    if (tab === 'minhas') return docs.filter((d) => d.origem === 'Funcionario_Financeiro')
    if (tab === 'portal') return docs.filter((d) => d.origem === 'Cliente')
    if (tab === 'comercial') return docs.filter((d) => d.origem === 'Comercial')
    if (tab === 'coleta') return docs.filter((d) => d.origem === 'Coleta')
    return docs
  }

  const filteredDocs = getFilteredDocs()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {isSupervisor ? 'Cotações Pendentes' : 'Histórico de Cotações'}
          </h1>
          <p className="text-slate-500">Gestão de documentos de cotação.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          {isFuncFinanceiro && (
            <Tabs value={tab} onValueChange={setTab} className="mb-4">
              <TabsList className="flex flex-wrap h-auto bg-slate-50 border border-slate-200">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="minhas">Feitas por mim</TabsTrigger>
                <TabsTrigger value="portal">Portal do Cliente</TabsTrigger>
                <TabsTrigger value="comercial">Comercial</TabsTrigger>
                <TabsTrigger value="coleta">Coleta</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente ID / Documento</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                {isSupervisor && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{new Date(d.created).toLocaleDateString()}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {d.numero_cotacao || d.cliente_id || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium text-slate-600 bg-slate-100">
                      {d.origem || 'Interno'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        d.status === 'aprovada'
                          ? 'default'
                          : d.status === 'rejeitada'
                            ? 'destructive'
                            : 'outline'
                      }
                      className="uppercase text-[10px] tracking-wider"
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  {isSupervisor && (
                    <TableCell className="text-right">
                      {d.status === 'pendente' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updateStatus(d.id, 'aprovada')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateStatus(d.id, 'rejeitada')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filteredDocs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isSupervisor ? 5 : 4}
                    className="text-center py-6 text-slate-500"
                  >
                    Nenhuma cotação encontrada neste filtro.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
