import { useState, useEffect } from 'react'
import { Save, Plus, Edit2, Mail } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import useCrmStore, { UserLogin } from '@/stores/useCrmStore'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  login: UserLogin | null
  canEditMySector: boolean
  mySector: string
}

export function LoginAdminModal({ open, setOpen, login, canEditMySector, mySector }: Props) {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<UserLogin>>({ status: 'Ativo' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (login) setFormData({ ...login })
      else setFormData({ status: 'Ativo', name: '', sector: '', accessLink: '' })
      setFormErrors({})
    }
  }, [open, login])

  const generateLink = (name: string, sector: string) => {
    if (!name || !sector) return ''
    const cleanName = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return `https://transzecao.com.br/login/${cleanName}-${sector.toLowerCase()}`
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const newData = { ...prev, name }
      if (!login && newData.sector) newData.accessLink = generateLink(name, newData.sector)
      return newData
    })
  }

  const handleSectorChange = (sector: string) => {
    setFormData((prev) => {
      const newData = { ...prev, sector }
      if (!login && newData.name) newData.accessLink = generateLink(newData.name, sector)
      return newData
    })
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name?.trim()) errors.name = 'Nome do Usuário é obrigatório.'
    if (!formData.sector) errors.sector = 'Selecione um setor.'

    const linkPattern = /^https:\/\/[a-zA-Z0-9.-]+\.com(\.br)?\/[a-zA-Z0-9./-]+$/
    if (!formData.accessLink || !linkPattern.test(formData.accessLink)) {
      errors.accessLink = 'O link deve ser uma URL HTTPS válida.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: 'Erros no formulário',
        description: 'Corrija os campos indicados antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    const now = new Date().toLocaleString('pt-BR')
    const logAction = login
      ? `Editou o login de ${formData.name}`
      : `Criou novo login para ${formData.name}`

    let updatedLogins = [...state.userLogins]

    if (login) {
      updatedLogins = updatedLogins.map((l) =>
        l.id === login.id ? ({ ...l, ...formData, updatedAt: now } as UserLogin) : l,
      )
      toast({
        title: 'Acesso Atualizado',
        description: `Login de ${formData.name} salvo com sucesso.`,
      })
    } else {
      const newLogin: UserLogin = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        sector: formData.sector!,
        accessLink: formData.accessLink!,
        status: (formData.status as 'Ativo' | 'Inativo') || 'Ativo',
        createdAt: now,
        updatedAt: now,
      }
      updatedLogins.push(newLogin)

      toast({
        title: 'Automação de E-mail Disparada',
        description: `E-mail com link de acesso único enviado para ${newLogin.name}.`,
      })
    }

    const newAuditLog = { date: now, user: state.currentUser.name, action: logAction }

    updateState({
      userLogins: updatedLogins,
      loginAuditLogs: [newAuditLog, ...state.loginAuditLogs].slice(0, 50),
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-slate-200 shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            {login ? (
              <Edit2 className="w-5 h-5 text-indigo-500" />
            ) : (
              <Plus className="w-5 h-5 text-indigo-500" />
            )}
            {login ? 'Editar Login' : 'Novo Login e Envio de Acesso'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">
              Nome do Usuário <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              className={cn(
                'focus-visible:ring-indigo-500/50',
                formErrors.name && 'border-rose-400',
              )}
              placeholder="Ex: Carlos Silva"
            />
            {formErrors.name && (
              <p className="text-[10px] text-rose-500 font-bold">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">
              Setor Operacional <span className="text-rose-500">*</span>
            </Label>
            <Select value={formData.sector || ''} onValueChange={handleSectorChange}>
              <SelectTrigger
                className={cn(
                  'w-full focus:ring-indigo-500/50',
                  formErrors.sector && 'border-rose-400',
                )}
              >
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {(!canEditMySector || mySector === 'Coleta') && (
                  <SelectItem value="Coleta">Coleta</SelectItem>
                )}
                {(!canEditMySector || mySector === 'Comercial') && (
                  <SelectItem value="Comercial">Comercial</SelectItem>
                )}
                {(!canEditMySector || mySector === 'Financeiro') && (
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                )}
              </SelectContent>
            </Select>
            {formErrors.sector && (
              <p className="text-[10px] text-rose-500 font-bold">{formErrors.sector}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold">Link de Acesso Único</Label>
            <Input
              value={formData.accessLink || ''}
              onChange={(e) => setFormData({ ...formData, accessLink: e.target.value })}
              className={cn(
                'bg-slate-50 font-mono text-xs focus-visible:ring-indigo-500/50',
                formErrors.accessLink && 'border-rose-400',
              )}
              placeholder="https://..."
            />
            {formErrors.accessLink && (
              <p className="text-[10px] text-rose-500 font-bold">{formErrors.accessLink}</p>
            )}
            {!login && (
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3" /> Um e-mail será disparado automaticamente.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg mt-2">
            <div className="space-y-0.5">
              <Label className="text-slate-800 font-bold">Status da Conta</Label>
              <p className="text-xs text-slate-500">
                Contas inativas não podem acessar a plataforma.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase">{formData.status}</span>
              <Switch
                checked={formData.status === 'Ativo'}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, status: v ? 'Ativo' : 'Inativo' })
                }
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="w-4 h-4 mr-2" /> Salvar e Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
