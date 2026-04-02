import { Card } from '@/components/ui/card'

export function MapViewer({ waypoints, routeGenerated }: any) {
  return (
    <Card className="border-slate-200 shadow-sm bg-slate-100 h-[600px] flex items-center justify-center relative overflow-hidden">
      {!routeGenerated ? (
        <div className="text-center space-y-2">
          <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-2 border border-slate-200">
            <span className="text-4xl">🗺️</span>
          </div>
          <h3 className="font-bold text-slate-700">Nenhum Ponto Selecionado</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Selecione agendamentos e clique em "Salvar Rota Otimizada" para visualizar o mapa.
          </p>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/600?q=map%20route&color=gray')] bg-cover bg-center opacity-80 mix-blend-multiply">
          <div className="absolute inset-0 bg-primary/10"></div>
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-200 max-w-xs z-10">
            <h4 className="font-black text-slate-800 border-b border-slate-100 pb-2 mb-3">
              Resumo da Rota Estimada
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Paradas:</span>
                <span className="font-black text-primary">{waypoints.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Peso Total:</span>
                <span className="font-black text-slate-800">
                  {waypoints.reduce((acc: number, w: any) => acc + (Number(w.weight) || 0), 0)} KG
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
