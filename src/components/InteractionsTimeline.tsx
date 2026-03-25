import { Phone, Mail, MessageCircle, Clock, Volume2, FileText } from 'lucide-react'
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
      return 'text-emerald-500 bg-emerald-50 border-emerald-200'
    case 'phone':
      return 'text-blue-500 bg-blue-50 border-blue-200'
    case 'email':
      return 'text-orange-500 bg-orange-50 border-orange-200'
    default:
      return 'text-slate-500 bg-slate-50 border-slate-200'
  }
}

export function InteractionsTimeline({ interactions }: { interactions: Interaction[] }) {
  // Ordena para exibir as mais recentes por cima
  const sorted = [...interactions].reverse()

  return (
    <div className="space-y-6 bg-slate-50/60 p-5 rounded-xl border border-slate-200/80 backdrop-blur-sm shadow-inner mt-6">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        Histórico Unificado de Interações
      </h3>
      <div className="space-y-5 border-l-2 border-slate-200/80 ml-3 pl-6 relative pt-2">
        {sorted.map((item) => {
          const Icon = getIcon(item.type)
          const colorClass = getColor(item.type)

          return (
            <div key={item.id} className="relative group animate-in slide-in-from-bottom-2">
              <div
                className={`absolute -left-[35px] border-2 rounded-full p-1.5 shadow-sm transition-transform group-hover:scale-110 ${colorClass} z-10`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="bg-white/95 p-4 rounded-lg border border-slate-200/80 shadow-sm backdrop-blur-sm group-hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {item.date} • {item.author}
                  </p>
                  {item.duration && (
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                      Duração: {item.duration}
                    </span>
                  )}
                </div>
                {item.subject && (
                  <p className="text-[13px] font-bold text-slate-800 mb-1">{item.subject}</p>
                )}
                <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>

                {item.transcription && (
                  <div className="mt-3 bg-slate-50/80 p-3 rounded-md border border-slate-200 shadow-inner">
                    <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1.5 tracking-wider">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Transcrição da Ligação
                      (IA)
                    </p>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{item.transcription}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-slate-500 italic pt-2">
            Nenhuma interação registrada no histórico desta empresa.
          </p>
        )}
      </div>
    </div>
  )
}
