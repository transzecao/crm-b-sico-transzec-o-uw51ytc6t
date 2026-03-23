import { useState } from 'react'
import { Phone, Mail, MessageCircle, AlertCircle, Clock, CheckSquare, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
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
      <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-[300px]">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Save className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-800">Quase lá!</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
        {/* Lembretes de Funil */}
        <Card className="shadow-sm border-slate-200/60 bg-white overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400" /> Lembretes de Funil
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-red-50/50 border border-red-100 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                    Ações Pendentes
                  </p>
                  <p className="text-sm font-medium text-red-900 mt-0.5">0 itens atrasados</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Status da Negociação
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                    {company.pipeline === 'Pipeline de Nutrição'
                      ? 'Nutrição Ativa'
                      : 'Em Prospecção Inicial'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-100 p-3 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    Próxima Ação Planejada
                  </p>
                  <p className="text-sm font-medium text-amber-900 mt-0.5">
                    Follow-up sugerido (Sem data)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Central de Ações */}
        <Card className="shadow-sm border-slate-200/60 bg-white overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-slate-400" /> Central de Ações
            </h3>

            <Accordion type="single" collapsible defaultValue="email" className="w-full space-y-2">
              <AccordionItem
                value="email"
                className="border border-slate-200/80 rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50/50 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" /> E-mail
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 space-y-3">
                  <Textarea
                    placeholder="Componha o e-mail aqui..."
                    className="min-h-[100px] text-sm resize-none bg-slate-50/50"
                    value={commText.email}
                    onChange={(e) => setCommText({ ...commText, email: e.target.value })}
                  />
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
                    onClick={() => logInteraction('email')}
                    disabled={!commText.email.trim()}
                  >
                    Enviar e Registrar
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="whatsapp"
                className="border border-slate-200/80 rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50/50 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 space-y-3">
                  <Textarea
                    placeholder="Mensagem para o WhatsApp..."
                    className="min-h-[100px] text-sm resize-none bg-slate-50/50 border-green-200 focus-visible:ring-green-500"
                    value={commText.whatsapp}
                    onChange={(e) => setCommText({ ...commText, whatsapp: e.target.value })}
                  />
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                    onClick={() => logInteraction('whatsapp')}
                    disabled={!commText.whatsapp.trim()}
                  >
                    Abrir App e Registrar
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="phone"
                className="border border-slate-200/80 rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50/50 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-500" /> Ligação
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 font-medium"
                  >
                    <Phone className="w-4 h-4 mr-2" /> Iniciar Ligação
                  </Button>
                  <Textarea
                    placeholder="Transcrição ou anotações da ligação..."
                    className="min-h-[100px] text-sm resize-none bg-slate-50/50"
                    value={commText.phone}
                    onChange={(e) => setCommText({ ...commText, phone: e.target.value })}
                  />
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    onClick={() => logInteraction('phone')}
                    disabled={!commText.phone.trim()}
                  >
                    Salvar Registro
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Histórico */}
        <div className="px-1 pt-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Histórico de Interações
          </h3>
          {interactions.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-white shadow-sm">
              Nenhuma interação registrada nesta empresa.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200/80 ml-4 pl-6 space-y-6 pb-6">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="relative">
                  <div
                    className={cn(
                      'absolute -left-[39px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-50 shadow-sm z-10',
                      interaction.type === 'email'
                        ? 'bg-blue-50 text-blue-600'
                        : interaction.type === 'whatsapp'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-purple-50 text-purple-600',
                    )}
                  >
                    {interaction.type === 'email' && <Mail className="w-3.5 h-3.5" />}
                    {interaction.type === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                    {interaction.type === 'phone' && <Phone className="w-3.5 h-3.5" />}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between mb-2 items-center">
                      <span className="text-xs font-bold text-slate-700">{interaction.author}</span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {interaction.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {interaction.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
