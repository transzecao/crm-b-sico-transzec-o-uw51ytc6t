import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

export function ScheduleForm() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [form, setForm] = useState({
    originAddress: '',
    originName: '',
    originCnpj: '',
    destAddress: '',
    destName: '',
    destCnpj: '',
    invoiceNumber: '',
    contactPhone: '',
    freightType: 'CIF',
    dimensions: '',
    weight: '',
    invoiceValue: '',
    quantity: '',
  })

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      form.originCnpj.replace(/\D/g, '').length !== 14 ||
      form.destCnpj.replace(/\D/g, '').length !== 14
    ) {
      toast({ title: 'CNPJ inválido. Preencha os 14 dígitos.', variant: 'destructive' })
      return
    }
    try {
      await pb.collection('collection_schedules').create({
        creator_id: user?.id,
        freight_type: form.freightType,
        sender_cnpj: form.originCnpj,
        sender_name: form.originName,
        sender_address: form.originAddress,
        dest_cnpj: form.destCnpj,
        dest_name: form.destName,
        dest_address: form.destAddress,
        invoice_id: form.invoiceNumber,
        quantity: Number(form.quantity),
        total_volume: form.dimensions,
        total_weight: Number(form.weight),
        invoice_value: Number(form.invoiceValue),
        observations: form.contactPhone,
        status: 'pending',
      })
      toast({ title: 'Coleta agendada com sucesso!' })

      const docContent = `AGENDAMENTO DE COLETA
Data/Hora: ${new Date().toLocaleString()}
Criado por (ID): ${user?.id || 'Desconhecido'}
NFe: ${form.invoiceNumber}
Frete: ${form.freightType}
Origem: ${form.originName} (CNPJ: ${form.originCnpj})
Endereço Origem: ${form.originAddress}
Destino: ${form.destName} (CNPJ: ${form.destCnpj})
Endereço Destino: ${form.destAddress}
Peso: ${form.weight}kg | Qtd: ${form.quantity} | Volume: ${form.dimensions}
Valor: R$ ${form.invoiceValue}
Observações: ${form.contactPhone}
`
      const blob = new Blob([docContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Comprovante_Coleta_${form.invoiceNumber}.txt`
      a.click()
      URL.revokeObjectURL(url)

      setForm({
        originAddress: '',
        originName: '',
        originCnpj: '',
        destAddress: '',
        destName: '',
        destCnpj: '',
        invoiceNumber: '',
        contactPhone: '',
        freightType: 'CIF',
        dimensions: '',
        weight: '',
        invoiceValue: '',
        quantity: '',
      })
    } catch (error: any) {
      const fieldErrors = extractFieldErrors(error)
      if (fieldErrors.invoice_id) {
        toast({ title: 'Esta Nota Fiscal já foi agendada.', variant: 'destructive' })
      } else {
        toast({ title: 'Erro ao agendar coleta.', variant: 'destructive' })
      }
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 sm:p-2">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
            <h3 className="font-bold text-sm text-slate-500 uppercase">Origem</h3>
            <Input
              name="originCnpj"
              placeholder="CNPJ Origem (14 dígitos)"
              value={form.originCnpj}
              onChange={(e) =>
                setForm({ ...form, originCnpj: e.target.value.replace(/\D/g, '').slice(0, 14) })
              }
              required
            />
            <Input
              name="originName"
              placeholder="Razão Social Origem"
              value={form.originName}
              onChange={handleChange}
              required
            />
            <Input
              name="originAddress"
              placeholder="Endereço Origem Completo"
              value={form.originAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
            <h3 className="font-bold text-sm text-slate-500 uppercase">Destino</h3>
            <Input
              name="destCnpj"
              placeholder="CNPJ Destino (14 dígitos)"
              value={form.destCnpj}
              onChange={(e) =>
                setForm({ ...form, destCnpj: e.target.value.replace(/\D/g, '').slice(0, 14) })
              }
              required
            />
            <Input
              name="destName"
              placeholder="Razão Social Destino"
              value={form.destName}
              onChange={handleChange}
              required
            />
            <Input
              name="destAddress"
              placeholder="Endereço Destino Completo"
              value={form.destAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
            <h3 className="font-bold text-sm text-slate-500 uppercase">Carga & Nota</h3>
            <Input
              name="invoiceNumber"
              placeholder="Número da NFe"
              value={form.invoiceNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="invoiceValue"
              type="number"
              placeholder="Valor (R$)"
              value={form.invoiceValue}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="weight"
                type="number"
                placeholder="Peso (kg)"
                value={form.weight}
                onChange={handleChange}
                required
              />
              <Input
                name="quantity"
                type="number"
                placeholder="Qtd"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              name="dimensions"
              placeholder="Volume Total"
              value={form.dimensions}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
            <h3 className="font-bold text-sm text-slate-500 uppercase">Contato & Frete</h3>
            <Input
              name="contactPhone"
              placeholder="Telefone / Observações"
              value={form.contactPhone}
              onChange={handleChange}
              required
            />
            <Select
              value={form.freightType}
              onValueChange={(val) => setForm({ ...form, freightType: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Frete" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CIF">CIF (Remetente Paga)</SelectItem>
                <SelectItem value="FOB">FOB (Destinatário Paga)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 mt-2">
            <Button type="submit" className="w-full bg-[#800020] hover:bg-[#5c0017]">
              Solicitar Agendamento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
