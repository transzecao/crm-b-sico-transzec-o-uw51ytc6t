import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, AlertTriangle } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import useCrmStore from '@/stores/useCrmStore'
import { useEngineStore } from '@/stores/useEngineStore'

export function FinancePricingTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const { state } = useCrmStore()
  const { published } = useEngineStore()
  const canEditParams = ['Acesso Master', 'Supervisor Financeiro'].includes(state.role)
  const canEditCargo = [
    'Acesso Master',
    'Supervisor Financeiro',
    'Funcionário Comercial',
    'Funcionário Coleta',
  ].includes(state.role)

  if (!calc.isPublished) {
    return (
      <Card className="border-rose-200 bg-rose-50 shadow-sm animate-fade-in-up">
        <CardContent className="pt-6 flex flex-col items-center justify-center p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-xl font-bold text-rose-700">Motor de Cálculo Não Publicado</h3>
          <p className="text-rose-600 mt-2 max-w-md">
            Você não pode realizar cotações operacionais porque não há uma versão publicada do motor
            de cálculo. Solicite a um supervisor para configurar e publicar as regras no painel da
            Engine.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 shadow-sm bg-white animate-fade-in-up">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
          <Calculator className="w-5 h-5 text-secondary" /> Composição de Frete
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 border-r border-slate-100 pr-4">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
            Dados da Carga (Cálculo do Peso Tarifável)
          </h4>
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold text-slate-500">Peso Físico (KG)</Label>
              <Input
                type="number"
                value={calc.data.weight}
                disabled={!canEditCargo}
                onChange={(e) => calc.update({ weight: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Volume (M³)</Label>
              <Input
                type="number"
                step="0.1"
                value={calc.data.volume}
                disabled={!canEditCargo}
                onChange={(e) => calc.update({ volume: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Fator de Cubagem</Label>
              <Input
                type="number"
                value={calc.data.cubageFactor}
                disabled={!canEditCargo}
                onChange={(e) => calc.update({ cubageFactor: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500">Valor da NF (R$)</Label>
              <Input
                type="number"
                value={calc.data.nfValue}
                disabled={!canEditCargo}
                onChange={(e) => calc.update({ nfValue: Number(e.target.value) })}
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={calc.data.useCubing}
                disabled={!canEditCargo}
                onCheckedChange={(v) => calc.update({ useCubing: v })}
                className="data-[state=checked]:bg-primary"
              />
              <Label className="font-medium text-slate-700">Ativar Cubagem na fórmula</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
            Itens do Frete (Taxas e Módulos Ativos)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {published?.fields.map((f) => {
              const isModuleActive = published?.modules.find((m) => m.id === f.moduleId)?.isActive
              if (!isModuleActive) return null

              return (
                <div key={f.id}>
                  <Label className="text-xs font-semibold text-slate-500">{f.name}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={calc.data[f.id] ?? 0}
                    disabled={!canEditParams}
                    onChange={(e) => calc.update({ [f.id]: Number(e.target.value) })}
                    className="focus-visible:ring-primary"
                  />
                </div>
              )
            })}
          </div>
          <div className="space-y-3 pt-4 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={calc.data.useTolls}
                disabled={!canEditParams}
                onCheckedChange={(v) => calc.update({ useTolls: v })}
                className="data-[state=checked]:bg-primary"
              />
              <Label className="font-medium text-slate-700">Incluir Pedágios na Rota</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={calc.data.useTas}
                disabled={!canEditParams}
                onCheckedChange={(v) => calc.update({ useTas: v })}
                className="data-[state=checked]:bg-primary"
              />
              <Label className="font-medium text-slate-700">Aplicar TAS (Taxa Adm.)</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
