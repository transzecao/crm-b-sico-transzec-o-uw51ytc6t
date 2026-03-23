import { Search, Globe, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 w-full bg-[#5b6e84] text-white flex items-center h-14 px-4 justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white transition-colors" />

        <Link
          to="/"
          className="font-bold text-lg tracking-wider flex items-center gap-2 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Globe className="w-5 h-5 opacity-80" />
          <span>TRANSZECÃO 24</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/pipeline/1"
            className="px-4 py-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            Negócios
          </Link>
          <Link
            to="/empresas"
            className="px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Empresas
          </Link>
          <button className="px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors">
            Minhas atividades
          </button>
          <button className="px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1">
            Vendas <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
          <button className="px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1">
            Análises <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
          <button className="px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1">
            Mais <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1.5 h-4 w-4 text-white/60" />
          <input
            type="search"
            placeholder="pesquisa"
            className="bg-black/20 border-none text-white placeholder:text-white/60 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-48 transition-all"
          />
        </div>

        <button className="hidden sm:block text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors">
          Convidar
        </button>

        <button className="hidden sm:block bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
          Comprar agora
        </button>

        <button className="text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
          Ajuda
          <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
            8
          </span>
        </button>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/20">
          <span className="text-sm font-medium hidden sm:block opacity-80">12:19</span>
          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-white/50 transition-all">
            <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
