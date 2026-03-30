import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Bot, Loader2, Phone } from 'lucide-react'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getLeadByCnpj,
  createLead,
  getMessagesByLead,
  sendWhatsAppMessage,
  receiveWhatsAppMessage,
} from '@/services/leads'
import { ScrollArea } from '@/components/ui/scroll-area'

export function WhatsAppIntegration({ company }: { company: any }) {
  const [lead, setLead] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadData = async () => {
    if (!company?.cnpj) return
    let currentLead = await getLeadByCnpj(company.cnpj)
    if (!currentLead) {
      currentLead = await createLead({
        name: company.nomeFantasia || company.razaoSocial || 'Novo Lead',
        segment: company.segmento || 'Não definido',
        cnpj_id: company.cnpj,
        status: 'Prospection',
        ai_diagnosis: 'Aguardando primeira interação...',
      })
    }
    setLead(currentLead)
    if (currentLead) {
      const msgs = await getMessagesByLead(currentLead.id)
      setMessages(msgs)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [company?.cnpj])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useRealtime('whatsapp_messages', (e) => {
    if (lead && e.record.lead_id === lead.id) {
      if (e.action === 'create') {
        setMessages((prev) => [...prev, e.record])
      }
    }
  })

  useRealtime('leads', (e) => {
    if (lead && e.record.id === lead.id) {
      if (e.action === 'update') {
        setLead(e.record)
      }
    }
  })

  const handleSend = async () => {
    if (!input.trim() || !lead) return
    const msg = input
    setInput('')
    await sendWhatsAppMessage(lead.id, msg)
  }

  const simulateClientReply = async () => {
    if (!lead) return
    await receiveWhatsAppMessage(
      lead.id,
      'Pode me enviar a tabela atualizada com o valor do frete para o interior de SP?',
    )
  }

  const simulateObjection = async () => {
    if (!lead) return
    await receiveWhatsAppMessage(
      lead.id,
      'Obrigado pelo contato, mas já temos um parceiro rodoviário que nos atende bem na região e não pretendemos trocar.',
    )
  }

  if (loading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-emerald-200 shadow-sm flex flex-col h-[450px] lg:h-[500px]">
        <CardHeader className="bg-emerald-50 border-b border-emerald-100 py-3">
          <CardTitle className="text-emerald-800 text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" /> WhatsApp Direto
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50"
              asChild
            >
              <a href={`https://wa.me/5511999999999`} target="_blank" rel="noopener noreferrer">
                <Phone className="w-3 h-3 mr-1" /> Abrir App
              </a>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-opacity-[0.03]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-xs text-slate-500 bg-white/80 p-2 rounded-lg mx-8 shadow-sm">
                  Nenhuma mensagem ainda. Envie a primeira para iniciar a análise da IA!
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${m.direction === 'outbound' ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}
                    >
                      {m.content}
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-end">
                        {new Date(m.created).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="px-3 py-2 bg-slate-50 flex gap-2 justify-center border-t border-slate-200 border-b">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 self-center hidden sm:inline">
              Simuladores:
            </span>
            <Button
              onClick={simulateClientReply}
              variant="outline"
              size="sm"
              className="h-6 text-[10px] border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2"
            >
              <Bot className="w-3 h-3 mr-1" /> Pergunta de Preço
            </Button>
            <Button
              onClick={simulateObjection}
              variant="outline"
              size="sm"
              className="h-6 text-[10px] border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 px-2"
            >
              <Bot className="w-3 h-3 mr-1" /> Objeção de Parceiro
            </Button>
          </div>

          <div className="p-3 bg-white flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite uma mensagem..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-slate-50 border-slate-200"
            />
            <Button
              onClick={handleSend}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 shadow-sm h-[450px] lg:h-[500px] flex flex-col bg-slate-900 text-slate-100">
        <CardHeader className="bg-slate-950/50 border-b border-white/10 py-3">
          <CardTitle className="text-white text-sm font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> Diagnóstico da Conversa (IA)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-5 overflow-auto">
          {lead?.ai_diagnosis === 'Aguardando primeira interação...' ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <Bot className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">Aguardando histórico de mensagens.</p>
            </div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {lead?.ai_diagnosis.split('\n').map((line: string, i: number) => {
                if (line.includes('**')) {
                  const parts = line.split('**')
                  return (
                    <p key={i} className="mb-2">
                      {parts.map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-primary">
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  )
                }
                if (line.startsWith('💡')) {
                  return (
                    <p
                      key={i}
                      className="text-emerald-400 bg-emerald-400/10 p-2 rounded-md border border-emerald-400/20"
                    >
                      {line}
                    </p>
                  )
                }
                return (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
