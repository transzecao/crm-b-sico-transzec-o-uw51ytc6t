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
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import { cn } from '@/lib/utils'
import useCrmStore from '@/stores/useCrmStore'

export function FinanceFiscalTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const { state } = useCrmStore()
  const canEdit = ['Financeiro', 'Master'].includes(state.role)

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
          <FileText className="w-5 h-5 text-secondary" /> Fiscal, Legal e ANTT
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
              Origem da Carga
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">Estado</Label>
                <Select
                  disabled={!canEdit}
                  value={calc.data.originState}
                  onValueChange={(v) => calc.update({ originState: v })}
                >
                  <SelectTrigger className="border-slate-200 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">Cidade</Label>
                <Input
                  disabled={!canEdit}
                  value={calc.data.originCity}
                  onChange={(e) => calc.update({ originCity: e.target.value })}
                  className="border-slate-200 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-1">
              Destino da Carga
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">Estado</Label>
                <Select
                  disabled={!canEdit}
                  value={calc.data.destState}
                  onValueChange={(v) => calc.update({ destState: v })}
                >
                  <SelectTrigger className="border-slate-200 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">Cidade</Label>
                <Input
                  disabled={!canEdit}
                  value={calc.data.destCity}
                  onChange={(e) => calc.update({ destCity: e.target.value })}
                  className="border-slate-200 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Código CIOT (12 Dígitos)
            </Label>
            <Input
              disabled={!canEdit}
              value={calc.data.ciot}
              onChange={(e) => calc.update({ ciot: e.target.value })}
              className={cn(
                'border-slate-200 focus-visible:ring-primary font-mono',
                !calc.isCiotValid && calc.data.ciot && 'border-rose-400 text-rose-600',
              )}
              placeholder="000000000000"
            />
            {calc.data.ciot && (
              <span className="absolute right-3 top-8">
                {calc.isCiotValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
              </span>
            )}
          </div>
          <div className="space-y-2 relative">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Registro RNTRC (8 Dígitos)
            </Label>
            <Input
              disabled={!canEdit}
              value={calc.data.rntrc}
              onChange={(e) => calc.update({ rntrc: e.target.value })}
              className={cn(
                'border-slate-200 focus-visible:ring-primary font-mono',
                !calc.isRntrcValid && calc.data.rntrc && 'border-rose-400 text-rose-600',
              )}
              placeholder="00000000"
            />
            {calc.data.rntrc && (
              <span className="absolute right-3 top-8">
                {calc.isRntrcValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-6 shadow-inner">
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold uppercase text-slate-500">Regra Tributária Aplicada</p>
            <p className="text-2xl font-black text-slate-800">
              {calc.isSameCity ? `ISS ${calc.issRate}%` : `ICMS ${calc.icmsRate}%`}
            </p>
            <p className="text-sm text-slate-600 font-medium">
              Imposto Estimado: {fmt(calc.taxValue)}
            </p>
          </div>
          <div className="flex-1 space-y-1 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
            <p className="text-xs font-bold uppercase text-slate-500">Piso Mínimo ANTT</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-800">{fmt(calc.anttFloor)}</span>
              {calc.isAnttCompliant ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Em Conformidade
                </span>
              ) : (
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Abaixo do Piso
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
