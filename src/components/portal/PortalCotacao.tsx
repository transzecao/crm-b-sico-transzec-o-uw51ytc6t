import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
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
import { Label } from '@/components/ui/label'
import { createDocumentoCotacao } from '@/services/documentos_cotacao'
import pb from '@/lib/pocketbase/client'

export function PortalCotacao() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [fields, setFields] = useState<any[]>([])
  const [form, setForm] = useState<Record<string, any>>({})
  const [loadingFields, setLoadingFields] = useState(true)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    pb.collection('routing_config')
      .getFirstListItem('name="quote_dynamic_fields"')
      .then((rec) => {
        const f = rec.settings?.fields || []
        setFields(f)
        const initial: Record<string, any> = {}
        f.forEach((field: any) => {
          initial[field.id] =
            field.type === 'select' && field.options?.length ? field.options[0] : ''
        })
        setForm(initial)
      })
      .catch(console.error)
      .finally(() => setLoadingFields(false))
  }, [])

  const handleSimulateAndSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const weightField = fields.find((f) => f.mappedParam === 'weight')
      const weightVal = weightField ? Number(form[weightField.id]) : Number(form.peso_total) || 10

      const val = weightVal * 1.5 + 150
      const timestamp = new Date().getTime()
      const quoteCode = `${user.id}-${timestamp}`

      const origemField = fields.find(
        (f) => f.id.includes('origem') || (f.id.includes('remetente') && f.id.includes('endereco')),
      )
      const destinoField = fields.find((f) => f.id.includes('destino') && f.id.includes('endereco'))

      const payload = {
        cliente_id: user.id,
        numero_cotacao: quoteCode,
        origem: origemField ? form[origemField.id] : '',
        destino: destinoField ? form[destinoField.id] : '',
        peso: weightVal,
        valor: val,
        status: 'pendente',
        data_geracao: new Date().toISOString(),
        detalhes: form,
      }

      await createDocumentoCotacao(payload)

      setResult({ ...form, value: val, quoteCode, timestamp: new Date().toLocaleString() })
      toast({ title: 'Cotação gerada e salva com sucesso!' })

      const initial: Record<string, any> = {}
      fields.forEach((field: any) => {
        initial[field.id] = field.type === 'select' && field.options?.length ? field.options[0] : ''
      })
      setForm(initial)
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro ao gerar cotação', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (loadingFields) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">Carregando formulário...</div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Nova Cotação Dinâmica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulateAndSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`space-y-2 ${field.type === 'select' || field.id.includes('endereco') ? 'col-span-2' : 'col-span-2 md:col-span-1'}`}
                >
                  <Label>{field.label}</Label>
                  {field.type === 'select' ? (
                    <Select
                      required={field.required}
                      value={form[field.id] || ''}
                      onValueChange={(v) => setForm({ ...form, [field.id]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options || []).map((opt: string) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type === 'number' ? 'number' : 'text'}
                      required={field.required}
                      value={form[field.id] || ''}
                      onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
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
