import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  KanbanSquare,
  Sprout,
  DollarSign,
  BarChart3,
  BrainCircuit,
  KeyRound,
  Map as MapIcon,
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
import useCrmStore from '@/stores/useCrmStore'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const { state } = useCrmStore()

  const items = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      roles: ['Master', 'Supervisor Geral', 'Supervisor Comercial', 'Comercial', 'Diretoria'],
    },
    {
      title: 'Empresas',
      url: '/empresas',
      icon: Building2,
      roles: [
        'Master',
        'Supervisor Geral',
        'Supervisor Comercial',
        'Supervisor Coleta',
        'Comercial',
        'Coleta',
        'Diretoria',
      ],
    },
    {
      title: 'Contatos',
      url: '/contatos',
      icon: Users,
      roles: [
        'Master',
        'Supervisor Geral',
        'Supervisor Comercial',
        'Supervisor Coleta',
        'Comercial',
        'Coleta',
        'Diretoria',
      ],
    },
    {
      title: 'Prospecção',
      url: '/pipeline/1',
      icon: KanbanSquare,
      roles: ['Master', 'Supervisor Geral', 'Supervisor Comercial', 'Comercial', 'Diretoria'],
    },
    {
      title: 'Nutrição',
      url: '/pipeline/2',
      icon: Sprout,
      roles: [
        'Master',
        'Supervisor Geral',
        'Supervisor Comercial',
        'Comercial',
        'Marketing',
        'Diretoria',
      ],
    },
    {
      title: 'Roteirização',
      url: '/roteirizacao',
      icon: MapIcon,
      roles: ['Master', 'Supervisor Geral', 'Supervisor Coleta', 'Coleta', 'Diretoria'],
    },
    {
      title: 'Módulo Financeiro',
      url: '/financeiro',
      icon: DollarSign,
      roles: [
        'Master',
        'Supervisor Geral',
        'Supervisor Financeiro',
        'Financeiro',
        'Comercial',
        'Supervisor Comercial',
        'Diretoria',
      ],
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: BarChart3,
      roles: ['Master', 'Supervisor Geral', 'Diretoria', 'Comercial', 'Supervisor Comercial'],
    },
    {
      title: 'Governança',
      url: '/admin/logins',
      icon: KeyRound,
      roles: ['Master', 'Supervisor Geral', 'Diretoria'],
    },
    {
      title: 'The Brain (Global)',
      url: '/ia',
      icon: BrainCircuit,
      roles: ['Master', 'Supervisor Geral', 'Diretoria'],
    },
  ]

  const visibleItems = items.filter((item) => item.roles.includes(state.role))

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarContent className="px-3 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mb-3 px-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (location.pathname.startsWith('/empresa/') && item.url === '/empresas')

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
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
