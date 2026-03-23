import { useState } from 'react'
import { Settings, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore, { CustomFieldDef } from '@/stores/useCrmStore'

interface Props {
  formData: any
  setFormData: (data: any) => void
}

export function CompanyCustomFieldsForm({ formData, setFormData }: Props) {
  const { state, updateState } = useCrmStore()
  const [showBuilder, setShowBuilder] = useState(false)
  const [newDef, setNewDef] = useState<Partial<CustomFieldDef>>({
    name: '',
    type: 'text',
    options: [],
  })
  const [newOpt, setNewOpt] = useState('')

  const addDef = () => {
    if (!newDef.name) return
    updateState({
      customFieldDefs: [
        ...state.customFieldDefs,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: newDef.name,
          type: newDef.type as any,
          options: newDef.options,
        },
      ],
    })
    setNewDef({ name: '', type: 'text', options: [] })
    setShowBuilder(false)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Settings className="w-5 h-5" /> Campos Personalizados
        </h2>
        {state.role === 'Master' && (
          <Button
            type="button"
            onClick={() => setShowBuilder(!showBuilder)}
            variant="ghost"
            size="sm"
            className="h-8 text-blue-600 hover:bg-blue-50"
          >
            Gerenciar
          </Button>
        )}
      </div>

      {state.customFieldDefs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.customFieldDefs.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="text-slate-600 font-semibold">{field.name}</Label>
              {field.type === 'text' && (
                <Input
                  value={formData.customData?.[field.id] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customData: { ...(formData.customData || {}), [field.id]: e.target.value },
                    })
                  }
                  className="bg-slate-50"
                />
              )}
              {field.type === 'select' && (
                <Select
                  value={formData.customData?.[field.id] || ''}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      customData: { ...(formData.customData || {}), [field.id]: v },
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">Nenhum campo personalizado.</p>
      )}

      {showBuilder && state.role === 'Master' && (
        <div className="bg-slate-100 p-4 rounded-md border mt-4 space-y-3">
          <h4 className="font-semibold text-sm">Criar Novo Campo</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nome</Label>
              <Input
                value={newDef.name}
                onChange={(e) => setNewDef({ ...newDef, name: e.target.value })}
                className="h-8 bg-white"
              />
            </div>
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select
                value={newDef.type}
                onValueChange={(v) => setNewDef({ ...newDef, type: v as any, options: [] })}
              >
                <SelectTrigger className="h-8 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="select">Lista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {newDef.type === 'select' && (
            <div className="space-y-2">
              <Label className="text-xs">Opções</Label>
              <div className="flex gap-2">
                <Input
                  value={newOpt}
                  onChange={(e) => setNewOpt(e.target.value)}
                  className="h-8 bg-white"
                  placeholder="Opção..."
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newOpt.trim()) {
                      setNewDef({
                        ...newDef,
                        options: [...(newDef.options || []), newOpt.trim()],
                      })
                      setNewOpt('')
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {newDef.options?.map((opt, i) => (
                  <span
                    key={i}
                    className="bg-white border text-xs px-2 py-1 rounded flex gap-1 items-center"
                  >
                    {opt}
                    <button
                      type="button"
                      onClick={() =>
                        setNewDef({
                          ...newDef,
                          options: newDef.options?.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      <Trash className="w-3 h-3 text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowBuilder(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={addDef}>
              Salvar Campo
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
