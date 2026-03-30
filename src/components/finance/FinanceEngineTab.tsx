import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Plus, Trash2, Settings, Save, Calculator, ListTree } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceEngineTab() {
  const {
    variables,
    addVariable,
    updateVariable,
    deleteVariable,
    rules,
    addRule,
    updateRule,
    deleteRule,
  } = useEngineStore()
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

  const handleAddRule = () => {
    addRule({
      id: `rule-${Date.now()}`,
      name: 'Nova Regra',
      isActive: true,
      minNfValue: 0,
      maxNfValue: null,
      type: 'percentage',
      value: 0,
      logic: '',
    })
  }

  const handleSave = () => {
    toast({
      title: 'Configurações Salvas',
      description:
        'As variáveis e regras de cálculo foram atualizadas com sucesso e já estão ativas.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Configuração do Motor de Cálculo
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure as variáveis base e as regras condicionais (gatilhos) do frete.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary gap-2 w-full md:w-auto">
          <Save className="w-4 h-4" /> Salvar Configurações
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
              <ListTree className="w-4 h-4" /> Tabela de Parâmetros (Gatilhos por NF)
            </CardTitle>
            <CardDescription className="text-xs mt-1 text-slate-500">
              Regras condicionadas ao Valor da Nota Fiscal (NF).
            </CardDescription>
          </div>
          <Button size="sm" variant="default" onClick={handleAddRule} className="gap-2">
            <Plus className="w-4 h-4" /> [NEW] Adicionar Nova
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-20">Status</th>
                <th className="px-4 py-3">Regra (Nome)</th>
                <th className="px-4 py-3">Gatilho (De - Até) R$</th>
                <th className="px-4 py-3 w-40">Tipo</th>
                <th className="px-4 py-3 w-32">Valor/Fator</th>
                <th className="px-4 py-3 min-w-[200px]">Lógica Descritiva</th>
                <th className="px-4 py-3 w-16 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                    Nenhuma regra configurada.
                  </td>
                </tr>
              )}
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => updateRule(rule.id, { isActive: checked })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={rule.name}
                      onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                      className="h-9 font-medium min-w-[150px] bg-white"
                      placeholder="Nome da Regra"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={rule.minNfValue}
                        onChange={(e) =>
                          updateRule(rule.id, { minNfValue: Number(e.target.value) })
                        }
                        className="h-9 w-24 text-right bg-white"
                        placeholder="Mín."
                      />
                      <span className="text-slate-400">-</span>
                      <Input
                        type="number"
                        value={rule.maxNfValue ?? ''}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            maxNfValue: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="h-9 w-24 text-right bg-white"
                        placeholder="Máx (vazio=inf)"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={rule.type}
                      onValueChange={(val: 'fixed' | 'percentage') =>
                        updateRule(rule.id, { type: val })
                      }
                    >
                      <SelectTrigger className="h-9 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixo (R$)</SelectItem>
                        <SelectItem value="percentage">Percentual (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                        {rule.type === 'fixed' ? 'R$' : '%'}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, { value: Number(e.target.value) })}
                        className="h-9 w-full pl-8 pr-3 text-right bg-white"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={rule.logic}
                      onChange={(e) => updateRule(rule.id, { logic: e.target.value })}
                      className="h-9 min-w-[200px] bg-white"
                      placeholder="Ex: Aplicar taxa de seguro mínima..."
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRule(rule.id)}
                      className="text-rose-400 hover:text-rose-600 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Variáveis Base (Cálculo Fixo e Percentual s/ Base)
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddVariable}>
            <Plus className="w-4 h-4 mr-1" /> Nova Variável
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {variables.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                Nenhuma variável configurada. O cálculo considerará apenas o Custo Base e Regras de
                NF.
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
                    className="text-rose-400 hover:text-rose-600 ml-2 shrink-0 h-8 w-8"
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
