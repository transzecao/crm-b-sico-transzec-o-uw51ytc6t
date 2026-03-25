import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bot, User, Send, BrainCircuit, Sparkles } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function LogisticsChatbox() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Olá! Sou o The Brain, seu assistente logístico. Posso explicar a lógica de otimização da rota, sugerir janelas de entrega ou estimar custos de pedágio. Como posso ajudar?',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const responses = [
        'A rota foi otimizada para evitar a Avenida dos Bandeirantes durante o horário de pico (17h-19h), economizando cerca de 25 minutos.',
        'Se dividirmos a carga em dois veículos Fiorino, conseguimos acessar as zonas ZMRC sem restrição de horário, mas o custo operacional aumentará em 15%.',
        'O custo estimado de combustível é baseado na média de R$ 5,80/litro do diesel na região da Grande São Paulo e no consumo do VUC (7 km/l).',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: 'ai', text: randomResponse }])
    }, 1000)
  }

  return (
    <Card className="border-sky-200 shadow-sm bg-white/90 backdrop-blur-sm flex flex-col h-[400px]">
      <CardHeader className="py-3 px-4 border-b border-sky-100 bg-sky-50/50 shrink-0">
        <CardTitle className="text-sm text-sky-900 font-bold flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-sky-500" /> Assistente Logístico (IA)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-3 text-sm',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm',
                    msg.role === 'ai'
                      ? 'bg-indigo-100 border-indigo-200 text-indigo-600'
                      : 'bg-sky-100 border-sky-200 text-sky-600',
                  )}
                >
                  {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed font-medium',
                    msg.role === 'ai'
                      ? 'bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-none'
                      : 'bg-sky-600 text-white shadow-md rounded-tr-none',
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre rotas, ZMRC, custos..."
              className="pl-9 bg-white border-slate-300 focus-visible:ring-sky-500"
            />
          </div>
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-sky-600 hover:bg-sky-700 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
