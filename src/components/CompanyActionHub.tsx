import { Button } from '@/components/ui/button'
import { Phone, Mail, Calendar, FileText } from 'lucide-react'

export function CompanyActionHub({ company }: { company: any }) {
  if (!company) {
    return (
      <div className="p-6 text-slate-500 text-sm font-medium flex items-center justify-center h-full text-center">
        Salve a ficha da empresa para habilitar o hub de ações rápidas.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-bold text-lg text-slate-800 tracking-tight">Hub de Ações</h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">Interações rápidas com o lead</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
        >
          <Phone className="w-5 h-5" />
          <span className="font-semibold text-xs uppercase tracking-wider">Ligar</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
        >
          <Mail className="w-5 h-5" />
          <span className="font-semibold text-xs uppercase tracking-wider">E-mail</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-semibold text-xs uppercase tracking-wider">Agendar</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm"
        >
          <FileText className="w-5 h-5" />
          <span className="font-semibold text-xs uppercase tracking-wider">Nota</span>
        </Button>
      </div>
    </div>
  )
}
