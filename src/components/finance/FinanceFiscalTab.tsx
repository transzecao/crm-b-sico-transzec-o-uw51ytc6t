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

export function FinanceFiscalTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v)

  return (
    <Card className="border-emerald-100 shadow-sm bg-white/90">
      <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
          <FileText className="w-5 h-5 text-emerald-600" /> Fiscal, Legal e ANTT
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-100 pb-1">
              Origem da Carga
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase">Estado</Label>
                <Select
                  value={calc.data.originState}
                  onValueChange={(v) => calc.update({ originState: v })}
                >
                  <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
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
                <Label className="text-[11px] font-semibold text-slate-500 uppercase">Cidade</Label>
                <Input
                  value={calc.data.originCity}
                  onChange={(e) => calc.update({ originCity: e.target.value })}
                  className="border-emerald-200 focus-visible:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-100 pb-1">
              Destino da Carga
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-slate-500 uppercase">Estado</Label>
                <Select
                  value={calc.data.destState}
                  onValueChange={(v) => calc.update({ destState: v })}
                >
                  <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
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
                <Label className="text-[11px] font-semibold text-slate-500 uppercase">Cidade</Label>
                <Input
                  value={calc.data.destCity}
                  onChange={(e) => calc.update({ destCity: e.target.value })}
                  className="border-emerald-200 focus-visible:ring-emerald-500"
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
              value={calc.data.ciot}
              onChange={(e) => calc.update({ ciot: e.target.value })}
              className={cn(
                'border-emerald-200 focus-visible:ring-emerald-500 font-mono',
                !calc.isCiotValid &&
                  calc.data.ciot &&
                  'border-rose-400 focus-visible:ring-rose-500 text-rose-600',
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
              value={calc.data.rntrc}
              onChange={(e) => calc.update({ rntrc: e.target.value })}
              className={cn(
                'border-emerald-200 focus-visible:ring-emerald-500 font-mono',
                !calc.isRntrcValid &&
                  calc.data.rntrc &&
                  'border-rose-400 focus-visible:ring-rose-500 text-rose-600',
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

        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-1">
            <p className="text-xs font-bold uppercase text-emerald-800">
              Regra Tributária Aplicada
            </p>
            <p className="text-2xl font-black text-emerald-700">
              {calc.isSameCity ? `ISS ${calc.issRate}%` : `ICMS ${calc.icmsRate}%`}
            </p>
            <p className="text-sm text-emerald-600 font-medium">
              Valor Estimado: {fmt(calc.taxValue)}
            </p>
          </div>
          <div className="flex-1 space-y-1 border-t md:border-t-0 md:border-l border-emerald-200 md:pl-6 pt-4 md:pt-0">
            <p className="text-xs font-bold uppercase text-emerald-800">
              Piso Mínimo ANTT (Lei 13.703)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-700">{fmt(calc.anttFloor)}</span>
              {calc.isAnttCompliant ? (
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Em Conformidade
                </span>
              ) : (
                <span className="bg-rose-200 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
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
