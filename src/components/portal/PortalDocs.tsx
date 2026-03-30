import { useState } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
        type="CTe"
        fields={['Nota Fiscal', 'CNPJ', 'Email']}
        onSubmit={handleRequest}
      />
      <DocForm
        title="Download Ordem de Serviço"
        type="OS"
        fields={['CNPJ Remetente', 'CNPJ Destinatário', 'Email']}
        onSubmit={handleRequest}
      />
      <DocForm
        title="Solicitar Fatura"
        type="Fatura"
        fields={['CNPJ', 'Email']}
        onSubmit={handleRequest}
      />
      <DocForm
        title="Solicitar Boleto"
        type="Boleto"
        fields={['CNPJ', 'Email']}
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
        <CardTitle className="text-lg">{title}</CardTitle>
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
            Solicitar Arquivo
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
