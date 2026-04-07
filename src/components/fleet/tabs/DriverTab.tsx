import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, ChevronDown, Info } from 'lucide-react'
import { useFleetCalculator } from '@/stores/useFleetCalculator'
import { formatCpf } from '@/utils/formatters'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { driverSchema, DriverFormData } from '@/schemas/driverSchema'
import { useDebouncedUpdate } from '@/hooks/useDebouncedUpdate'

const InfoIcon = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger type="button">
      <Info className="w-4 h-4 text-slate-400 inline ml-1 hover:text-primary transition-colors" />
    </TooltipTrigger>
    <TooltipContent side="top">
      <p className="max-w-[200px] text-xs text-center">{text}</p>
    </TooltipContent>
  </Tooltip>
)

function DriverCard({ d, index, open, toggle, onRemove, onUpdate, settings }: any) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: d.name,
      cpf: d.cpf,
      cnh: d.cnh || 'D',
      baseSalary: d.baseSalary,
      periculosidade: d.periculosidade,
      vrDaily: d.vrDaily,
      vtMensal: d.vtMensal,
      cestaBasica: d.cestaBasica,
      seguroVida: d.seguroVida,
      toxAnual: d.toxAnual,
      rat: d.rat,
    },
    mode: 'onChange',
  })

  const formValues = useWatch({ control })
  const debouncedValues = useDebouncedUpdate(formValues, 400)

  useEffect(() => {
    const result = driverSchema.safeParse(debouncedValues)
    if (result.success) {
      onUpdate(d.id, result.data)
    }
  }, [debouncedValues, d.id, onUpdate])

  return (
    <Collapsible
      open={open}
      onOpenChange={toggle}
      className="border bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={toggle}
      >
        <span className="font-bold text-slate-800">
          {d.name || `Motorista ${index + 1}`}{' '}
          <span className="text-slate-400 text-sm font-normal">({d.id})</span>
          {Object.keys(errors).length > 0 && (
            <span className="ml-2 text-xs text-red-500 font-bold">Inválido</span>
          )}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900"
          asChild
        >
          <div>
            <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
          </div>
        </Button>
      </div>
      <CollapsibleContent className="px-4 pb-4 border-t pt-4 space-y-4 bg-slate-50/50">
        <form className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>
              CPF <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register('cpf')}
              onChange={(e) => {
                const val = formatCpf(e.target.value)
                setValue('cpf', val, { shouldValidate: true })
              }}
              maxLength={14}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <p className="text-xs text-red-500">{errors.cpf.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Categoria CNH</Label>
            <Select
              value={formValues.cnh}
              onValueChange={(v) => setValue('cnh', v, { shouldValidate: true })}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center">
              Salário Base (R$) <span className="text-red-500 ml-1">*</span>
              <InfoIcon text="Salário base mensal do motorista." />
            </Label>
            <Input type="number" {...register('baseSalary', { valueAsNumber: true })} />
            {errors.baseSalary && (
              <p className="text-xs text-red-500">{errors.baseSalary.message}</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col justify-end pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`peric-${d.id}`}
                checked={formValues.periculosidade}
                onCheckedChange={(c) => setValue('periculosidade', !!c, { shouldValidate: true })}
              />
              <Label htmlFor={`peric-${d.id}`} className="cursor-pointer">
                Periculosidade (30%)
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>VR Diário (R$)</Label>
            <Input type="number" {...register('vrDaily', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>VT Mensal (R$)</Label>
            <Input type="number" {...register('vtMensal', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Cesta Básica (R$)</Label>
            <Input type="number" {...register('cestaBasica', { valueAsNumber: true })} />
          </div>
        </form>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
          <div className="text-sm text-slate-500 font-medium">
            Cálculos reagem após dados válidos.
          </div>
          <Button variant="destructive" size="sm" onClick={() => onRemove(d.id)}>
            <Trash2 className="w-4 h-4 mr-2" /> Remover
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function DriverTab() {
  const { data, addDriver, updateDriver, removeDriver } = useFleetCalculator()
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">Módulo de Motoristas</h3>
        <Button onClick={addDriver}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Motorista
        </Button>
      </div>
      <div className="space-y-4">
        {data.drivers.map((d, i) => (
          <DriverCard
            key={d.id}
            d={d}
            index={i}
            open={openStates[d.id]}
            toggle={() => toggle(d.id)}
            onRemove={removeDriver}
            onUpdate={updateDriver}
            settings={data.settings}
          />
        ))}
      </div>
    </div>
  )
}
