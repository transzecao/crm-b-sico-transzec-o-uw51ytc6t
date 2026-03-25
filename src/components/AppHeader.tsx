import { Search, Bell, Plus, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore, { Role } from '@/stores/useCrmStore'

export function AppHeader() {
  const { state, updateState } = useCrmStore()

  const handleRoleChange = (role: string) => {
    updateState({ role: role as Role })
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#800020] text-white flex items-center h-14 px-4 justify-between shadow-md border-b border-[#5c0017]">
      <div className="flex items-center gap-4 sm:gap-6">
        <SidebarTrigger className="text-white/80 hover:text-white transition-colors" />

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <img
              src="https://storage.googleapis.com/skip-public-assets/public/7d501963-a24b-45d1-9072-0521cd179a05/1e6d4432-6a68-45af-bad2-e427cf6c9860/image.png"
              alt="Transzecão Logo"
              className="h-8 bg-white/95 p-1 rounded-sm object-contain shadow-sm"
            />
          </Link>
          <span className="hidden lg:inline-block text-white/60 text-sm font-medium ml-2 border-l border-white/20 pl-4">
            CRM Central
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 ml-2">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="bg-[#0056B3] hover:bg-[#004494] text-white border-none h-8 px-3"
          >
            <Link to="/empresa/nova">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Criar Lead
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-white border-white/30 hover:bg-white/10 hover:text-white h-8 px-3 bg-transparent"
          >
            <Link to="/analytics">
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Relatórios
            </Link>
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">
            Perfil:
          </span>
          <Select value={state.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-8 w-[140px] bg-white/10 border-white/20 text-xs text-white focus:ring-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Master">Master</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Coleta">Coleta</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Diretoria">Diretoria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="search"
            placeholder="Buscar..."
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 w-48 transition-all"
          />
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0056B3] rounded-full border-2 border-[#800020]"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/20">
          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-white/20 hover:ring-white/50 transition-all shadow-sm">
            <AvatarFallback className="bg-white text-[#800020] text-xs font-bold">
              {state.role.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
