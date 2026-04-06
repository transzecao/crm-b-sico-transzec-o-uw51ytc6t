import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import pb from '@/lib/pocketbase/client'
import { MapIcon } from 'lucide-react'
import { format } from 'date-fns'

export default function RoteirizacaoHistorico() {
  const [schedules, setSchedules] = useState<any[]>([])

  useEffect(() => {
    pb.collection('collection_schedules')
      .getFullList({ sort: '-created', expand: 'creator_id' })
      .then(setSchedules)
      .catch(console.error)
  }, [])

  const getCreatorDesc = (s: any) => {
    const creator = s.expand?.creator_id
    if (!creator) return 'Origem Desconhecida'
    const role = creator.role?.toLowerCase() || ''
    if (role.includes('cliente')) return `ID Cliente: ${creator.id}`
    if (role.includes('supervisor')) return `ID Supervisor: ${creator.id}`
    return `ID Funcionário: ${creator.id}`
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <MapIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Histórico de Coletas</h1>
          <p className="text-slate-500">Acompanhe todas as coletas finalizadas e em andamento.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NF</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Criador</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-primary">{s.invoice_id}</TableCell>
                  <TableCell>{format(new Date(s.created), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-slate-500 text-sm font-medium">
                    {getCreatorDesc(s)}
                  </TableCell>
                  <TableCell>{s.sender_name}</TableCell>
                  <TableCell>{s.dest_name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="uppercase font-bold tracking-wider text-[10px]"
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    Nenhum agendamento encontrado no histórico.
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
