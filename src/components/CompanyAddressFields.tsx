import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Company } from '@/stores/useCrmStore'
import { MapPin } from 'lucide-react'

export function CompanyAddressFields({
  formData,
  setFormData,
  isReadOnly,
}: {
  formData: Partial<Company>
  setFormData: (v: any) => void
  isReadOnly: boolean
}) {
  const { toast } = useToast()

  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setFormData((prev: any) => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
          }))
          toast({
            title: 'Endereço Automático',
            description: 'Campos preenchidos via validação de CEP.',
          })
        }
      } catch (err) {
        toast({ title: 'Erro ao buscar CEP', variant: 'destructive' })
      }
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, '')
    if (cep.length > 5) cep = cep.slice(0, 5) + '-' + cep.slice(5, 8)
    setFormData((prev: any) => ({ ...prev, cep }))
    if (cep.replace(/\D/g, '').length === 9) fetchCep(cep)
  }

  return (
    <>
      <div className="md:col-span-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-1.5 mb-4">
          <MapPin className="w-4 h-4" /> Endereço e Localização
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">CEP</Label>
            <Input
              value={formData.cep || ''}
              onChange={handleCepChange}
              disabled={isReadOnly}
              className="bg-white border-slate-200 focus-visible:ring-primary font-mono"
              placeholder="00000-000"
              maxLength={9}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Logradouro / Rua</Label>
            <Input
              value={formData.logradouro || ''}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, logradouro: e.target.value }))
              }
              disabled={isReadOnly}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Número</Label>
            <Input
              value={formData.numero || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, numero: e.target.value }))}
              disabled={isReadOnly}
              className="bg-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Bairro</Label>
            <Input
              value={formData.bairro || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, bairro: e.target.value }))}
              disabled={isReadOnly}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Cidade</Label>
            <Input
              value={formData.cidade || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, cidade: e.target.value }))}
              disabled={isReadOnly}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Estado</Label>
            <Input
              value={formData.estado || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, estado: e.target.value }))}
              disabled={isReadOnly}
              className="bg-white"
              maxLength={2}
              placeholder="UF"
            />
          </div>
          <div className="space-y-2 md:col-span-4">
            <Label className="text-xs font-bold text-slate-500 uppercase">Complemento</Label>
            <Input
              value={formData.complemento || ''}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, complemento: e.target.value }))
              }
              disabled={isReadOnly}
              className="bg-white"
            />
          </div>
        </div>
      </div>
    </>
  )
}
