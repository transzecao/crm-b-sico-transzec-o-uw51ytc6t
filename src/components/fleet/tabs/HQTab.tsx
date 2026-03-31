import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFleetCalculator } from '@/stores/useFleetCalculator'

export function HQTab() {
  const { data, updateHQ } = useFleetCalculator()
  const { hq } = data

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
        Custos Fixos da Sede (Headquarters)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <div className="space-y-2">
          <Label>
            IPTU Anual (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={hq.iptu}
            onChange={(e) => updateHQ({ iptu: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Seguro Patrimonial Anual (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={hq.seguroPatrimonial}
            onChange={(e) => updateHQ({ seguroPatrimonial: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            AVCB Anual (R$)
            <Tooltip>
              <TooltipTrigger>
                <span className="text-slate-400 cursor-pointer hover:text-primary transition-colors">
                  (?)
                </span>
              </TooltipTrigger>
              <TooltipContent>Auto de Vistoria do Corpo de Bombeiros</TooltipContent>
            </Tooltip>
          </Label>
          <Input
            type="number"
            value={hq.avcb}
            onChange={(e) => updateHQ({ avcb: Number(e.target.value) })}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Aluguel Mensal (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={hq.aluguel}
            onChange={(e) => updateHQ({ aluguel: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Água Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.agua}
            onChange={(e) => updateHQ({ agua: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Luz Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.luz}
            onChange={(e) => updateHQ({ luz: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Internet Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.internet}
            onChange={(e) => updateHQ({ internet: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Telefone Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.telefone}
            onChange={(e) => updateHQ({ telefone: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Manutenção Docas Mensal (R$)</Label>
          <Input
            type="number"
            value={hq.docas}
            onChange={(e) => updateHQ({ docas: Number(e.target.value) })}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  )
}
