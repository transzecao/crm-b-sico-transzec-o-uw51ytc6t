import { Button } from '@/components/ui/button'
import { Phone, Mail, Calendar, FileText, MessageCircle } from 'lucide-react'
import { Contact } from '@/stores/useCrmStore'

export function CompanyActionHub({
  company,
  contacts = [],
}: {
  company: any
  contacts?: Contact[]
}) {
  if (!company) {
    return (
      <div className="p-6 text-slate-500 text-sm font-medium flex items-center justify-center h-full text-center">
        Salve o cadastro para habilitar as ações de comunicação.
      </div>
    )
  }

  const primaryContact = contacts.find((c) => c.isPrincipal) || contacts[0]
  const methods = primaryContact?.methods || []

  const phoneVal = methods.find((m) => m.type === 'phone' || m.type === 'whatsapp')?.value || ''
  const wppVal = methods.find((m) => m.type === 'whatsapp')?.value || phoneVal
  const emailVal = methods.find((m) => m.type === 'email')?.value || ''

  const cleanNum = (str: string) => str.replace(/\D/g, '')

  const wppLink = wppVal ? `https://wa.me/55${cleanNum(wppVal)}` : '#'
  const phoneLink = phoneVal ? `tel:${cleanNum(phoneVal)}` : '#'
  const mailLink = emailVal ? `mailto:${emailVal}` : '#'

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-bold text-lg text-slate-900 tracking-tight">Ações Rápidas</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Comunicação direta com o contato principal.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          asChild
          className="flex flex-col h-auto py-5 gap-2 text-primary hover:text-primary hover:bg-primary/10 border-primary/20 shadow-sm cursor-pointer"
        >
          <a href={phoneLink}>
            <Phone className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-wider">Ligar</span>
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="flex flex-col h-auto py-5 gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-sm cursor-pointer"
        >
          <a href={wppLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-wider">WhatsApp</span>
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="flex flex-col h-auto py-5 gap-2 text-secondary hover:text-secondary hover:bg-secondary/10 border-secondary/20 shadow-sm cursor-pointer"
        >
          <a href={mailLink}>
            <Mail className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-wider">E-mail</span>
          </a>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-5 gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 shadow-sm"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-wider">Agendar</span>
        </Button>
      </div>
    </div>
  )
}
