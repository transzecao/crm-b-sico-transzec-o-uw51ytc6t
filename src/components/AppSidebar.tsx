import { Link, useLocation } from 'react-router-dom'
import {
  CheckSquare,
  Inbox,
  Building2,
  Users,
  KanbanSquare,
  Sprout,
  FileText,
  BarChart3,
  BrainCircuit,
  KeyRound,
  Map as MapIcon,
  Wallet,
  Calculator,
  LayoutDashboard,
  Truck,
  Settings,
  Users2,
  CalendarClock,
  Rss,
  FolderOpen,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import useCrmStore from '@/stores/useCrmStore'

export function AppSidebar() {
  const location = useLocation()
  const { state } = useCrmStore()

  const getMenuItems = () => {
    switch (state.role) {
      case 'Supervisor Financeiro':
        return [
          { title: 'Dashboard Financeiro', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'Gerenciamento de Fretes', url: '/financeiro', icon: Calculator },
          { title: 'Controle da Frota', url: '/financeiro/controle-gastos', icon: Wallet },
          { title: 'Cotações Pendentes', url: '/financeiro/cotacoes', icon: FileText },
          { title: 'Relatórios Financeiros', url: '/analytics', icon: BarChart3 },
        ]
      case 'Funcionário Financeiro':
        return [
          { title: 'Minha Área', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'COTAÇÃO', url: '/financeiro/nova-cotacao', icon: Calculator },
          { title: 'Histórico de Cotações', url: '/financeiro/cotacoes', icon: FileText },
          { title: 'Clientes Atribuídos', url: '/empresas', icon: Users2 },
        ]
      case 'Supervisor Coleta':
        return [
          { title: 'Dashboard Operacional', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'Roteirização e Agendamentos', url: '/roteirizacao', icon: MapIcon },
          { title: 'Regras de Agendamento', url: '/roteirizacao/regras', icon: Settings },
          { title: 'Equipe de Coleta', url: '/roteirizacao/equipe', icon: Users2 },
        ]
      case 'Funcionário Coleta':
        return [
          { title: 'Minhas Coletas', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'AGENDAR COLETA', url: '/roteirizacao/agendar', icon: CalendarClock },
          { title: 'Roteiro do Dia', url: '/roteirizacao', icon: Truck },
          { title: 'Histórico de Coletas', url: '/roteirizacao/historico', icon: MapIcon },
        ]
      case 'Supervisor Comercial':
        return [
          { title: 'Dashboard Comercial', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'Cadastro Lead Novo', url: '/empresa/nova', icon: Inbox },
          { title: 'Pipeline Prospecção', url: '/pipeline/1', icon: KanbanSquare },
          { title: 'Pipeline Nutrição', url: '/pipeline/2', icon: Sprout },
          { title: 'Contatos', url: '/contatos', icon: Users },
          { title: 'Empresas', url: '/empresas', icon: Building2 },
          { title: 'Aprovações Pendentes', url: '/supervisor/approvals', icon: CheckSquare },
        ]
      case 'Funcionário Prospecção':
        return [
          { title: 'Minha Prospecção', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'CADASTRO NOVO', url: '/empresa/nova', icon: Inbox },
          { title: 'Pipeline Prospecção', url: '/pipeline/1', icon: KanbanSquare },
          { title: 'Meus Contatos', url: '/contatos', icon: Users },
        ]
      case 'Funcionário Marketing':
        return [
          { title: 'Minha Nutrição', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'Pipeline Nutrição', url: '/pipeline/2', icon: Sprout },
          { title: 'CARD ESPECIAL', url: '/marketing/conteudo', icon: FileText },
        ]
      case 'Cliente':
        return [
          { title: 'Meu Dashboard', url: '/portal/home', icon: LayoutDashboard },
          { title: 'Meus Pedidos', url: '/portal/pedidos', icon: Truck },
          { title: 'COTAÇÃO', url: '/portal/cotacao', icon: Calculator },
          { title: 'AGENDAR COLETA', url: '/portal/coleta', icon: CalendarClock },
          { title: 'VER CONTEÚDO', url: '/portal/conteudo', icon: Rss },
          { title: 'Meus Documentos', url: '/portal/documentos', icon: FolderOpen },
        ]
      default: // Acesso Master
        return [
          { title: 'Dashboard', url: '/app/dashboard', icon: LayoutDashboard },
          { title: 'Lead Novo', url: '/empresa/nova', icon: Inbox },
          { title: 'Pipeline', url: '/pipeline/1', icon: KanbanSquare },
          { title: 'Nutrição', url: '/pipeline/2', icon: Sprout },
          { title: 'Contatos', url: '/contatos', icon: Users },
          { title: 'Empresas', url: '/empresas', icon: Building2 },
          { title: 'Propostas', url: '/financeiro', icon: FileText },
          { title: 'Controle de Gastos', url: '/financeiro/controle-gastos', icon: Wallet },
          { title: 'Relatórios', url: '/analytics', icon: BarChart3 },
          { title: 'Roteirização', url: '/roteirizacao', icon: MapIcon },
          { title: 'Aprovações', url: '/supervisor/approvals', icon: CheckSquare },
          { title: 'Marketing Content', url: '/marketing/conteudo', icon: Rss },
          { title: 'Governança', url: '/admin/logins', icon: KeyRound },
          { title: 'The Brain (Global)', url: '/ia', icon: BrainCircuit },
        ]
    }
  }

  const items = getMenuItems()

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarContent className="px-3 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mb-3 px-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (location.pathname.startsWith('/empresa/') &&
                    item.url === '/empresas' &&
                    item.title !== 'Lead Novo') ||
                  (location.pathname === '/empresa/nova' && item.title === 'Lead Novo')

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-tour={`menu-${item.title}`}
                      className={cn(
                        'transition-all duration-200 font-bold mb-1 rounded-lg h-10 px-3',
                        isActive
                          ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-primary',
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-[18px] h-[18px]" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
