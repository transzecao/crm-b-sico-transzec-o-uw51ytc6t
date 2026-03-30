import usePortalStore from '@/stores/usePortalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function PortalCotacaoHist() {
  const { currentUser, quotes } = usePortalStore()
  const { toast } = useToast()
  const myQuotes = quotes.filter((c) => c.customerId === currentUser?.customerId).reverse()

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Histórico de Cotações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {myQuotes.map((q) => (
          <div
            key={q.id}
            className="p-4 border rounded-xl flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <p className="font-bold text-[#800020]">Cód: {q.quoteCode}</p>
              <p className="text-sm text-slate-600">
                {q.origin} ➔ {q.dest} | NFe: {q.invoiceNumber}
              </p>
              <p className="text-xs text-slate-400">
                Data: {q.date} | Peso: {q.weight}kg
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xl font-black text-slate-800">R$ {q.value.toFixed(2)}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: 'Download Iniciado.' })}
              >
                Baixar PDF
              </Button>
            </div>
          </div>
        ))}
        {myQuotes.length === 0 && <p className="text-slate-500">Nenhuma cotação no histórico.</p>}
      </CardContent>
    </Card>
  )
}
