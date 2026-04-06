import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { createDocumentoCotacao } from '@/services/documentos_cotacao'

export function PortalCotacao() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [form, setForm] = useState({
    cnpj_remetente: '',
    endereco_remetente: '',
    peso_total: '',
    quantidade_total: '',
    volume_total: '',
    valor_nf: '',
    numero_nf: '',
    tipo_frete: 'CIF',
    cnpj_destino: '',
    endereco_destino: '',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSimulateAndSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const val = Number(form.peso_total) * 1.5 + 150
      const timestamp = new Date().getTime()
      const quoteCode = `${user.id}-${timestamp}`

      const payload = {
        cliente_id: user.id,
        numero_cotacao: quoteCode,
        origem: form.endereco_remetente,
        destino: form.endereco_destino,
        peso: Number(form.peso_total),
        valor: val,
        status: 'pendente',
        data_geracao: new Date().toISOString(),
        detalhes: form,
      }

      await createDocumentoCotacao(payload)

      setResult({ ...form, value: val, quoteCode, timestamp: new Date().toLocaleString() })
      toast({ title: 'Cotação gerada e salva com sucesso!' })
      setForm({
        cnpj_remetente: '',
        endereco_remetente: '',
        peso_total: '',
        quantidade_total: '',
        volume_total: '',
        valor_nf: '',
        numero_nf: '',
        tipo_frete: 'CIF',
        cnpj_destino: '',
        endereco_destino: '',
      })
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao gerar cotação', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Nova Cotação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulateAndSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>CNPJ Remetente</Label>
                <Input
                  required
                  placeholder="Ex: 00.000.000/0000-00"
                  value={form.cnpj_remetente}
                  onChange={(e) => setForm({ ...form, cnpj_remetente: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Endereço Remetente</Label>
                <Input
                  required
                  placeholder="Rua, Número, Cidade - UF"
                  value={form.endereco_remetente}
                  onChange={(e) => setForm({ ...form, endereco_remetente: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>CNPJ Destino</Label>
                <Input
                  required
                  placeholder="Ex: 00.000.000/0000-00"
                  value={form.cnpj_destino}
                  onChange={(e) => setForm({ ...form, cnpj_destino: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Endereço Destino</Label>
                <Input
                  required
                  placeholder="Rua, Número, Cidade - UF"
                  value={form.endereco_destino}
                  onChange={(e) => setForm({ ...form, endereco_destino: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Peso Total (kg)</Label>
                <Input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={form.peso_total}
                  onChange={(e) => setForm({ ...form, peso_total: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade Total</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={form.quantidade_total}
                  onChange={(e) => setForm({ ...form, quantidade_total: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Volume Total (m³)</Label>
                <Input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.volume_total}
                  onChange={(e) => setForm({ ...form, volume_total: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor da NF (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.valor_nf}
                  onChange={(e) => setForm({ ...form, valor_nf: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Número da NF</Label>
                <Input
                  required
                  value={form.numero_nf}
                  onChange={(e) => setForm({ ...form, numero_nf: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Tipo de Frete</Label>
                <RadioGroup
                  value={form.tipo_frete}
                  onValueChange={(v) => setForm({ ...form, tipo_frete: v })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CIF" id="cif" />
                    <Label htmlFor="cif" className="cursor-pointer font-normal">
                      CIF (Pago na Origem)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FOB" id="fob" />
                    <Label htmlFor="fob" className="cursor-pointer font-normal">
                      FOB (Pago no Destino)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056B3] hover:bg-[#004494]"
            >
              {loading ? 'Gerando...' : 'Gerar Cotação'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-[#800020] text-white border-none shadow-xl h-fit sticky top-6">
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl space-y-2">
              <p className="text-sm opacity-80">Número do Documento (ID):</p>
              <p className="text-lg font-mono font-bold break-all">{result.quoteCode}</p>
              <div className="flex justify-between mt-4 items-end">
                <span className="text-sm opacity-80">Valor Estimado:</span>
                <span className="text-3xl font-black">R$ {result.value.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={() => toast({ title: 'Download iniciado!' })}
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10 bg-transparent"
            >
              Baixar PDF Simulado
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
