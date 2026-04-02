import { Search, Bell, Plus, BarChart3, HelpCircle, Kanban, Settings, Bot } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useCrmStore from '@/stores/useCrmStore'
import { useRealtime } from '@/hooks/use-realtime'
import { AdminPanelModal } from '@/components/fleet/AdminPanelModal'

export function AppHeader() {
  const { updateState } = useCrmStore()
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<
    { id: string; title: string; text: string; icon?: React.ReactNode }[]
  >([
    { id: '1', title: 'Novo lead capturado', text: 'Empresa XYZ preencheu o formulário' },
    { id: '2', title: 'Tarefa pendente', text: 'Ligar para Industrial SP Metalurgia' },
    { id: '3', title: 'Aviso do Setor', text: 'Reunião de alinhamento às 14h' },
  ])

  useRealtime('leads', (e) => {
    if (e.action === 'update' && e.record.ai_diagnosis) {
      setNotifications((prev) => {
        if (
          prev.length > 0 &&
          prev[0].title === 'Novo Diagnóstico IA' &&
          Date.now() - parseInt(prev[0].id) < 2000
        )
          return prev
        return [
          {
            id: Date.now().toString(),
            title: 'Novo Diagnóstico IA',
            text: `Análise atualizada para o lead ${e.record.name}`,
            icon: <Bot className="w-4 h-4 text-[#0056B3]" />,
          },
          ...prev,
        ]
      })
    }
  })

  const canCreate = true
  const canSeeAnalytics = true

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
              alt="Transzecão Icon"
              className="h-6 w-6 bg-white/95 p-1 rounded-sm object-contain shadow-sm"
            />
            <span className="text-lg font-black tracking-tight text-white">Transzecão</span>
          </Link>
          <span className="hidden lg:inline-block text-white/60 text-sm font-medium ml-2 border-l border-white/20 pl-4">
            CRM Central
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 ml-2">
          {canCreate && (
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
          )}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-white border-white/30 hover:bg-white/10 hover:text-white h-8 px-3 bg-transparent"
          >
            <Link to="/pipeline/1">
              <Kanban className="w-3.5 h-3.5 mr-1" />
              Pipeline
            </Link>
          </Button>
          {canSeeAnalytics && (
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
          )}
          {canSeeAnalytics && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdminModalOpen(true)}
              className="text-white border-white/30 hover:bg-white/10 hover:text-white h-8 px-3 bg-transparent"
            >
              <Settings className="w-3.5 h-3.5 mr-1" />
              Modo Administrador
            </Button>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">
            Modo:
          </span>
          <div className="h-8 px-3 flex items-center bg-white/10 border border-white/20 rounded-md text-xs text-white capitalize">
            Acesso Público
          </div>
        </div>

        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white/80 transition-colors" />
          <input
            type="search"
            placeholder={`Buscar...`}
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:w-64 w-48 transition-all"
            title={`Buscar no sistema`}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => updateState({ tourOpen: true })}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Iniciar Tour Guiado"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0056B3] rounded-full border-2 border-[#800020]"></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 max-h-96 overflow-y-auto">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="cursor-pointer">
                  <div className="flex items-start gap-2 w-full">
                    {n.icon && <div className="mt-0.5">{n.icon}</div>}
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm">{n.title}</span>
                      <span className="text-xs text-slate-500 line-clamp-2">{n.text}</span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/20">
          <Avatar className="w-8 h-8 ring-2 ring-white/20 shadow-sm">
            <AvatarFallback className="bg-white text-[#800020] text-[10px] font-bold">
              US
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <AdminPanelModal open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen} />
    </header>
  )
}
