import { useState } from 'react'
import { Phone, Mail, MessageCircle, AlertCircle, Clock, CheckSquare, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import useCrmStore, { Interaction, Company } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function CompanyActionHub({ company }: { company?: Company }) {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()
  const [commText, setCommText] = useState({ email: '', whatsapp: '', phone: '' })

  if (!company) {
    return (
      <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
        <div className="bg-white p-6 rounded-lg shadow-xl border text-slate-700 max-w-[300px]">
          <Save className="w-10 h-10 mx-auto text-blue-500 mb-4" />
          <h3 className="font-bold text-lg mb-2">Quase lá!</h3>
          <p className="text-sm">
            Salve a empresa pela primeira vez para ativar a central de comunicação e o histórico.
          </p>
        </div>
      </div>
    )
  }

  const interactions = state.interactions.filter((i) => i.companyId === company.id).reverse()

  const logInteraction = (type: 'email' | 'whatsapp' | 'phone') => {
    const text = commText[type]
    if (!text.trim()) return

    const newInteraction: Interaction = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      type,
      content: text,
      date: new Date().toLocaleString('pt-BR'),
      author: state.role,
    }

    updateState({ interactions: [...state.interactions, newInteraction] })
    setCommText((prev) => ({ ...prev, [type]: '' }))
    toast({ title: 'Interação registrada no histórico!' })
  }

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="p-5 border-b bg-white">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Sinais do Funil
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 p-3 rounded-md">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-700 uppercase">Ações Pendentes</p>
              <p className="text-sm font-medium text-red-900">0 itens atrasados</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-50 border p-3 rounded-md">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Status da Negociação</p>
              <p className="text-sm font-medium text-slate-700">
                {company.pipeline === 'Pipeline de Nutrição'
                  ? 'Nutrição Ativa'
                  : 'Em Prospecção Inicial'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-3 rounded-md">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase">Próxima Ação Planejada</p>
              <p className="text-sm font-medium text-amber-900">Follow-up sugerido (Sem data)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-b bg-slate-50">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" /> Central de Ações
        </h3>

        <Accordion type="single" collapsible defaultValue="email" className="w-full space-y-2">
          <AccordionItem
            value="email"
            className="border rounded-md bg-white overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> E-mail
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0 space-y-3">
              <Textarea
                placeholder="Componha o e-mail aqui..."
                className="min-h-[100px] text-sm resize-none"
                value={commText.email}
                onChange={(e) => setCommText({ ...commText, email: e.target.value })}
              />
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => logInteraction('email')}
                disabled={!commText.email.trim()}
              >
                Enviar e Registrar na Timeline
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="whatsapp"
            className="border rounded-md bg-white overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0 space-y-3">
              <Textarea
                placeholder="Mensagem para o WhatsApp..."
                className="min-h-[100px] text-sm border-green-200 focus-visible:ring-green-500 resize-none"
                value={commText.whatsapp}
                onChange={(e) => setCommText({ ...commText, whatsapp: e.target.value })}
              />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => logInteraction('whatsapp')}
                disabled={!commText.whatsapp.trim()}
              >
                Abrir App e Registrar
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="phone"
            className="border rounded-md bg-white overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-500" /> Ligação
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0 space-y-3">
              <Button
                variant="outline"
                className="w-full text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800"
              >
                <Phone className="w-4 h-4 mr-2" /> Iniciar Ligação Agora
              </Button>
              <Textarea
                placeholder="Transcrição ou anotações da ligação..."
                className="min-h-[100px] text-sm resize-none"
                value={commText.phone}
                onChange={(e) => setCommText({ ...commText, phone: e.target.value })}
              />
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => logInteraction('phone')}
                disabled={!commText.phone.trim()}
              >
                Salvar Registro de Ligação
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Histórico de Interações
        </h3>
        {interactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm border border-dashed rounded-lg bg-white">
            Nenhuma interação registrada.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-3 pl-5 space-y-6">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="relative">
                <div
                  className={cn(
                    'absolute -left-[30px] w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
                    interaction.type === 'email'
                      ? 'bg-blue-100 text-blue-600'
                      : interaction.type === 'whatsapp'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600',
                  )}
                >
                  {interaction.type === 'email' && <Mail className="w-3.5 h-3.5" />}
                  {interaction.type === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                  {interaction.type === 'phone' && <Phone className="w-3.5 h-3.5" />}
                </div>
                <div className="bg-white p-3 rounded-lg border shadow-sm">
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-xs font-bold text-slate-600">{interaction.author}</span>
                    <span className="text-[10px] text-slate-400">{interaction.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {interaction.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
