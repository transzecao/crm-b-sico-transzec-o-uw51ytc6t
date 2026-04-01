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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import useCrmStore from '@/stores/useCrmStore'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    signOut()
    window.location.href = '/login'
  }

  const items = [
    {
      title: 'Tarefas',
      url: '/app/dashboard',
      icon: CheckSquare,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Lead Novo',
      url: '/empresa/nova',
      icon: Inbox,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Pipeline',
      url: '/pipeline/1',
      icon: KanbanSquare,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Nutrição',
      url: '/pipeline/2',
      icon: Sprout,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Contatos',
      url: '/contatos',
      icon: Users,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Empresas',
      url: '/empresas',
      icon: Building2,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Propostas',
      url: '/financeiro',
      icon: FileText,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Controle de Gastos',
      url: '/financeiro/controle-gastos',
      icon: Wallet,
      roles: ['admin', 'supervisor'],
    },
    {
      title: 'Relatórios',
      url: '/analytics',
      icon: BarChart3,
      roles: ['admin', 'supervisor'],
    },
    {
      title: 'Roteirização',
      url: '/roteirizacao',
      icon: MapIcon,
      roles: ['admin', 'supervisor', 'employee'],
    },
    {
      title: 'Aprovações',
      url: '/supervisor/approvals',
      icon: CheckSquare,
      roles: ['admin', 'supervisor'],
    },
    {
      title: 'Governança',
      url: '/admin/logins',
      icon: KeyRound,
      roles: ['admin'],
    },
    {
      title: 'The Brain (Global)',
      url: '/ia',
      icon: BrainCircuit,
      roles: ['admin', 'supervisor'],
    },
  ]

  const userRole = user?.role || 'employee'
  const visibleItems = items.filter((item) => item.roles.includes(userRole))

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
      <SidebarFooter className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
