import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin, Map, BadgeAlert } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'

export function FinanceGeoTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  return (
    <Card className="border-emerald-100 shadow-sm bg-white/90">
      <CardHeader className="bg-emerald-50/40 border-b border-emerald-100">
        <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
          <MapPin className="w-5 h-5 text-emerald-600" /> Inteligência Geográfica (SP Focus)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Setorização SP
            </Label>
            <Select value={calc.data.spRegion} onValueChange={(v) => calc.update({ spRegion: v })}>
              <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Centro">Centro Expandido</SelectItem>
                <SelectItem value="Zona Norte">Zona Norte</SelectItem>
                <SelectItem value="Zona Sul">Zona Sul</SelectItem>
                <SelectItem value="Zona Leste">Zona Leste</SelectItem>
                <SelectItem value="Zona Oeste">Zona Oeste</SelectItem>
                <SelectItem value="ABCD">ABCD Paulista</SelectItem>
                <SelectItem value="Guarulhos">Guarulhos</SelectItem>
                <SelectItem value="Osasco">Osasco</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Rodízio de Caminhões Ativo? (Adiciona +24h Transit Time)
            </Label>
            <div className="flex items-center gap-3">
              <Switch
                checked={calc.data.rodizio}
                onCheckedChange={(v) => calc.update({ rodizio: v })}
              />
              <span className="text-sm font-medium text-slate-700">
                {calc.data.rodizio ? 'Sim, restrição de placa aplica.' : 'Não aplicável.'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Rodovia Principal (Consulta ARTESP)
            </Label>
            <Select value={calc.data.route} onValueChange={(v) => calc.update({ route: v })}>
              <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anhanguera">Sistema Anhanguera</SelectItem>
                <SelectItem value="bandeirantes">Sistema Bandeirantes</SelectItem>
                <SelectItem value="imigrantes">Rodovia dos Imigrantes</SelectItem>
                <SelectItem value="dutra">Via Dutra (SP/RJ)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Eixos Cobrados
            </Label>
            <Input
              type="number"
              value={calc.data.axles}
              min="2"
              onChange={(e) => calc.update({ axles: Number(e.target.value) })}
              className="border-emerald-200 focus-visible:ring-emerald-500"
            />
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <Map className="w-5 h-5 text-emerald-600" />
              Zona Máxima de Restrição de Circulação (ZMRC / ZERC)
            </Label>
            <Switch
              checked={calc.data.zmrc}
              onCheckedChange={(v) => calc.update({ zmrc: v })}
              className="data-[state=checked]:bg-rose-500"
            />
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Ative se o destino ou coleta ocorrer dentro do perímetro restrito de SP.
          </p>
          {calc.data.zmrc && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded flex items-start gap-2 text-sm font-medium">
              <BadgeAlert className="w-5 h-5 shrink-0 text-rose-600" />
              Restrição Confirmada: Despacho exigirá veículo do tipo VUC (Veículo Urbano de Carga).
              Taxa Adicional de 20% sobre o Frete Peso Base aplicada.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
