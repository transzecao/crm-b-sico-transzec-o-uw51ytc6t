import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { getMyCollectionSchedules } from '@/services/collection_schedules'
import { useRealtime } from '@/hooks/use-realtime'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export function PortalPedidos() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<any[]>([])

  const loadData = async () => {
    if (!user) return
    const res = await getMyCollectionSchedules(user.id)
    setSchedules(res)
  }

  useEffect(() => {
    loadData()
  }, [user])

  useRealtime('collection_schedules', () => loadData())

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Meus Pedidos (Agendamentos de Coleta)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedules.map((s) => (
          <div
            key={s.id}
            className="p-4 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#800020]">NF: {s.invoice_id}</p>
                <Badge
                  variant={s.status === 'pending' ? 'secondary' : 'default'}
                  className="uppercase text-[10px]"
                >
                  {s.status === 'pending' ? 'Pendente' : 'Roteirizado'}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {s.sender_name} ➔ {s.dest_name}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-400">
                <span>Criado em: {format(new Date(s.created), 'dd/MM/yyyy')}</span>
                <span>Frete: {s.freight_type}</span>
                {s.total_volume && <span>Vol: {s.total_volume}</span>}
                <span>Peso: {s.total_weight}kg</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-slate-500">Valor NF</span>
              <span className="font-black text-slate-800">
                R$ {s.invoice_value ? s.invoice_value.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">Nenhum pedido de coleta encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
