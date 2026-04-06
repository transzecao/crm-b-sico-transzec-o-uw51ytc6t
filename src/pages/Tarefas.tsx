import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarClock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export default function Tarefas() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <CalendarClock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <p className="text-slate-500">Gerencie suas tarefas manuais e automatizadas.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tarefas para {date?.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed border-slate-200 rounded-xl">
              <CalendarClock className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-sm">Nenhuma tarefa agendada para este dia.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
