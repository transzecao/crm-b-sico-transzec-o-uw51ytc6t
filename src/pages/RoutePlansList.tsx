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
import { Truck } from 'lucide-react'
import { format } from 'date-fns'

export default function RoutePlansList() {
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    pb.collection('route_plans')
      .getFullList({
        sort: '-created',
        expand: 'schedule_id,vehicle_id,created_by',
      })
      .then(setPlans)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up p-4 md:p-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Histórico de Roteirização
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Acompanhe todos os planos de rotas criados no sistema.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Agendamento Ref.</TableHead>
                <TableHead>Criado Por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    {format(new Date(p.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="uppercase font-bold tracking-wider text-[10px] bg-primary/10 text-primary"
                    >
                      {p.cluster}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {p.expand?.vehicle_id?.plate || 'Não definido'}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {p.expand?.schedule_id?.invoice_id || '-'}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {p.expand?.created_by?.name || 'Sistema'}
                  </TableCell>
                </TableRow>
              ))}
              {plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    Nenhum plano de roteirização encontrado.
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
