import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let error: any = null

    try {
      await pb.collection('transzecao').authWithPassword(email, password)
    } catch (err: any) {
      error = err
      console.error('Login Error:', err.message, err.data)
    }

    setLoading(false)

    if (error) {
      const errMsg = error?.response?.message || error?.message || ''
      const status = error?.status || error?.response?.code
      if (
        status === 400 ||
        errMsg.toLowerCase().includes('authenticate') ||
        errMsg.toLowerCase().includes('invalid')
      ) {
        toast({
          title: 'Falha na Autenticação',
          description: 'Não foi possível autenticar. Verifique suas credenciais e tente novamente.',
          variant: 'destructive',
        })
      } else if (errMsg.toLowerCase().includes('failed to update record')) {
        toast({
          title: 'Erro de Permissão',
          description:
            'Falha ao atualizar registro de login (Failed to update record). Contate o administrador.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: 'Ocorreu um erro inesperado. Verifique suas credenciais.',
          variant: 'destructive',
        })
      }
    } else {
      const currentRole = pb.authStore.record?.role
      if (currentRole === 'master') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 relative">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">Transzecão CRM</CardTitle>
          <CardDescription>Faça login para acessar a plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
