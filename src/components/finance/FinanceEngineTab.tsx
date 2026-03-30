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
import { useEngineStore } from '@/stores/useEngineStore'
import { Plus, Trash2, Settings, Save, Calculator } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceEngineTab() {
  const { variables, addVariable, updateVariable, deleteVariable } = useEngineStore()
  const { toast } = useToast()

  const handleAddVariable = () => {
    addVariable({
      id: `var-${Date.now()}`,
      name: 'Nova Variável',
      type: 'fixed',
      value: 0,
      isActive: true,
    })
  }

  const handleSave = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'As variáveis de cálculo foram atualizadas com sucesso e já estão ativas.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Variáveis de Cálculo (Engine)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure as variáveis fixas e percentuais aplicadas sobre o custo base do frete.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary gap-2">
          <Save className="w-4 h-4" /> Salvar Configurações
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Variáveis Ativas e Inativas
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={handleAddVariable}>
            <Plus className="w-4 h-4 mr-1" /> Nova Variável
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {variables.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                Nenhuma variável configurada. O cálculo considerará apenas o Custo Base.
              </div>
            )}
            {variables.map((v) => (
              <div
                key={v.id}
                className="p-4 flex flex-wrap gap-4 items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 w-full md:w-auto md:flex-1">
                  <Switch
                    checked={v.isActive}
                    onCheckedChange={(checked) => updateVariable(v.id, { isActive: checked })}
                  />
                  <Input
                    value={v.name}
                    onChange={(e) => updateVariable(v.id, { name: e.target.value })}
                    className="h-9 font-medium bg-white flex-1 min-w-[200px]"
                    placeholder="Nome da Variável"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={v.type}
                    onValueChange={(val: 'fixed' | 'percentage') =>
                      updateVariable(v.id, { type: val })
                    }
                  >
                    <SelectTrigger className="h-9 w-[150px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                      <SelectItem value="percentage">Percentual (%)</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {v.type === 'fixed' ? 'R$' : '%'}
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      value={v.value}
                      onChange={(e) => updateVariable(v.id, { value: Number(e.target.value) })}
                      className="h-9 w-28 pl-8 pr-3 text-right bg-white"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVariable(v.id)}
                    className="text-rose-400 hover:text-rose-600 ml-2 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
