import { useState } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PortalCotacao() {
  const { currentUser, addQuote } = usePortalStore()
  const { toast } = useToast()

  const [form, setForm] = useState({ origin: '', dest: '', invoiceNumber: '', weight: '' })
  const [result, setResult] = useState<any>(null)

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault()
    const val = Number(form.weight) * 1.5 + 150
    const quoteCode = `${currentUser?.customerId}${form.invoiceNumber}`
    setResult({ ...form, value: val, quoteCode })
  }

  const handleSave = () => {
    addQuote({
      customerId: currentUser!.customerId!,
      invoiceNumber: result.invoiceNumber,
      origin: result.origin,
      dest: result.dest,
      weight: Number(result.weight),
      value: result.value,
    })
    toast({ title: 'Cotação salva no histórico!' })
    setResult(null)
    setForm({ origin: '', dest: '', invoiceNumber: '', weight: '' })
  }

  const handleDownload = () => {
    toast({ title: 'PDF gerado e baixado com sucesso!' })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Nova Cotação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulate} className="space-y-4">
            <Input
              placeholder="Origem (Cidade/UF)"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              required
            />
            <Input
              placeholder="Destino (Cidade/UF)"
              value={form.dest}
              onChange={(e) => setForm({ ...form, dest: e.target.value })}
              required
            />
            <Input
              placeholder="Número da Nota"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Peso Estimado (kg)"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              required
            />
            <Button type="submit" className="w-full bg-[#0056B3] hover:bg-[#004494]">
              Simular Cotação
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-[#800020] text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl space-y-2">
              <p className="text-sm opacity-80">Código da Cotação:</p>
              <p className="text-xl font-mono font-bold">{result.quoteCode}</p>
              <div className="flex justify-between mt-4 items-end">
                <span className="text-sm opacity-80">Valor Estimado:</span>
                <span className="text-3xl font-black">R$ {result.value.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-white text-[#800020] hover:bg-slate-100"
              >
                Salvar
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 border-white text-white hover:bg-white/10 bg-transparent"
              >
                Baixar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
