import { Phone, Mail, MessageCircle, Clock } from 'lucide-react'

const interactions = [
  {
    id: 1,
    type: 'whatsapp',
    date: 'Hoje, 10:30',
    content: 'Mensagem enviada com proposta comercial.',
    icon: MessageCircle,
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  },
  {
    id: 2,
    type: 'phone',
    date: 'Ontem, 14:15',
    content: 'Ligação de 5 mins. Cliente pediu para enviar material por e-mail.',
    icon: Phone,
    color: 'text-blue-500 bg-blue-50 border-blue-200',
  },
  {
    id: 3,
    type: 'email',
    date: '10/10/2023',
    content: 'E-mail de apresentação enviado para a diretoria.',
    icon: Mail,
    color: 'text-orange-500 bg-orange-50 border-orange-200',
  },
]

export function InteractionsTimeline() {
  return (
    <div className="space-y-6 bg-slate-50/60 p-5 rounded-xl border border-slate-200/80 backdrop-blur-sm shadow-inner">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        Histórico de Interações
      </h3>
      <div className="space-y-5 border-l-2 border-slate-200/80 ml-3 pl-6 relative">
        {interactions.map((item) => (
          <div key={item.id} className="relative group">
            <div
              className={`absolute -left-[35px] border-2 rounded-full p-1.5 shadow-sm transition-transform group-hover:scale-110 ${item.color}`}
            >
              <item.icon className="w-4 h-4" />
            </div>
            <div className="bg-white/80 p-3.5 rounded-lg border border-slate-200/80 shadow-sm backdrop-blur-sm group-hover:border-slate-300 transition-colors">
              <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                {item.date}
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
