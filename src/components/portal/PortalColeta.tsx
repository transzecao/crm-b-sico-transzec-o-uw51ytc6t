import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PortalColeta() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coletas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">O módulo de agendamento de coletas foi desativado.</p>
      </CardContent>
    </Card>
  )
}
