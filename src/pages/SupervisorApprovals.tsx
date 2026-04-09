import { useEffect, useState } from 'react'
import { Check, X, ClipboardCheck, Building2, Fingerprint, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'
import { getPendingApprovals, updateLeadStatus } from '@/services/leads'
import { useRealtime } from '@/hooks/use-realtime'
import useCrmStore from '@/stores/useCrmStore'
import { Navigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PendingLead {
  id: string
  name: string
  cnpj_id: string
  segment: string
  created: string
  status: string
}

interface PendingLeadResponse {
  id?: string
  name?: string
  cnpj_id?: string
  segment?: string
  created?: string
  status?: string
  [key: string]: any
}

export default function SupervisorApprovals() {
  const { state } = useCrmStore()
  const [leads, setLeads] = useState<PendingLead[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()

  const isAuthorized = ['Acesso Master', 'Supervisor Comercial'].includes(state.user.role)

  const fetchLeads = async () => {
    try {
      const data = await getPendingApprovals()
      if (Array.isArray(data)) {
        const mapped = data.map(
          (item: PendingLeadResponse): PendingLead => ({
            id: item.id || '',
            name: item.name || '',
            cnpj_id: item.cnpj_id || '',
            segment: item.segment || '',
            created: item.created || '',
            status: item.status || '',
          }),
        )
        setLeads(mapped)
      } else {
        setLeads([])
      }
    } catch (error) {
      console.error('Failed to fetch pending leads:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchLeads()
    }
  }, [isAuthorized])

  useRealtime('leads', () => {
    if (isAuthorized) fetchLeads()
  })

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setProcessingId(id)
    try {
      await updateLeadStatus(id, action)
      toast({
        title: action === 'approved' ? 'Lead Aprovado' : 'Lead Rejeitado',
        description:
          action === 'approved'
            ? 'O lead foi aprovado e agora tem acesso liberado.'
            : 'O lead foi rejeitado e o cadastro foi bloqueado.',
        variant: action === 'approved' ? 'default' : 'destructive',
      })
      setLeads((prev) => prev.filter((lead) => lead.id !== id))
    } catch (error) {
      toast({
        title: 'Erro na operação',
        description: 'Não foi possível atualizar o status do lead. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ClipboardCheck className="w-7 h-7 text-blue-700" />
          </div>
          Aprovações Pendentes
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Gerencie e revise os novos cadastros de leads que estão aguardando aprovação para ingresso
          no portal.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 bg-white">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg text-slate-800 font-bold flex items-center gap-2">
            Leads Aguardando Revisão
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 ml-2">
              {leads.length} pendentes
            </Badge>
          </CardTitle>
          <CardDescription>
            Aprove ou rejeite a entrada de novos clientes na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" /> Nome do Lead
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-slate-400" /> CNPJ
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">Segmento</TableHead>
                  <TableHead className="font-bold text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-slate-400" /> Data de Cadastro
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p>Carregando pendências...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="bg-slate-100 p-4 rounded-full">
                          <Check className="w-8 h-8 text-slate-400" />
                        </div>
                        <p>Nenhum lead pendente no momento.</p>
                        <p className="text-sm text-slate-400">Bom trabalho!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-900">{lead.name}</TableCell>
                      <TableCell className="text-slate-600 font-mono text-sm">
                        {lead.cnpj_id || 'Não informado'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-slate-600 bg-slate-50">
                          {lead.segment || 'Geral'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {lead.created
                          ? format(new Date(lead.created), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                            onClick={() => handleAction(lead.id, 'approved')}
                            disabled={processingId === lead.id}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                            onClick={() => handleAction(lead.id, 'rejected')}
                            disabled={processingId === lead.id}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
