import { useState } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

export function PortalDocs() {
  const { currentUser, addDocRequest } = usePortalStore()
  const { toast } = useToast()

  const handleRequest = (type: any, data: any) => {
    addDocRequest({ customerId: currentUser!.customerId!, type, data })
    toast({ title: 'Solicitação Urgente enviada ao Financeiro.' })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
      <DocForm
        title="Download XML - PDF"
        type="CTE"
        fields={['Número da Nota Fiscal', 'CNPJ', 'E-mail']}
        onSubmit={handleRequest}
      />
      <DocForm
        title="Download Ordem de Serviço"
        type="OS"
        fields={['CNPJ Remetente', 'CNPJ Destino', 'E-mail']}
        onSubmit={handleRequest}
      />
      <DocForm
        title="Solicitar Fatura"
        type="Fatura"
        fields={['CNPJ', 'E-mail']}
        onSubmit={handleRequest}
      />
      <DocForm
        title="Solicitar Boleto"
        type="Boleto"
        fields={['CNPJ', 'E-mail']}
        onSubmit={handleRequest}
      />
    </div>
  )
}

function DocForm({ title, type, fields, onSubmit }: any) {
  const [data, setData] = useState<any>({})

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs font-normal">
                Solicite a 2ª via ou os arquivos originais (XML/PDF) deste documento. O departamento
                financeiro será notificado com prioridade urgente.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(type, data)
            setData({})
          }}
          className="space-y-3"
        >
          {fields.map((f: string) => (
            <Input
              key={f}
              placeholder={f}
              value={data[f] || ''}
              onChange={(e) => setData({ ...data, [f]: e.target.value })}
              required
            />
          ))}
          <Button
            type="submit"
            variant="outline"
            className="w-full text-[#800020] border-[#800020] hover:bg-[#800020]/10"
          >
            Download {type}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
