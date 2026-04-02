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

export function AppSidebar() {
  const location = useLocation()

  const items = [
    { title: 'Dashboard', url: '/app/dashboard', icon: CheckSquare },
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
    { title: 'Governança', url: '/admin/logins', icon: KeyRound },
    { title: 'The Brain (Global)', url: '/ia', icon: BrainCircuit },
  ]

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
