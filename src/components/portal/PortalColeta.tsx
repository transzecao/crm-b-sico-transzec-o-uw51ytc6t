import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { ScheduleForm } from '@/components/roteirizacao/ScheduleForm'

export function PortalColeta() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<any[]>([])

  const loadSchedules = async () => {
    if (!user) return
    try {
      const res = await pb.collection('collection_schedules').getFullList({
        filter: `creator_id="${user.id}"`,
        sort: '-created',
      })
      setSchedules(res)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadSchedules()
  }, [user])
  useRealtime('collection_schedules', () => {
    loadSchedules()
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Agendar Nova Coleta</CardTitle>
        </CardHeader>
        <ScheduleForm />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suas Coletas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((c) => (
              <div
                key={c.id}
                className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    ID: {c.id.slice(-6).toUpperCase()} - NFe {c.invoice_id}
                  </p>
                  <p className="text-sm text-slate-500">
                    De: {c.sender_name} Para: {c.dest_name}
                  </p>
                  <p className="text-xs mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">
                    Status:{' '}
                    {c.status === 'pending' ? 'Pendente (Em análise)' : 'Roteirizado (Em Rota)'}
                  </p>
                </div>
              </div>
            ))}
            {schedules.length === 0 && (
              <p className="text-sm text-slate-500 text-center">Nenhuma coleta agendada.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
