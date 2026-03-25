import { Phone, Mail, MessageCircle, Clock, Volume2 } from 'lucide-react'

const interactions = [
  {
    id: 1,
    type: 'whatsapp',
    date: 'Hoje, 10:30',
    content:
      'Mensagem enviada sugerindo call para apresentar cenário competitivo na região de Sumaré.',
    icon: MessageCircle,
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  },
  {
    id: 2,
    type: 'phone',
    date: 'Ontem, 14:15',
    content:
      'Ligação de 5 mins. O cliente informou que "já possui parceiro logístico", mas pediu apresentação por e-mail.',
    transcription:
      '...então, a gente já tem parceiro logístico consolidado, mas se vocês quiserem mandar o material por e-mail, a gente dá uma olhada na volumetria que vocês atendem...',
    icon: Phone,
    color: 'text-blue-500 bg-blue-50 border-blue-200',
  },
  {
    id: 3,
    type: 'email',
    date: '10/10/2023',
    content: 'E-mail de apresentação enviado para a diretoria contendo as vantagens competitivas.',
    icon: Mail,
    color: 'text-orange-500 bg-orange-50 border-orange-200',
  },
]

export function InteractionsTimeline() {
  return (
    <div className="space-y-6 bg-slate-50/60 p-5 rounded-xl border border-slate-200/80 backdrop-blur-sm shadow-inner mt-6">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        Histórico Cronológico Automático
      </h3>
      <div className="space-y-5 border-l-2 border-slate-200/80 ml-3 pl-6 relative pt-2">
        {interactions.map((item) => (
          <div key={item.id} className="relative group">
            <div
              className={`absolute -left-[35px] border-2 rounded-full p-1.5 shadow-sm transition-transform group-hover:scale-110 ${item.color}`}
            >
              <item.icon className="w-4 h-4" />
            </div>
            <div className="bg-white/90 p-4 rounded-lg border border-slate-200/80 shadow-sm backdrop-blur-sm group-hover:border-slate-300 transition-colors">
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                {item.date}
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.content}</p>

              {item.transcription && (
                <div className="mt-3 bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Volume2 className="w-3 h-3" /> Transcrição da IA
                  </p>
                  <p className="text-xs text-slate-600 italic">"{item.transcription}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
