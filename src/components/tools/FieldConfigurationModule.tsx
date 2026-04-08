import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Plus, Save } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'

interface FieldConfig {
  id?: string
  tool: string
  label: string
  type: string
  required: boolean
  showInUserInterface: boolean
  placeholder: string
  defaultValue: string
  order: number
  values: string | string[]
}

export function FieldConfigurationModule({ toolId }: { toolId: string }) {
  const { toast } = useToast()
  const { state } = useCrmStore()
  const [fields, setFields] = useState<FieldConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if (!state.permissions.canManageFields(toolId)) {
    return (
      <div className="p-4 text-center text-rose-500 font-medium">
        Sem permissão para configurar campos.
      </div>
    )
  }

  const loadFields = async () => {
    try {
      setIsLoading(true)
      const records = await pb
        .collection('tool_fields')
        .getFullList({ filter: `tool="${toolId}"`, sort: 'order' })
      setFields(records as any)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFields()
  }, [toolId])

  const handleAdd = () => {
    setFields([
      ...fields,
      {
        tool: toolId,
        label: 'Novo Campo',
        type: 'text',
        required: false,
        showInUserInterface: true,
        placeholder: '',
        defaultValue: '',
        order: fields.length,
        values: '',
      },
    ])
  }

  const handleSaveAll = async () => {
    try {
      setIsLoading(true)
      const existing = await pb
        .collection('tool_fields')
        .getFullList({ filter: `tool="${toolId}"` })
      for (const record of existing) {
        await pb.collection('tool_fields').delete(record.id)
      }

      for (let i = 0; i < fields.length; i++) {
        const field: any = { ...fields[i], order: i }
        delete field.id
        if (typeof field.values === 'string') {
          field.values = field.values
            .split(',')
            .map((v: string) => v.trim())
            .filter(Boolean)
        }
        await pb.collection('tool_fields').create(field)
      }

      toast({ title: 'Configurações salvas com sucesso!' })
      await loadFields()
    } catch (e) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  if (isLoading) return <div className="p-4 text-center">Carregando...</div>

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Configuração de Campos</h2>
        <div className="space-x-2">
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
          <Button onClick={handleSaveAll} size="sm" className="bg-primary">
            <Save className="w-4 h-4 mr-2" /> Salvar Tudo
          </Button>
        </div>
      </div>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Label / Placeholder</TableHead>
              <TableHead className="min-w-[150px]">Tipo</TableHead>
              <TableHead className="min-w-[150px]">Valores (Vírgula)</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((f, i) => (
              <TableRow key={f.id || i}>
                <TableCell className="space-y-2">
                  <Input
                    placeholder="Label"
                    value={f.label}
                    onChange={(e) => {
                      const arr = [...fields]
                      arr[i].label = e.target.value
                      setFields(arr)
                    }}
                  />
                  <Input
                    placeholder="Placeholder"
                    value={f.placeholder}
                    onChange={(e) => {
                      const arr = [...fields]
                      arr[i].placeholder = e.target.value
                      setFields(arr)
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={f.type}
                    onValueChange={(v) => {
                      const arr = [...fields]
                      arr[i].type = v
                      setFields(arr)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="select">Seleção</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    disabled={f.type !== 'select'}
                    value={Array.isArray(f.values) ? f.values.join(', ') : f.values}
                    placeholder="Opção 1, Opção 2"
                    onChange={(e) => {
                      const arr = [...fields]
                      arr[i].values = e.target.value
                      setFields(arr)
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={f.required}
                    onCheckedChange={(v) => {
                      const arr = [...fields]
                      arr[i].required = v
                      setFields(arr)
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(i)}>
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {fields.length === 0 && (
          <div className="p-4 text-center text-slate-500">Nenhum campo configurado.</div>
        )}
      </div>
    </div>
  )
}
