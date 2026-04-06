import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PortalConteudo() {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Conteúdo Educativo e Novidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Nenhum conteúdo disponível no momento.</p>
          <p className="text-sm text-slate-400 mt-2">Fique de olho, em breve teremos novidades.</p>
        </div>
      </CardContent>
    </Card>
  )
}
