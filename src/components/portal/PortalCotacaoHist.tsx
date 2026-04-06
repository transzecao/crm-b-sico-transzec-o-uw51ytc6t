import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getDocumentosCotacao } from '@/services/documentos_cotacao'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export function PortalCotacaoHist() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<any[]>([])

  const loadData = async () => {
    if (!user) return
    const res = await getDocumentosCotacao(user.id)
    setQuotes(res)
  }

  useEffect(() => {
    loadData()
  }, [user])

  useRealtime('documentos_cotacao', () => loadData())

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>Histórico de Cotações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotes.map((q) => (
          <div
            key={q.id}
            className="p-4 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm gap-4"
          >
            <div>
              <p className="font-bold text-[#800020] text-sm break-all">
                Doc: {q.numero_cotacao || q.id}
              </p>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {q.origem || 'Não informado'} ➔ {q.destino || 'Não informado'}
              </p>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <Badge
                  variant={q.status === 'pendente' ? 'secondary' : 'default'}
                  className="uppercase text-[10px]"
                >
                  {q.status || 'pendente'}
                </Badge>
                <span className="text-xs text-slate-400">
                  Gerada em:{' '}
                  {q.data_geracao
                    ? format(new Date(q.data_geracao), 'dd/MM/yyyy HH:mm')
                    : format(new Date(q.created), 'dd/MM/yyyy HH:mm')}
                </span>
                {q.peso && <span className="text-xs text-slate-400">Peso: {q.peso}kg</span>}
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
              <span className="text-xl font-black text-slate-800">
                R$ {q.valor ? q.valor.toFixed(2) : '0.00'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast({ title: `Download do PDF ${q.numero_cotacao || q.id} Iniciado.` })
                }
              >
                Ver Documento
              </Button>
            </div>
          </div>
        ))}
        {quotes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">Nenhuma cotação encontrada no histórico.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
