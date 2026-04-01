import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'

export default function Profile() {
  const { state } = useCrmStore()
  const { toast } = useToast()

  const [name, setName] = useState(state.currentUser.name)
  const [phone, setPhone] = useState('(11) 99999-9999')
  const [position, setPosition] = useState(state.role)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleUpdateProfile = () => {
    toast({ title: 'Perfil atualizado com sucesso!' })
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast({ title: 'Preencha os campos de senha', variant: 'destructive' })
      return
    }
    toast({ title: 'Senha alterada com sucesso!' })
    setCurrentPassword('')
    setNewPassword('')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8 px-4 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meu Perfil</h1>
        <p className="text-slate-500 font-medium mt-1">
          Gerencie seus dados pessoais e de segurança.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo / Posição</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Cargo"
              />
            </div>
          </div>
          <Button onClick={handleUpdateProfile} className="bg-primary">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg">Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6 max-w-sm">
          <div className="space-y-2">
            <Label>Senha Atual</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div className="space-y-2">
            <Label>Nova Senha</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <Button variant="secondary" onClick={handleChangePassword}>
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg">Histórico de Ações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-slate-700 font-medium">
                Login bem sucedido (IP: 192.168.1.5)
              </span>
              <span className="text-slate-400">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-slate-700 font-medium">Perfil atualizado (Cargo)</span>
              <span className="text-slate-400">
                {new Date(Date.now() - 86400000).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
