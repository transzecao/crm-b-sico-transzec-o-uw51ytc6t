import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function MapViewer({
  waypoints = [],
  routeGenerated,
  selectedVehicle,
  selectedDate,
  vehicleName,
}: any) {
  return (
    <Card className="border-slate-200 shadow-sm bg-slate-100 h-[600px] flex items-center justify-center relative overflow-hidden">
      {!routeGenerated ? (
        <div className="text-center space-y-2 z-10">
          <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-2 border border-slate-200">
            <span className="text-4xl">🗺️</span>
          </div>
          <h3 className="font-bold text-slate-700">Nenhum Veículo ou Rota</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Selecione um veículo e agendamentos para visualizar o traçado no mapa.
          </p>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/600?q=map%20route&color=gray')] bg-cover bg-center opacity-90 mix-blend-multiply">
          <div className="absolute inset-0 bg-primary/5"></div>

          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-slate-200 z-10 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rota ao Vivo
              </p>
              <p className="font-black text-slate-800">
                {vehicleName || 'Veículo não identificado'}
              </p>
              <p className="text-xs text-slate-500">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('pt-BR') : 'Sem data'}
              </p>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-200 w-64 z-10">
            <h4 className="font-black text-slate-800 border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
              Resumo da Carga
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-600 border-emerald-200"
              >
                Online
              </Badge>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Paradas:</span>
                <span className="font-black text-primary text-lg">{waypoints.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Peso Total:</span>
                <span className="font-black text-slate-800">
                  {waypoints.reduce((acc: number, w: any) => acc + (Number(w.weight) || 0), 0)} KG
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Volume Est.:</span>
                <span className="font-black text-slate-800">
                  {waypoints.reduce((acc: number, w: any) => acc + (Number(w.volume) || 0), 0)} m³
                </span>
              </div>
            </div>
          </div>

          {waypoints.length > 0 && (
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg" />

              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 33% 50% Q 40% 40% 50% 33% T 66% 66%"
                  fill="transparent"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="opacity-60"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
