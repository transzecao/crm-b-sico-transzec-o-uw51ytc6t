import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Rss } from 'lucide-react'

export default function MarketingConteudo() {
  const { toast } = useToast()
  const [form, setForm] = useState({ titulo: '', conteudo: '' })
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    try {
      await pb.collection('conteudo_nutricao').create({
        titulo: form.titulo,
        conteudo: form.conteudo,
        data_envio: new Date().toISOString(),
        clientes_destino: ['todos'],
      })
      toast({
        title: 'Conteúdo enviado!',
        description: 'Os clientes agora verão este post no Portal.',
      })
      setForm({ titulo: '', conteudo: '' })
    } catch (err) {
      toast({ title: 'Erro ao enviar', variant: 'destructive' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Rss className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Marketing - Envio de Conteúdo</h1>
          <p className="text-slate-500">
            Nutrição de Leads e Clientes. Crie posts que aparecerão no "Ver Conteúdo" do portal.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Card de Conteúdo (News Feed)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700">Título do Post</label>
              <Input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Dicas de Logística para 2026..."
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">Conteúdo do Post</label>
              <Textarea
                required
                rows={6}
                value={form.conteudo}
                onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                placeholder="Escreva o conteúdo da publicação..."
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700">Anexar Imagem (Opcional)</label>
              <Input type="file" className="cursor-pointer" />
            </div>
            <Button type="submit" disabled={isSending} className="w-full">
              {isSending ? 'Disparando...' : 'Publicar no Feed dos Clientes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
