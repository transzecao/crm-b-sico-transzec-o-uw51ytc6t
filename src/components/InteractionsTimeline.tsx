import { Phone, Mail, MessageCircle } from 'lucide-react'

const interactions = [
  {
    id: 1,
    type: 'whatsapp',
    date: 'Hoje, 10:30',
    content: 'Mensagem enviada com proposta comercial.',
    icon: MessageCircle,
    color: 'text-green-500',
  },
  {
    id: 2,
    type: 'phone',
    date: 'Ontem, 14:15',
    content: 'Ligação de 5 mins. Cliente pediu para enviar material por e-mail.',
    icon: Phone,
    color: 'text-blue-500',
  },
  {
    id: 3,
    type: 'email',
    date: '10/10/2023',
    content: 'E-mail de apresentação enviado para a diretoria.',
    icon: Mail,
    color: 'text-orange-500',
  },
]

export function InteractionsTimeline() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Linha do Tempo</h3>
      <div className="space-y-4 border-l-2 border-muted ml-3 pl-6 relative">
        {interactions.map((item) => (
          <div key={item.id} className="relative">
            <div
              className={`absolute -left-[35px] bg-background border-2 rounded-full p-1.5 shadow-sm ${item.color}`}
            >
              <item.icon className="w-4 h-4" />
            </div>
            <div className="bg-card p-3 rounded-lg border shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
              <p className="text-sm">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
