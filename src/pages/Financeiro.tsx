import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'

export default function Financeiro() {
  const { state } = useCrmStore()

  if (!['Master', 'Financeiro'].includes(state.role)) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <h2 className="text-2xl font-bold text-destructive">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Apenas perfis Financeiro ou Master podem acessar este módulo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro & Precificação</h1>
        <p className="text-muted-foreground">
          Gestão total sem necessidade de aprovação comercial.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tabelas de Frete Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span className="font-medium">Carga Seca - SP a RJ</span>
                <span className="font-bold text-primary">R$ 1.200,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span className="font-medium">Refrigerada - Sul</span>
                <span className="font-bold text-primary">R$ 3.500,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comissões e Taxas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <span>Taxa de Gerenciamento de Risco (GRIS)</span>
                <span className="font-bold">0,30%</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <span>Comissão Padrão (Comercial)</span>
                <span className="font-bold">2,50%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
