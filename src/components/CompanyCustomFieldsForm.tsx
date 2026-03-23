import { useState } from 'react'
import { Settings, Trash, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="shadow-sm border-slate-200/60 overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-6 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
          <Settings className="w-4 h-4 text-primary" /> Campos Personalizados
        </CardTitle>
        {state.role === 'Master' && (
          <Button
            type="button"
            onClick={() => setShowBuilder(!showBuilder)}
            variant="ghost"
            size="sm"
            className="h-8 text-[11px] font-bold tracking-wider uppercase text-blue-600 hover:bg-blue-50"
          >
            Gerenciar (Master)
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {state.customFieldDefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.customFieldDefs.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {field.name}
                </Label>
                {field.type === 'text' && (
                  <Input
                    value={formData.customData?.[field.id] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customData: { ...(formData.customData || {}), [field.id]: e.target.value },
                      })
                    }
                    className="bg-white"
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    value={formData.customData?.[field.id] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customData: { ...(formData.customData || {}), [field.id]: e.target.value },
                      })
                    }
                    className="bg-white"
                  />
                )}
                {field.type === 'date' && (
                  <Input
                    type="date"
                    value={formData.customData?.[field.id] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customData: { ...(formData.customData || {}), [field.id]: e.target.value },
                      })
                    }
                    className="bg-white"
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
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione..." />
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
          <p className="text-sm text-slate-400 italic">Nenhum campo personalizado cadastrado.</p>
        )}

        {showBuilder && state.role === 'Master' && (
          <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200 mt-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-700">Criar Novo Campo</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Nome do Campo
                </Label>
                <Input
                  value={newDef.name}
                  onChange={(e) => setNewDef({ ...newDef, name: e.target.value })}
                  className="bg-white"
                  placeholder="Ex: Data de Fundação"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tipo de Dado
                </Label>
                <Select
                  value={newDef.type}
                  onValueChange={(v) => setNewDef({ ...newDef, type: v as any, options: [] })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto Curto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="select">Lista de Opções</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {newDef.type === 'select' && (
              <div className="space-y-3 pt-2">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Opções da Lista
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newOpt}
                    onChange={(e) => setNewOpt(e.target.value)}
                    className="bg-white max-w-xs"
                    placeholder="Nova opção..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newOpt.trim()) {
                          setNewDef({
                            ...newDef,
                            options: [...(newDef.options || []), newOpt.trim()],
                          })
                          setNewOpt('')
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
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
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {newDef.options?.map((opt, i) => (
                    <span
                      key={i}
                      className="bg-white border shadow-sm text-xs px-3 py-1.5 rounded-full flex gap-2 items-center font-medium"
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
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {newDef.options?.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Nenhuma opção adicionada</span>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 mt-4">
              <Button variant="outline" onClick={() => setShowBuilder(false)} className="bg-white">
                Cancelar
              </Button>
              <Button onClick={addDef} disabled={!newDef.name.trim()}>
                Salvar Campo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
