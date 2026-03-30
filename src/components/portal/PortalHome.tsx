import usePortalStore from '@/stores/usePortalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Calculator, Clock } from 'lucide-react'

export function PortalHome() {
  const { currentUser, collections, quotes } = usePortalStore()

  const myCols = collections.filter((c) => c.customerId === currentUser?.customerId)
  const myQuotes = quotes.filter((c) => c.customerId === currentUser?.customerId)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-800">Resumo da Conta</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Coletas Ativas</p>
              <p className="text-2xl font-bold">
                {myCols.filter((c) => c.status !== 'routed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Calculator className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Cotações Realizadas</p>
              <p className="text-2xl font-bold">{myQuotes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" /> Últimas Coletas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myCols
              .slice(-5)
              .reverse()
              .map((c) => (
                <div
                  key={c.id}
                  className="py-2 border-b last:border-0 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-sm text-[#800020]">ID: {c.displayId}</p>
                    <p className="text-xs text-slate-500">{c.destName}</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-md h-fit">
                    {c.status}
                  </span>
                </div>
              ))}
            {myCols.length === 0 && (
              <p className="text-sm text-slate-500">Sem histórico de coletas.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Últimas Cotações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myQuotes
              .slice(-5)
              .reverse()
              .map((q) => (
                <div
                  key={q.id}
                  className="py-2 border-b last:border-0 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-sm text-[#800020]">Cód: {q.quoteCode}</p>
                    <p className="text-xs text-slate-500">
                      {q.origin} ➔ {q.dest}
                    </p>
                  </div>
                  <span className="font-bold text-[#800020]">R$ {q.value.toFixed(2)}</span>
                </div>
              ))}
            {myQuotes.length === 0 && (
              <p className="text-sm text-slate-500">Sem histórico de cotações.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
