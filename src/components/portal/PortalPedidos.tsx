import { useEffect, useState } from 'react'
import { getMyAgendamentos } from '@/services/agendamentos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar as CalendarIcon, MapPin, Truck } from 'lucide-react'

export function PortalPedidos() {
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMyAgendamentos()
        setAgendamentos(data)
      } catch (e) {
        console.error('Error loading agendamentos', e)
        // Fallback for empty state
        setAgendamentos([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (agendamentos.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-500">Nenhum agendamento encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {agendamentos.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="bg-slate-50 border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-500" />
                Agendamento #{item.id.slice(0, 8)}
              </CardTitle>
              <Badge variant={item.status === 'Concluído' ? 'default' : 'secondary'}>
                {item.status || 'Pendente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CalendarIcon className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Data / Hora</p>
                <p className="text-sm text-slate-600">
                  {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'} {item.time || ''}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Endereço de Coleta</p>
                <p className="text-sm text-slate-600">
                  {item.address || item.endereco_coleta || 'Não especificado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
