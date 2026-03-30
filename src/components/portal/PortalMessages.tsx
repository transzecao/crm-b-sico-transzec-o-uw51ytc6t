import { useState } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

export function PortalMessages() {
  const { currentUser, addMessage, messages } = usePortalStore()
  const { toast } = useToast()
  const [dept, setDept] = useState('')
  const [msg, setMsg] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    addMessage({ customerId: currentUser!.customerId!, department: dept as any, message: msg })
    toast({ title: 'Mensagem enviada com sucesso!' })
    setMsg('')
    setDept('')
  }

  const myMsgs = messages.filter((m) => m.customerId === currentUser?.customerId).reverse()

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Enviar Mensagem
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs font-normal">
                  Envie mensagens diretas para os departamentos de Coleta ou Financeiro para tirar
                  dúvidas ou resolver pendências.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <Select value={dept} onValueChange={setDept} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Coleta">Operações / Coleta</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Escreva sua mensagem aqui..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              className="h-32"
            />
            <Button type="submit" className="bg-[#800020] hover:bg-[#5c0017]">
              Enviar Mensagem
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Contatos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myMsgs.map((m) => (
            <div key={m.id} className="p-3 bg-slate-50 rounded-xl border">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#800020] uppercase tracking-wider">
                  {m.department}
                </span>
                <span className="text-xs text-slate-500">{m.date}</span>
              </div>
              <p className="text-sm text-slate-800">{m.message}</p>
            </div>
          ))}
          {myMsgs.length === 0 && (
            <p className="text-sm text-slate-500">Nenhuma mensagem enviada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
