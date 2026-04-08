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

interface FieldConfig {
  id?: string
  tool: string
  label: string
  type: string
  required: boolean
  showInUserInterface: boolean
  placeholder: string
  order: number
  values: string
}

export function FieldConfigurationModule({ toolId }: { toolId: string }) {
  const { toast } = useToast()
  const [fields, setFields] = useState<FieldConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadFields = async () => {
    try {
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
        order: fields.length,
        values: '',
      },
    ])
  }

  const handleSave = async (index: number) => {
    const field = fields[index]
    try {
      if (field.id) {
        await pb.collection('tool_fields').update(field.id, field)
      } else {
        const created = await pb.collection('tool_fields').create(field)
        const newFields = [...fields]
        newFields[index] = created as any
        setFields(newFields)
      }
      toast({ title: 'Campo salvo com sucesso!' })
    } catch (e) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  const handleDelete = async (index: number) => {
    const field = fields[index]
    if (field.id) {
      try {
        await pb.collection('tool_fields').delete(field.id)
        toast({ title: 'Campo excluído!' })
      } catch (e) {
        toast({ title: 'Erro ao excluir', variant: 'destructive' })
        return
      }
    }
    setFields(fields.filter((_, i) => i !== index))
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Configuração de Campos</h2>
        <Button onClick={handleAdd} size="sm" className="bg-primary">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Campo
        </Button>
      </div>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Label</TableHead>
              <TableHead className="min-w-[150px]">Tipo</TableHead>
              <TableHead className="min-w-[150px]">Valores (Vírgula)</TableHead>
              <TableHead>Obrigatório</TableHead>
              <TableHead>Mostrar UI</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((f, i) => (
              <TableRow key={f.id || i}>
                <TableCell>
                  <Input
                    value={f.label}
                    onChange={(e) => {
                      const arr = [...fields]
                      arr[i].label = e.target.value
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
                    value={f.values}
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
                <TableCell>
                  <Switch
                    checked={f.showInUserInterface}
                    onCheckedChange={(v) => {
                      const arr = [...fields]
                      arr[i].showInUserInterface = v
                      setFields(arr)
                    }}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleSave(i)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(i)}>
                    <Trash2 className="w-4 h-4" />
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
