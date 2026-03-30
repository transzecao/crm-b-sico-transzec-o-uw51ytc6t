import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEngineStore, DynamicField, TieredRule, EngineModule } from '@/stores/useEngineStore'
import { Plus, Trash2, Settings, Save, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function FinanceEngineTab() {
  const { draft, isDraftDirty, updateDraft, publishDraft, discardDraft, published } =
    useEngineStore()
  const { toast } = useToast()

  const handleModuleToggle = (id: string) => {
    const modules = draft.modules.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    updateDraft({ modules })
  }

  const addModule = () => {
    const newModule: EngineModule = {
      id: `mod-${Date.now()}`,
      name: 'Novo Módulo',
      isActive: true,
      isBuiltIn: false,
    }
    updateDraft({ modules: [...draft.modules, newModule] })
  }

  const updateModule = (id: string, name: string) => {
    updateDraft({ modules: draft.modules.map((m) => (m.id === id ? { ...m, name } : m)) })
  }

  const deleteModule = (id: string) => {
    updateDraft({
      modules: draft.modules.filter((m) => m.id !== id),
      fields: draft.fields.filter((f) => f.moduleId !== id),
      rules: draft.rules.filter((r) => r.moduleId !== id),
    })
  }

  const addField = () => {
    if (draft.modules.length === 0) return
    const newField: DynamicField = {
      id: `field-${Date.now()}`,
      name: 'Novo Campo',
      type: 'currency',
      moduleId: draft.modules[0].id,
      defaultValue: 0,
    }
    updateDraft({ fields: [...draft.fields, newField] })
  }

  const updateField = (id: string, updates: Partial<DynamicField>) => {
    updateDraft({ fields: draft.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)) })
  }

  const deleteField = (id: string) => {
    updateDraft({ fields: draft.fields.filter((f) => f.id !== id) })
  }

  const addRule = () => {
    if (draft.modules.length === 0) return
    const newRule: TieredRule = {
      id: `rule-${Date.now()}`,
      moduleId: draft.modules[0].id,
      basedOn: 'weight',
      min: 0,
      max: null,
      value: 0,
      isPercentage: false,
    }
    updateDraft({ rules: [...draft.rules, newRule] })
  }

  const updateRule = (id: string, updates: Partial<TieredRule>) => {
    updateDraft({ rules: draft.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)) })
  }

  const deleteRule = (id: string) => {
    updateDraft({ rules: draft.rules.filter((r) => r.id !== id) })
  }

  const handlePublish = () => {
    publishDraft()
    toast({
      title: 'Motor Publicado',
      description: 'As regras foram aplicadas com sucesso e estão ativas no operacional.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Configuração do Motor (Engine)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {published
              ? 'Uma versão está publicada e ativa.'
              : 'Nenhuma versão publicada. O operacional está bloqueado.'}
          </p>
        </div>
        <div className="flex gap-3">
          {isDraftDirty && (
            <Button variant="outline" onClick={discardDraft} className="text-slate-600">
              Descartar Rascunho
            </Button>
          )}
          <Button
            onClick={handlePublish}
            className={cn('gap-2', isDraftDirty ? 'bg-primary' : 'bg-green-600 hover:bg-green-700')}
          >
            {isDraftDirty ? <Save className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {isDraftDirty ? 'Publicar Alterações' : 'Motor Publicado'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-700">Módulos de Cálculo</CardTitle>
            <Button size="sm" variant="ghost" onClick={addModule}>
              <Plus className="w-4 h-4 mr-1" /> Novo
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {draft.modules.map((m) => (
                <div
                  key={m.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Switch checked={m.isActive} onCheckedChange={() => handleModuleToggle(m.id)} />
                    {m.isBuiltIn ? (
                      <span className="font-medium text-slate-700">
                        {m.name}{' '}
                        <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded ml-1 uppercase tracking-wider">
                          Padrão
                        </span>
                      </span>
                    ) : (
                      <Input
                        value={m.name}
                        onChange={(e) => updateModule(m.id, e.target.value)}
                        className="h-8 w-40 font-medium"
                      />
                    )}
                  </div>
                  {!m.isBuiltIn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteModule(m.id)}
                      className="text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-700">
              Campos Dinâmicos (Entradas)
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={addField}>
              <Plus className="w-4 h-4 mr-1" /> Novo
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {draft.fields.map((f) => (
                <div key={f.id} className="p-4 space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={f.name}
                      onChange={(e) => updateField(f.id, { name: e.target.value })}
                      className="h-8 font-medium bg-white"
                      placeholder="Nome do Campo"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteField(f.id)}
                      className="text-rose-400 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={f.moduleId}
                      onValueChange={(v) => updateField(f.id, { moduleId: v })}
                    >
                      <SelectTrigger className="h-8 flex-1 bg-white">
                        <SelectValue placeholder="Vincular ao Módulo" />
                      </SelectTrigger>
                      <SelectContent>
                        {draft.modules.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.1"
                      value={f.defaultValue}
                      onChange={(e) => updateField(f.id, { defaultValue: Number(e.target.value) })}
                      className="h-8 w-24 bg-white"
                      placeholder="Valor Padrão"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 lg:col-span-2">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-700">
              Escalonamento de Regras (Tiered Logic)
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={addRule}>
              <Plus className="w-4 h-4 mr-1" /> Nova Regra
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {draft.rules.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Nenhuma regra de escalonamento definida. O cálculo usará os valores padrão
                  informados nos campos.
                </div>
              )}
              {draft.rules.map((r) => (
                <div
                  key={r.id}
                  className="p-4 flex flex-wrap gap-4 items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 p-1 px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Se
                    </span>
                    <Select
                      value={r.basedOn}
                      onValueChange={(v: any) => updateRule(r.id, { basedOn: v })}
                    >
                      <SelectTrigger className="h-7 w-[110px] text-xs border-none shadow-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Peso (kg)</SelectItem>
                        <SelectItem value="nfValue">Valor da NF</SelectItem>
                        <SelectItem value="distance">Distância (km)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      For Entre
                    </span>
                    <Input
                      type="number"
                      value={r.min}
                      onChange={(e) => updateRule(r.id, { min: Number(e.target.value) })}
                      className="h-8 w-20 text-center bg-white"
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      E
                    </span>
                    <Input
                      type="number"
                      value={r.max || ''}
                      onChange={(e) =>
                        updateRule(r.id, { max: e.target.value ? Number(e.target.value) : null })
                      }
                      className="h-8 w-20 text-center bg-white"
                      placeholder="Máx"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Aplicar No Módulo
                    </span>
                    <Select
                      value={r.moduleId}
                      onValueChange={(v) => updateRule(r.id, { moduleId: v })}
                    >
                      <SelectTrigger className="h-8 w-[140px] bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {draft.modules.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Valor
                    </span>
                    <Input
                      type="number"
                      step="0.1"
                      value={r.value}
                      onChange={(e) => updateRule(r.id, { value: Number(e.target.value) })}
                      className="h-8 w-20 text-center bg-white"
                    />
                    <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      <Switch
                        checked={r.isPercentage}
                        onCheckedChange={(v) => updateRule(r.id, { isPercentage: v })}
                        className="scale-75"
                      />
                      <span className="text-[10px] font-bold text-slate-500">%</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRule(r.id)}
                    className="text-rose-400 hover:text-rose-600 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
