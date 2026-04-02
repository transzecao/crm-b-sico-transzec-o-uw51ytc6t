import { useState, useEffect } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function PortalHeader() {
  const { currentUser } = usePortalStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const displayUser = currentUser || { name: 'Cliente Público', company: 'Público SA' }

  return (
    <header className="sticky top-0 z-40 w-full bg-white text-slate-800 flex items-center h-16 px-6 justify-between shadow-sm border-b border-slate-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src="https://storage.googleapis.com/skip-public-assets/public/7d501963-a24b-45d1-9072-0521cd179a05/1e6d4432-6a68-45af-bad2-e427cf6c9860/image.png"
            alt="Transzecão Icon"
            className="h-8 w-8 bg-[#800020] p-1.5 rounded-md object-contain shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#800020] leading-none">
              Transecão
            </span>
            <span className="text-xs font-medium text-slate-500">
              {displayUser.company || displayUser.name}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center">
        <span className="text-sm font-bold text-slate-700">Bem-vindo, {displayUser.name}!</span>
        <span className="text-xs text-slate-500 capitalize">
          {time.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          - {time.toLocaleTimeString('pt-BR')}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10 ring-2 ring-slate-100 shadow-sm">
          <AvatarFallback className="bg-[#800020] text-white text-xs font-bold">
            {displayUser.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
