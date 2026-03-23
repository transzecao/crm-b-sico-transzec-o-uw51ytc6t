import { useState } from 'react'
import { Phone, Mail, MessageCircle, AlertCircle, Clock, CheckSquare, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    toast({ title: 'Interação registrada!' })
  }

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="p-5 border-b bg-white">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Sinais do Funil
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-slate-50 border p-3 rounded-md">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Status Atual</p>
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
              <p className="text-xs font-bold text-amber-700 uppercase">Próxima Ação</p>
              <p className="text-sm font-medium text-amber-900">Follow-up sugerido (Sem data)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-b bg-white">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" /> Central de Ações
        </h3>
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-10 mb-4 bg-slate-100">
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-1" /> E-mail
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:text-green-600">
              <MessageCircle className="w-4 h-4 mr-1" /> Whats
            </TabsTrigger>
            <TabsTrigger value="call">
              <Phone className="w-4 h-4 mr-1" /> Ligação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-3 mt-0">
            <Textarea
              placeholder="Componha o e-mail aqui..."
              className="min-h-[120px] text-sm"
              value={commText.email}
              onChange={(e) => setCommText({ ...commText, email: e.target.value })}
            />
            <Button
              className="w-full"
              onClick={() => logInteraction('email')}
              disabled={!commText.email.trim()}
            >
              Enviar e Registrar na Timeline
            </Button>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-3 mt-0">
            <Textarea
              placeholder="Mensagem para o WhatsApp..."
              className="min-h-[120px] text-sm border-green-200 focus-visible:ring-green-500"
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
          </TabsContent>

          <TabsContent value="call" className="space-y-3 mt-0">
            <Textarea
              placeholder="Transcrição ou anotações da ligação..."
              className="min-h-[120px] text-sm"
              value={commText.phone}
              onChange={(e) => setCommText({ ...commText, phone: e.target.value })}
            />
            <Button
              className="w-full"
              onClick={() => logInteraction('phone')}
              disabled={!commText.phone.trim()}
            >
              Salvar Registro de Ligação
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Histórico
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
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-600">{interaction.author}</span>
                    <span className="text-[10px] text-slate-400">{interaction.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
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
