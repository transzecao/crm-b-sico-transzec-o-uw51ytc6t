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

export default function RoteirizacaoHistorico() {
  const [schedules, setSchedules] = useState<any[]>([])

  useEffect(() => {
    pb.collection('collection_schedules')
      .getFullList({ sort: '-created' })
      .then(setSchedules)
      .catch(console.error)
  }, [])

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
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.invoice_id}</TableCell>
                  <TableCell>{s.sender_name}</TableCell>
                  <TableCell>{s.dest_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                    Nenhum agendamento encontrado.
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
