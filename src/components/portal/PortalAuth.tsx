import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import usePortalStore from '@/stores/usePortalStore'
import { Package, Eye, EyeOff } from 'lucide-react'

export function PortalAuth() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login, register } = usePortalStore()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) {
      toast({ title: 'Login realizado com sucesso!' })
    } else {
      toast({ title: 'Credenciais inválidas ou cadastro pendente.', variant: 'destructive' })
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    const digitsOnlyCnpj = cnpj.replace(/\D/g, '')
    if (digitsOnlyCnpj.length !== 14) {
      toast({ title: 'CNPJ deve conter exatamente 14 dígitos.', variant: 'destructive' })
      return
    }
    if (!passRegex.test(password)) {
      toast({
        title: 'A senha deve ter 8 caracteres, letras, números e caracteres especiais.',
        variant: 'destructive',
      })
      return
    }
    if (password !== confirmPassword) {
      toast({ title: 'As senhas não conferem.', variant: 'destructive' })
      return
    }
    register({ cnpj: digitsOnlyCnpj, name, email, phone, password })
    toast({
      title: 'Estamos checando seus dados enviaremos um email de confirmaçao.',
      duration: 5000,
    })
    setTimeout(() => {
      toast({
        title: 'Aviso de novo cliente cadastrado.',
        description: 'Alerta gerado para o Supervisor Comercial.',
      })
    }, 1500)
    setView('login')
  }

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Instruções enviadas para o seu e-mail.' })
    setView('login')
  }

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="flex justify-center mb-8">
        <div className="bg-[#800020] p-4 rounded-2xl flex items-center gap-2 shadow-lg">
          <Package className="text-white w-8 h-8" />
          <h1 className="text-2xl font-black text-white">Transzecão Portal</h1>
        </div>
      </div>

      <Card className="border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {view === 'login' && 'Acesso ao Cliente'}
            {view === 'register' && 'Criar Conta'}
            {view === 'forgot' && 'Recuperar Senha'}
          </CardTitle>
          <CardDescription className="text-center">
            {view === 'login' && 'Gerencie suas coletas, cotações e documentos.'}
            {view === 'register' && 'Preencha os dados para solicitar acesso.'}
            {view === 'forgot' && 'Informe seu e-mail para receber um link de recuperação.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>E-mail Corporativo</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#800020] hover:bg-[#5c0017]">
                Entrar
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-[#0056B3] hover:underline"
                >
                  Esqueci minha senha
                </button>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="text-[#0056B3] hover:underline"
                >
                  Criar conta
                </button>
              </div>
            </form>
          )}

          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CNPJ (Apenas números)</Label>
                  <Input
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ''))}
                    maxLength={14}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-mail Corporativo</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#800020] hover:bg-[#5c0017]">
                Solicitar Acesso
              </Button>
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[#0056B3] hover:underline"
                >
                  Já tenho uma conta
                </button>
              </div>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-2">
                <Label>E-mail Corporativo</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#800020] hover:bg-[#5c0017]">
                Enviar Instruções
              </Button>
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[#0056B3] hover:underline"
                >
                  Voltar ao Login
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
