import { Card } from '@/components/ui/card'
import { Waypoint } from '@/pages/Roteirizacao'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MapViewer({
  waypoints,
  routeGenerated,
}: {
  waypoints: Waypoint[]
  routeGenerated: boolean
}) {
  const getCoordinates = (index: number) => {
    const positions = [
      { top: '30%', left: '40%' },
      { top: '60%', left: '60%' },
      { top: '45%', left: '75%' },
      { top: '20%', left: '55%' },
      { top: '70%', left: '30%' },
    ]
    return positions[index % positions.length]
  }

  return (
    <Card className="border-sky-200 shadow-sm overflow-hidden bg-white/90">
      <div className="relative w-full h-[400px] bg-slate-100 flex items-center justify-center overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/800?q=city%20map%20light')] bg-cover bg-center transition-all duration-1000",
            routeGenerated
              ? 'mix-blend-normal opacity-80'
              : 'mix-blend-luminosity opacity-40 grayscale',
          )}
        />

        {routeGenerated && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-10"
            style={{ zIndex: 10 }}
          >
            <path
              d="M 40% 30% Q 50% 45% 60% 60% T 75% 45%"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeDasharray="8 8"
            />
          </svg>
        )}

        <div className="absolute inset-0 z-20">
          {waypoints.map((wp, index) => {
            const coords = getCoordinates(index)
            const colorClass =
              wp.priority === 'Alta'
                ? 'text-rose-500 fill-rose-500/20'
                : wp.priority === 'Média'
                  ? 'text-amber-500 fill-amber-500/20'
                  : 'text-emerald-500 fill-emerald-500/20'

            return (
              <div
                key={wp.id}
                className={cn(
                  'absolute flex flex-col items-center -translate-x-1/2 -translate-y-full transition-all duration-500',
                  routeGenerated ? 'scale-110' : 'scale-100',
                )}
                style={coords}
              >
                <div className="bg-white px-2 py-1 rounded shadow-md text-[10px] font-bold text-slate-800 mb-1 border border-slate-200 whitespace-nowrap">
                  {routeGenerated && <span className="text-sky-600 mr-1">{index + 1}.</span>}
                  {wp.address.split(',')[0] || `Ponto ${index + 1}`}
                </div>
                <MapPin className={cn('w-8 h-8 drop-shadow-md', colorClass)} />
              </div>
            )
          })}
        </div>

        {!routeGenerated && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-100 shadow-sm text-sm font-semibold text-sky-800 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Preencha os dados e gere a rota
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
