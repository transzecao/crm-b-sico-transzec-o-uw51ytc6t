import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'

export default function Register() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { toast } = useToast()

  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [invitation, setInvitation] = useState<any>(null)

  useEffect(() => {
    if (!token) {
      toast({ title: 'Token inválido', variant: 'destructive' })
      navigate('/login')
      return
    }

    pb.collection('invitations')
      .getFirstListItem(`token="${token}" && status="sent"`)
      .then(setInvitation)
      .catch(() => {
        toast({ title: 'Convite não encontrado ou já utilizado', variant: 'destructive' })
        navigate('/login')
      })
  }, [token, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitation) return

    setLoading(true)
    try {
      await pb.collection('transzecao').create({
        email: invitation.email,
        password,
        passwordConfirm: password,
        name,
        role: invitation.role,
        setor: invitation.setor,
        setor_slug: invitation.role,
        status: 'active',
      })

      await pb.collection('invitations').update(invitation.id, { status: 'accepted' })

      toast({ title: 'Conta criada com sucesso!' })
      navigate('/login')
    } catch (err) {
      toast({ title: 'Erro ao criar conta', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Carregando convite...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">Finalizar Cadastro</CardTitle>
          <CardDescription>Crie sua senha para acessar o Transzecão CRM.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={invitation.email}
                disabled
                className="bg-slate-100 text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta e Acessar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
