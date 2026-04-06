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
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Plus, Trash2, Save, LayoutTemplate } from 'lucide-react'

type FieldConfig = {
  id: string
  name: string
  type: 'text' | 'number' | 'select'
  options?: string
  required: boolean
}

export default function FinanceiroConfigurador() {
  const [configId, setConfigId] = useState<string>('')
  const [fields, setFields] = useState<FieldConfig[]>([])
  const { toast } = useToast()

  useEffect(() => {
    pb.collection('routing_config')
      .getFirstListItem('name="quote_form_config"')
      .then((res) => {
        setConfigId(res.id)
        if (res.settings && Array.isArray(res.settings.fields)) {
          setFields(res.settings.fields)
        }
      })
      .catch(() => {
        // Not found, will create on save
      })
  }, [])

  const addField = () => {
    setFields([...fields, { id: `field_${Date.now()}`, name: '', type: 'text', required: false }])
  }

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: 'quote_form_config',
        settings: { fields },
      }

      if (configId) {
        await pb.collection('routing_config').update(configId, payload)
      } else {
        const res = await pb.collection('routing_config').create(payload)
        setConfigId(res.id)
      }

      toast({
        title: 'Configuração Salva',
        description: 'A interface de cotação dinâmica foi atualizada com sucesso.',
      })
    } catch (err) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary border border-primary/20">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Configurador de Cotação
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Interface Usuário: Defina os campos da Cotação Dinâmica.
            </p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-primary gap-2">
          <Save className="w-4 h-4" /> Salvar Layout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campos Dinâmicos da Cotação</CardTitle>
          <CardDescription>
            Adicione ou remova campos que os usuários verão ao gerar cotações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border border-slate-100 rounded-lg bg-slate-50"
            >
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500">Nome do Campo</label>
                <Input
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  placeholder="Ex: Destino, Peso..."
                />
              </div>
              <div className="w-full md:w-40 space-y-2">
                <label className="text-xs font-bold text-slate-500">Tipo</label>
                <Select
                  value={field.type}
                  onValueChange={(val: any) => updateField(field.id, { type: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="select">Lista (Select)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {field.type === 'select' && (
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-slate-500">
                    Opções (Separadas por vírgula)
                  </label>
                  <Input
                    value={field.options || ''}
                    onChange={(e) => updateField(field.id, { options: e.target.value })}
                    placeholder="Ex: SP, RJ, MG"
                  />
                </div>
              )}
              <div className="w-full md:w-24 space-y-2">
                <label className="text-xs font-bold text-slate-500">Obrigatório?</label>
                <Select
                  value={field.required ? 'yes' : 'no'}
                  onValueChange={(val) => updateField(field.id, { required: val === 'yes' })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(field.id)}
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 mt-6"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="text-center py-8 text-slate-500 italic">
              Nenhum campo configurado. Adicione campos para montar o formulário de cotação.
            </div>
          )}
          <Button variant="outline" onClick={addField} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Campo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
