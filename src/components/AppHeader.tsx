import { Search, Globe, Bell, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 text-white flex items-center h-14 px-4 justify-between shadow-sm border-b border-slate-800">
      <div className="flex items-center gap-4 sm:gap-6">
        <SidebarTrigger className="text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" />

        <Link
          to="/"
          className="font-bold text-lg tracking-wider flex items-center gap-2 text-white hover:text-slate-200 transition-colors whitespace-nowrap"
        >
          <div className="bg-indigo-500/20 p-1.5 rounded-md">
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="hidden sm:inline-block">TRANSZECÃO</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium ml-4">
          <Link
            to="/pipeline/1"
            className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            Negócios
          </Link>
          <Link
            to="/empresas"
            className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            Empresas
          </Link>
          <button className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            Atividades
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Pesquisar no CRM..."
            className="bg-slate-800/50 border border-slate-700 text-slate-200 placeholder:text-slate-400 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-56 transition-all"
          />
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-700">
          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-slate-800 hover:ring-indigo-500/50 transition-all shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
              US
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
