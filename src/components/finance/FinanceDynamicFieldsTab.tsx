import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Trash2, Plus, Save } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { useSafeFetch } from '@/hooks/useSafeFetch'
import { DynamicField } from '@/types/fleet'

interface _DynamicField {
  // Kept to avoid syntax errors if needed, but removed original
  id: string
  label: string
  type: string
  required: boolean
  mappedParam: string
  values?: string[]
}

export function FinanceDynamicFieldsTab() {
  const [fields, setFields] = useState<DynamicField[]>([])
  const [recordId, setRecordId] = useState<string | null>(null)
  const { execute, loading } = useSafeFetch()
  const { toast } = useToast()

  useEffect(() => {
    execute(async () => {
      const rec = await pb
        .collection('routing_config')
        .getFirstListItem('name="quote_dynamic_fields"')
      setRecordId(rec.id)
      setFields(rec.settings?.fields || [])
      return rec
    })
  }, [execute])

  const handleSave = async () => {
    if (!recordId) return
    await execute(async () => {
      await pb.collection('routing_config').update(recordId, {
        settings: { fields },
      })
    }, 'Campos salvos com sucesso!')
  }

  const addField = () => {
    const newId = `field_${Date.now()}`
    setFields([
      ...fields,
      { id: newId, label: 'Novo Campo', type: 'text', required: false, mappedParam: '' },
    ])
  }

  const updateField = (index: number, updates: Partial<DynamicField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    setFields(newFields)
  }

  const moveField = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= fields.length) return
    const newFields = [...fields]
    const temp = newFields[index]
    newFields[index] = newFields[index + direction]
    newFields[index + direction] = temp
    setFields(newFields)
  }

  return (
    <Card className="border-none shadow-sm animate-fade-in-up mt-6">
      <CardHeader className="bg-white rounded-t-xl border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl text-slate-800">
            Interface Usuário: Defina os campos da Cotação Dinâmica
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Configure os parâmetros e formulários visíveis para Cotação.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="gap-2 shrink-0 bg-primary hover:bg-primary/90"
        >
          <Save className="w-4 h-4" /> Salvar Campos
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-4 bg-slate-50 rounded-b-xl border border-slate-200">
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg bg-white shadow-sm relative group"
          >
            <div className="flex flex-col gap-1 mt-2 opacity-50 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveField(i, -1)}
                disabled={i === 0}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => moveField(i, 1)}
                disabled={i === fields.length - 1}
              >
                ↓
              </Button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Label do Campo</Label>
                <Input
                  value={f.label}
                  onChange={(e) => updateField(i, { label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={f.type} onValueChange={(val) => updateField(i, { type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="select">Lista (Select)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vincular a Parâmetro</Label>
                <Select
                  value={f.mappedParam || 'none'}
                  onValueChange={(val) =>
                    updateField(i, { mappedParam: val === 'none' ? '' : val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="weight">Peso do Motor (weight)</SelectItem>
                    <SelectItem value="volume">Volume (volume)</SelectItem>
                    <SelectItem value="nfValue">Valor NF (nfValue)</SelectItem>
                    <SelectItem value="max_cpk">CPK Máximo (fleet_settings)</SelectItem>
                    <SelectItem value="min_margin">Margem Mínima (fleet_settings)</SelectItem>
                    <SelectItem value="taxas_fiscal">Taxas Fiscais (fleet_settings)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch
                  checked={f.required}
                  onCheckedChange={(val) => updateField(i, { required: val })}
                />
                <Label>Obrigatório</Label>
              </div>

              {f.type === 'select' && (
                <div className="space-y-2 lg:col-span-4">
                  <Label>Opções (separadas por vírgula)</Label>
                  <Input
                    value={(f.values || []).join(', ')}
                    onChange={(e) =>
                      updateField(i, {
                        values: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Opção 1, Opção 2"
                  />
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
              onClick={() => removeField(i)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full border-dashed border-2 py-8 text-slate-500 hover:text-slate-800 bg-white"
          onClick={addField}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Novo Campo
        </Button>
      </CardContent>
    </Card>
  )
}
