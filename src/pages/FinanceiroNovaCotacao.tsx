import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Calculator } from 'lucide-react'

export default function FinanceiroNovaCotacao() {
  const [form, setForm] = useState({
    cliente_id: '',
    origem: '',
    destino: '',
    peso: '',
    valorNF: '',
  })
  const { toast } = useToast()
  const [isSimulating, setIsSimulating] = useState(false)

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSimulating(true)
    try {
      await pb.collection('documentos_cotacao').create({
        status: 'pendente',
        data_geracao: new Date().toISOString(),
      })
      toast({
        title: 'Cotação Gerada',
        description: 'PDF simulado e salvo com sucesso em documentos_cotacao.',
      })
      setForm({ cliente_id: '', origem: '', destino: '', peso: '', valorNF: '' })
    } catch (err) {
      toast({ title: 'Erro ao gerar', variant: 'destructive' })
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Nova Cotação</h1>
          <p className="text-slate-500">Interface para inserção de dados e geração de cotação.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateQuote} className="space-y-4 max-w-lg">
            <Input
              placeholder="Cliente ID (ou Nome)"
              value={form.cliente_id}
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Origem"
                value={form.origem}
                onChange={(e) => setForm({ ...form, origem: e.target.value })}
                required
              />
              <Input
                placeholder="Destino"
                value={form.destino}
                onChange={(e) => setForm({ ...form, destino: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Peso (kg)"
                value={form.peso}
                onChange={(e) => setForm({ ...form, peso: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Valor da NF (R$)"
                value={form.valorNF}
                onChange={(e) => setForm({ ...form, valorNF: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={isSimulating} className="w-full">
              {isSimulating ? 'Gerando PDF...' : 'Gerar Cotação / Simular PDF'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
