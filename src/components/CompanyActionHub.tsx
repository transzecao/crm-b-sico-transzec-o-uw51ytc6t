import { useState } from 'react'
import { Phone, Mail, MessageCircle, Clock, Save, Mic, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
import { BrainAnalysis } from './BrainAnalysis'

export function CompanyActionHub({ company }: { company?: Company }) {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()
  const [commText, setCommText] = useState({
    email: '',
    emailSubject: '',
    whatsapp: '',
    whatsappPrincipal: false,
    phone: '',
  })
  const [isTranscribing, setIsTranscribing] = useState(false)

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

  const isManager = ['Master', 'Supervisor', 'Diretoria'].includes(state.role)

  const interactions = state.interactions
    .filter((i) => {
      if (i.companyId !== company.id) return false
      if (!isManager && state.role === 'Comercial') {
        return i.author === state.currentUser.name || i.author === 'Cliente'
      }
      return true
    })
    .reverse()

  const logInteraction = (type: 'email' | 'whatsapp' | 'phone') => {
    const text = commText[type]
    if (typeof text !== 'string' || !text.trim()) return

    const newInteraction: Interaction = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      type,
      content: text,
      date: new Date().toLocaleString('pt-BR'),
      author: state.currentUser.name,
      ...(type === 'email' && { subject: commText.emailSubject || 'Sem Assunto' }),
      ...(type === 'whatsapp' && { isPrincipal: commText.whatsappPrincipal }),
    }

    updateState({ interactions: [...state.interactions, newInteraction] })
    setCommText((prev) => ({ ...prev, [type]: '', ...(type === 'email' && { emailSubject: '' }) }))
    toast({ title: 'Interação registrada no histórico!' })
  }

  const simulateTranscription = () => {
    setIsTranscribing(true)
    setTimeout(() => {
      setCommText((prev) => ({
        ...prev,
        phone:
          'Transcriçao: O cliente demonstrou interesse em avaliar custos de frete. Sugeriu que enviássemos uma proposta teste na próxima sexta-feira.',
      }))
      setIsTranscribing(false)
      toast({ title: 'Áudio transcrito com sucesso! (Precisão > 90%)' })
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
        <BrainAnalysis interactions={interactions} />

        <Card className="shadow-sm border-slate-200/60 bg-white overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-slate-400" /> Central de Ações Multicanal
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
                  <Input
                    placeholder="Assunto do e-mail"
                    value={commText.emailSubject}
                    onChange={(e) => setCommText({ ...commText, emailSubject: e.target.value })}
                    className="bg-slate-50/50 text-sm h-9"
                  />
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
                    Enviar e Registrar E-mail
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
                  <div className="flex items-center space-x-2 bg-emerald-50/50 p-2 rounded-md border border-emerald-100">
                    <Checkbox
                      id="isPrincipal"
                      checked={commText.whatsappPrincipal}
                      onCheckedChange={(c) => setCommText({ ...commText, whatsappPrincipal: !!c })}
                    />
                    <Label
                      htmlFor="isPrincipal"
                      className="text-sm font-medium text-emerald-800 cursor-pointer"
                    >
                      Marcar como Contato Principal
                    </Label>
                  </div>
                  <Textarea
                    placeholder="Mensagem para o WhatsApp (ou cole resposta recebida)..."
                    className="min-h-[100px] text-sm resize-none bg-slate-50/50 border-green-200 focus-visible:ring-green-500"
                    value={commText.whatsapp}
                    onChange={(e) => setCommText({ ...commText, whatsapp: e.target.value })}
                  />
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                    onClick={() => logInteraction('whatsapp')}
                    disabled={!commText.whatsapp.trim()}
                  >
                    Registrar no Histórico
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 italic mt-1">
                    Dica: Digite "Já tenho parceiro" para testar o painel The Brain.
                  </p>
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 font-medium text-xs"
                    >
                      <Phone className="w-3.5 h-3.5 mr-2" /> Ligar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-slate-700 border-slate-200 hover:bg-slate-50 font-medium text-xs"
                      onClick={simulateTranscription}
                      disabled={isTranscribing}
                    >
                      <Mic className="w-3.5 h-3.5 mr-2" />{' '}
                      {isTranscribing ? 'Ouvindo...' : 'Transcrever Áudio'}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Transcrição automática ou anotações da ligação..."
                    className="min-h-[100px] text-sm resize-none bg-slate-50/50"
                    value={commText.phone}
                    onChange={(e) => setCommText({ ...commText, phone: e.target.value })}
                  />
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    onClick={() => logInteraction('phone')}
                    disabled={!commText.phone.trim()}
                  >
                    Salvar Registro de Ligação
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="px-1 pt-2 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Histórico Multicanal
          </h3>
          {interactions.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-white shadow-sm">
              Nenhuma interação registrada.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-300 ml-4 pl-6 space-y-6 pb-2">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="relative">
                  <div
                    className={cn(
                      'absolute -left-[39px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-50 shadow-sm z-10',
                      interaction.type === 'email'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : interaction.type === 'whatsapp'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-purple-50 text-purple-600 border-purple-100',
                    )}
                  >
                    {interaction.type === 'email' && <Mail className="w-3.5 h-3.5" />}
                    {interaction.type === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                    {interaction.type === 'phone' && <Phone className="w-3.5 h-3.5" />}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between mb-2 items-start">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          {interaction.author}
                          {interaction.isPrincipal && (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold flex items-center gap-1">
                              <Star className="w-2.5 h-2.5" /> Principal
                            </span>
                          )}
                        </span>
                        {interaction.subject && (
                          <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            Assunto: {interaction.subject}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0 mt-0.5">
                        {interaction.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed mt-1">
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
