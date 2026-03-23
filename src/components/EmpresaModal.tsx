import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCnpj } from '@/utils/formatters'
import useCrmStore, { Company } from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

export function EmpresaModal({
  open,
  onOpenChange,
  company,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  company?: Company
}) {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Company>>(
    company || { cnpj: '', razaoSocial: '', nomeFantasia: '', tipoCarga: '', endereco: '' },
  )
  const [error, setError] = useState('')

  const handleSave = () => {
    const rawCnpj = formData.cnpj?.replace(/\D/g, '') || ''
    if (rawCnpj.length !== 14) {
      setError('CNPJ inválido. Deve conter exatamente 14 números.')
      return
    }
    setError('')

    if (company) {
      updateState({
        companies: state.companies.map((c) =>
          c.id === company.id ? ({ ...c, ...formData } as Company) : c,
        ),
      })
      toast({ title: 'Empresa atualizada com sucesso' })
    } else {
      const newCompany = { ...formData, id: Math.random().toString(36).substr(2, 9) } as Company
      updateState({ companies: [...state.companies, newCompany] })
      toast({ title: 'Empresa criada com sucesso' })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{company ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">
              CNPJ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: formatCnpj(e.target.value) })}
              maxLength={18}
              placeholder="00.000.000/0000-00"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="razao">Razão Social</Label>
            <Input
              id="razao"
              value={formData.razaoSocial}
              onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fantasia">Nome Fantasia</Label>
            <Input
              id="fantasia"
              value={formData.nomeFantasia}
              onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carga">Tipo de Carga (Informativo)</Label>
            <Input
              id="carga"
              value={formData.tipoCarga}
              onChange={(e) => setFormData({ ...formData, tipoCarga: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
