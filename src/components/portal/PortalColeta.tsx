import { useState } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function PortalColeta() {
  const { currentUser, addCollection, collections, requestConfirmation } = usePortalStore()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      form.originCnpj.replace(/\D/g, '').length !== 14 ||
      form.destCnpj.replace(/\D/g, '').length !== 14
    ) {
      toast({ title: 'CNPJ inválido. Preencha os 14 dígitos.', variant: 'destructive' })
      return
    }
    addCollection({
      ...form,
      customerId: currentUser!.customerId!,
      weight: Number(form.weight),
      invoiceValue: Number(form.invoiceValue),
      quantity: Number(form.quantity),
      freightType: form.freightType as 'CIF' | 'FOB',
    })
    toast({ title: 'Coleta agendada e enviada para roteirização.' })
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
  }

  const myCollections = collections
    .filter((c) => c.customerId === currentUser?.customerId)
    .reverse()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Agendar Nova Coleta
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs font-normal">
                  Preencha os dados de origem, destino e da nota fiscal para solicitar uma nova
                  coleta. A equipe de operações será notificada imediatamente.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
              <h3 className="font-bold text-sm text-slate-500 uppercase">Origem</h3>
              <Input
                name="originCnpj"
                placeholder="CNPJ Origem (14 dígitos)"
                value={form.originCnpj}
                onChange={handleChange}
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
                onChange={handleChange}
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
              <h3 className="font-bold text-sm text-slate-500 uppercase">Carga & Nota (Única)</h3>
              <Input
                name="invoiceNumber"
                placeholder="Número da Nota Fiscal"
                value={form.invoiceNumber}
                onChange={handleChange}
                required
              />
              <Input
                name="invoiceValue"
                type="number"
                placeholder="Valor da NFe (R$)"
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
                  placeholder="Qtd. Volumes"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                name="dimensions"
                placeholder="Dimensões (Ex: 100x100x120cm)"
                value={form.dimensions}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
              <h3 className="font-bold text-sm text-slate-500 uppercase">Contato & Frete</h3>
              <Input
                name="contactPhone"
                placeholder="Telefone de Contato"
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
                Solicitar Agendamento de Coleta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suas Coletas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCollections.map((c) => (
              <div
                key={c.id}
                className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    ID: {c.displayId} - NFe {c.invoiceNumber}
                  </p>
                  <p className="text-sm text-slate-500">
                    De: {c.originName} Para: {c.destName}
                  </p>
                  <p className="text-xs mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">
                    Status:{' '}
                    {c.status === 'pending'
                      ? 'Pendente (Em até 48h)'
                      : c.status === 'requested_confirmation'
                        ? 'Aguardando Confirmação'
                        : c.status}{' '}
                    {c.slot && `| Janela: ${c.slot}`}
                  </p>
                </div>
                {c.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      requestConfirmation(c.id)
                      toast({ title: 'Solicitação de confirmação enviada para a equipe.' })
                    }}
                  >
                    Pedir Confirmação
                  </Button>
                )}
              </div>
            ))}
            {myCollections.length === 0 && (
              <p className="text-sm text-slate-500 text-center">Nenhuma coleta agendada.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
