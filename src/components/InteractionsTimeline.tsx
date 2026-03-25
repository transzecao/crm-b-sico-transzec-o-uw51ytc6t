import { Phone, Mail, MessageCircle, Clock, FileText } from 'lucide-react'
import { Interaction } from '@/stores/useCrmStore'

const getIcon = (type: string) => {
  switch (type) {
    case 'whatsapp':
      return MessageCircle
    case 'phone':
      return Phone
    case 'email':
      return Mail
    default:
      return FileText
  }
}

const getColor = (type: string) => {
  switch (type) {
    case 'whatsapp':
      return 'text-emerald-600 bg-emerald-100 border-emerald-200'
    case 'phone':
      return 'text-blue-600 bg-blue-100 border-blue-200'
    case 'email':
      return 'text-orange-600 bg-orange-100 border-orange-200'
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200'
  }
}

export function InteractionsTimeline({ interactions }: { interactions: Interaction[] }) {
  const sorted = [...interactions].reverse()

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <Clock className="w-5 h-5 text-secondary" />
        Histórico Unificado
      </h3>
      <div className="space-y-5 border-l-2 border-slate-100 ml-3 pl-6 relative pt-2">
        {sorted.map((item) => {
          const Icon = getIcon(item.type)
          const colorClass = getColor(item.type)

          return (
            <div key={item.id} className="relative group">
              <div
                className={`absolute -left-[35px] border-2 rounded-full p-1.5 shadow-sm transition-transform group-hover:scale-110 ${colorClass} z-10`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm group-hover:border-primary/40 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.date} • {item.author}
                  </p>
                </div>
                {item.subject && (
                  <p className="text-sm font-bold text-slate-800 mb-1">{item.subject}</p>
                )}
                <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-slate-500 italic pt-2">Nenhuma interação registrada.</p>
        )}
      </div>
    </div>
  )
}
