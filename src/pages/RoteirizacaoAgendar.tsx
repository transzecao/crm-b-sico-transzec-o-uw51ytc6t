import { Card, CardContent } from '@/components/ui/card'
import { ScheduleForm } from '@/components/roteirizacao/ScheduleForm'
import { CalendarClock } from 'lucide-react'

export default function RoteirizacaoAgendar() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <CalendarClock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Agendar Coleta</h1>
          <p className="text-slate-500">Insira os dados para agendar uma nova coleta CIF/FOB.</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <ScheduleForm />
        </CardContent>
      </Card>
    </div>
  )
}
