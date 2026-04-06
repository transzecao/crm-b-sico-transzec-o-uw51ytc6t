import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'
import { Rss, Calendar } from 'lucide-react'

export default function PortalConteudoInt() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    pb.collection('conteudo_nutricao')
      .getFullList({ sort: '-created' })
      .then(setPosts)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div className="bg-[#800020] p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
          <Rss className="w-8 h-8" /> News Feed
        </h2>
        <p className="text-white/80">
          Fique por dentro das últimas novidades do mercado de transportes.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden border-none shadow-md bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-[#800020]">{post.titulo}</CardTitle>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.created).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.conteudo}</p>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="text-center p-12 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
            Nenhuma novidade publicada ainda.
          </div>
        )}
      </div>
    </div>
  )
}
