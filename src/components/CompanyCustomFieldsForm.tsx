import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings } from 'lucide-react'

export function CompanyCustomFieldsForm({
  formData,
  setFormData,
}: {
  formData: any
  setFormData: any
}) {
  return (
    <Card className="shadow-sm border-blue-100/60 bg-white/80 backdrop-blur-sm mt-6">
      <CardHeader className="bg-blue-50/50 border-b border-blue-100 py-3.5 px-6">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
          <Settings className="w-4 h-4 text-blue-600" /> Dados Adicionais e Qualificação
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Concorrente Atual
            </Label>
            <Input
              placeholder="Quem atende a operação hoje?"
              className="bg-white focus-visible:ring-blue-500/50"
              value={formData.customData?.['Concorrente Atual'] || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customData: { ...formData.customData, 'Concorrente Atual': e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Volume Estimado Mensal (NFs)
            </Label>
            <Input
              type="number"
              placeholder="Ex: 500"
              className="bg-white focus-visible:ring-blue-500/50"
              value={formData.customData?.['Volume Mensal'] || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customData: { ...formData.customData, 'Volume Mensal': e.target.value },
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
