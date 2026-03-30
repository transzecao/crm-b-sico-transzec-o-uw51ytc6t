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
import { Plus, Trash2, Settings, Save, ListTree, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceEngineTab() {
  const { stackableRules, addRule, updateRule, deleteRule, duplicateRule } = useEngineStore()
  const { toast } = useToast()

  const handleAddRule = () => {
    addRule({
      id: `rule-${Date.now()}`,
      name: 'Nova Regra de Frete',
      isActive: true,
      trigger: 'nfValue',
      minRange: 0,
      maxRange: null,
      type: 'percentage',
      value: 0,
      logic: '',
    })
  }

  const handleSave = () => {
    toast({
      title: 'Motor de Cálculo Atualizado',
      description: 'As regras foram salvas e aplicadas em tempo real no simulador.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Motor de Cálculo por Pilhas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Crie, edite e gerencie o DNA das regras e taxas aplicadas ao frete (Stackable Engine).
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary gap-2 w-full md:w-auto">
          <Save className="w-4 h-4" /> Salvar Regras
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
              <ListTree className="w-4 h-4" /> Tabela de Regras e Parâmetros Acumulativos
            </CardTitle>
            <CardDescription className="text-xs mt-1 text-slate-500">
              Cada regra ativa será testada e empilhada no custo final se o cenário (Gatilho)
              corresponder à faixa determinada.
            </CardDescription>
          </div>
          <Button size="sm" variant="default" onClick={handleAddRule} className="gap-2">
            <Plus className="w-4 h-4" /> [NEW] Criar Regra
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-16">Status</th>
                <th className="px-4 py-3">Rótulo (Variável)</th>
                <th className="px-4 py-3 min-w-[150px]">Base (Gatilho)</th>
                <th className="px-4 py-3">Faixa (De - Até)</th>
                <th className="px-4 py-3 w-40">Operação</th>
                <th className="px-4 py-3 w-32">Fator / Valor</th>
                <th className="px-4 py-3 min-w-[200px]">Memorial Descritivo</th>
                <th className="px-4 py-3 w-20 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stackableRules.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                    O motor está limpo. Adicione uma regra para começar a empilhar custos.
                  </td>
                </tr>
              )}
              {stackableRules.map((rule) => (
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
                      className="h-9 font-medium min-w-[160px] bg-white border-slate-300"
                      placeholder="Ex: GRIS, Ad Valorem..."
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={rule.trigger}
                      onValueChange={(val: 'fixed' | 'nfValue' | 'weight') =>
                        updateRule(rule.id, { trigger: val })
                      }
                    >
                      <SelectTrigger className="h-9 bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nfValue">Valor NF (R$)</SelectItem>
                        <SelectItem value="weight">Peso Bruto (Kg)</SelectItem>
                        <SelectItem value="fixed">Sempre Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    {rule.trigger !== 'fixed' ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={rule.minRange}
                          onChange={(e) =>
                            updateRule(rule.id, { minRange: Number(e.target.value) })
                          }
                          className="h-9 w-20 text-right bg-white border-slate-300"
                          placeholder="Mín"
                        />
                        <span className="text-slate-400 font-bold">-</span>
                        <Input
                          type="number"
                          value={rule.maxRange ?? ''}
                          onChange={(e) =>
                            updateRule(rule.id, {
                              maxRange: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          className="h-9 w-20 text-right bg-white border-slate-300"
                          placeholder="Máx/Livre"
                        />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic block text-center">
                        Incondicional
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={rule.type}
                      onValueChange={(val: 'fixed' | 'percentage') =>
                        updateRule(rule.id, { type: val })
                      }
                    >
                      <SelectTrigger className="h-9 bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Soma Fixo (R$)</SelectItem>
                        <SelectItem value="percentage">Multiplica (%)</SelectItem>
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
                        className="h-9 w-full pl-8 pr-3 text-right bg-white border-slate-300 font-bold text-slate-700"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={rule.logic}
                      onChange={(e) => updateRule(rule.id, { logic: e.target.value })}
                      className="h-9 min-w-[220px] bg-white border-slate-300"
                      placeholder="Ex: Justificativa para faturamento..."
                      title={rule.logic}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateRule(rule.id)}
                        className="text-slate-500 hover:text-primary hover:bg-primary/10 h-8 w-8 transition-colors"
                        title="Duplicar regra"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                        className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 transition-colors"
                        title="Deletar regra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
