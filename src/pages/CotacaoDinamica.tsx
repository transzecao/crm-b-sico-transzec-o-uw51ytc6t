import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import useCrmStore from '@/stores/useCrmStore'
import { Calculator, Download } from 'lucide-react'

type FieldConfig = {
  id: string
  name: string
  type: 'text' | 'number' | 'select'
  options?: string
  required: boolean
}

export default function CotacaoDinamica() {
  const [fields, setFields] = useState<FieldConfig[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSimulating, setIsSimulating] = useState(false)
  const { state } = useCrmStore()
  const { toast } = useToast()

  useEffect(() => {
    pb.collection('routing_config')
      .getFirstListItem('name="quote_form_config"')
      .then((res) => {
        if (res.settings && Array.isArray(res.settings.fields)) {
          setFields(res.settings.fields)
          const initialData: Record<string, any> = {}
          res.settings.fields.forEach((f: FieldConfig) => {
            initialData[f.id] = ''
          })
          setFormData(initialData)
        }
      })
      .catch(() => {
        toast({
          title: 'Aviso',
          description: 'Formulário de cotação não configurado pelo gestor financeiro.',
        })
      })
  }, [toast])

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSimulating(true)

    try {
      const baseValue = Math.floor(Math.random() * 1000) + 150

      const details = fields.reduce(
        (acc, f) => {
          acc[f.name] = formData[f.id]
          return acc
        },
        {} as Record<string, any>,
      )

      const numero_cotacao = `COT-DYN-${Math.floor(1000 + Math.random() * 9000)}`

      let origin = 'Interno'
      if (state.role.includes('Financeiro')) origin = 'Funcionario_Financeiro'
      else if (state.role.includes('Coleta')) origin = 'Coleta'
      else if (state.role.includes('Comercial') || state.role.includes('Prospecção'))
        origin = 'Comercial'
      else if (state.role === 'Cliente') origin = 'Portal Cliente'

      await pb.collection('documentos_cotacao').create({
        status: 'pendente',
        data_geracao: new Date().toISOString(),
        numero_cotacao,
        origem: origin,
        valor: baseValue,
        detalhes: details,
        cliente_id: state.currentUser?.id,
      })

      toast({
        title: 'Cotação Gerada',
        description: `Cotação ${numero_cotacao} gerada com sucesso! Valor estimado: R$ ${baseValue},00.`,
      })

      const resetData: Record<string, any> = {}
      fields.forEach((f) => (resetData[f.id] = ''))
      setFormData(resetData)
    } catch (err) {
      toast({ title: 'Erro ao gerar', variant: 'destructive' })
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up p-4 md:p-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cotação Dinâmica</h1>
          <p className="text-slate-500 font-medium mt-1">
            Interface configurada pelo Supervisor Financeiro.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nova Cotação</CardTitle>
          <CardDescription>Preencha os dados abaixo para simular o frete.</CardDescription>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-10 text-slate-500 italic">
              O formulário ainda não foi configurado. Contate o Supervisor Financeiro.
            </div>
          ) : (
            <form onSubmit={handleGenerateQuote} className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">
                    {field.name} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {field.type === 'select' ? (
                    <Select
                      required={field.required}
                      value={formData[field.id]}
                      onValueChange={(val) => setFormData({ ...formData, [field.id]: val })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.split(',').map((opt) => (
                          <SelectItem key={opt.trim()} value={opt.trim()}>
                            {opt.trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type === 'number' ? 'number' : 'text'}
                      required={field.required}
                      value={formData[field.id]}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="bg-white"
                    />
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSimulating}
                  className="w-full bg-primary font-bold"
                >
                  {isSimulating ? (
                    'Processando...'
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" /> Gerar Cotação / Simular
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
