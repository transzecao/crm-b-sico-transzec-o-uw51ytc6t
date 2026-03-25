import { Button } from '@/components/ui/button'
import { Phone, Mail, Calendar, FileText } from 'lucide-react'

export function CompanyActionHub({ company }: { company: any }) {
  if (!company) {
    return (
      <div className="p-6 text-slate-500 text-sm font-medium flex items-center justify-center h-full text-center">
        Salve o cadastro para habilitar as ações.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-bold text-lg text-slate-900 tracking-tight">Ações Rápidas</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-primary hover:text-primary hover:bg-primary/10 border-primary/20 shadow-sm"
        >
          <Phone className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-wider">Ligar</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-secondary hover:text-secondary hover:bg-secondary/10 border-secondary/20 shadow-sm"
        >
          <Mail className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-wider">E-mail</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-sm"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-wider">Agendar</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 shadow-sm"
        >
          <FileText className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-wider">Nota</span>
        </Button>
      </div>
    </div>
  )
}
