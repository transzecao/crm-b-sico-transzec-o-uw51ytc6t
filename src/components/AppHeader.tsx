import { Search, Globe, Bell, Settings, Plus, BarChart3 } from 'lucide-react'
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
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 text-white flex items-center h-14 px-4 justify-between shadow-sm border-b border-slate-800">
      <div className="flex items-center gap-4 sm:gap-6">
        <SidebarTrigger className="text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" />

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="font-bold text-lg tracking-wider flex items-center gap-2 text-white hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            <div className="bg-indigo-500/20 p-1.5 rounded-md">
              <Globe className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="hidden sm:inline-block">TRANSZECÃO</span>
          </Link>
          <span className="hidden lg:inline-block text-slate-400 text-sm font-medium ml-2 border-l border-slate-700 pl-4">
            CRM - Pipeline de Prospecção
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 ml-2">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-none h-8 px-3"
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
            className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white h-8 px-3"
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
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
            Perfil:
          </span>
          <Select value={state.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-8 w-[140px] bg-slate-800 border-slate-700 text-xs text-white focus:ring-indigo-500/50">
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Pesquisar..."
            className="bg-slate-800/50 border border-slate-700 text-slate-200 placeholder:text-slate-400 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-48 transition-all"
          />
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-700">
          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-slate-800 hover:ring-indigo-500/50 transition-all shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
              {state.role.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
