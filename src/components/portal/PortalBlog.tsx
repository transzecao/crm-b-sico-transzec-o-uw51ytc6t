import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function PortalBlog() {
  const posts = [
    {
      id: 1,
      title: 'Inovações em Roteirização Logística em 2026',
      excerpt:
        'Descubra como a inteligência artificial está transformando a forma como planejamos rotas e economizamos combustível.',
      image: 'https://img.usecurling.com/p/400/200?q=trucks&color=gray',
      date: '10 de Março, 2026',
    },
    {
      id: 2,
      title: 'A Importância do CT-e Integrado',
      excerpt:
        'Veja como a emissão rápida de Conhecimento de Transporte Eletrônico agiliza a liberação das suas cargas.',
      image: 'https://img.usecurling.com/p/400/200?q=documents&color=gray',
      date: '05 de Março, 2026',
    },
    {
      id: 3,
      title: 'Transzecão Expandindo Frota',
      excerpt:
        'Adquirimos 50 novos caminhões elétricos para focar em uma logística mais verde e sustentável em todo o Brasil.',
      image: 'https://img.usecurling.com/p/400/200?q=electric-truck&color=gray',
      date: '28 de Fevereiro, 2026',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-[#800020] p-8 rounded-2xl text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2">Blog Transzecão</h2>
          <p className="text-white/80 max-w-xl">
            Acompanhe as últimas novidades, dicas de logística e atualizações do mercado de
            transporte rodoviário de cargas.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col"
          >
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <CardHeader className="flex-1">
              <p className="text-xs text-slate-500 mb-2 font-medium">{post.date}</p>
              <CardTitle className="text-lg leading-tight text-[#800020]">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{post.excerpt}</p>
              <Button
                variant="outline"
                className="w-full text-[#800020] border-[#800020] hover:bg-[#800020]/10"
              >
                Ler Artigo Completo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
