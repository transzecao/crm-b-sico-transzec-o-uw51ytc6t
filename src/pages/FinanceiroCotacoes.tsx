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

export default function FinanceiroCotacoes() {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const [docs, setDocs] = useState<any[]>([])

  const isSupervisor = ['Supervisor Financeiro', 'Acesso Master'].includes(state.role)

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    try {
      const res = await pb.collection('documentos_cotacao').getFullList({ sort: '-created' })
      setDocs(res)
    } catch (e) {}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                {isSupervisor && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{new Date(d.created).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        d.status === 'aprovada'
                          ? 'default'
                          : d.status === 'rejeitada'
                            ? 'destructive'
                            : 'outline'
                      }
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
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => updateStatus(d.id, 'aprovada')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
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
              {docs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-slate-500">
                    Nenhuma cotação encontrada.
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
