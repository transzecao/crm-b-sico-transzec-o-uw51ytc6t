import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Avançado</h1>
        <p className="text-muted-foreground">Relatórios gerenciais e inteligência de dados.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="min-h-[300px] flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <CardTitle className="mb-2 text-foreground">Performance por Vendedor</CardTitle>
            <p className="text-sm">Gráfico em construção...</p>
          </div>
        </Card>

        <Card className="min-h-[300px] flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <CardTitle className="mb-2 text-foreground">Motivos de Perda (Histórico)</CardTitle>
            <p className="text-sm">Gráfico em construção...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
