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
      title: 'Dashboard',
      url: '/app/dashboard',
      icon: CheckSquare,
      roles: [
        'master',
        'sup_financeiro',
        'sup_comercial',
        'sup_coleta',
        'func_comercial',
        'func_marketing',
        'func_coleta',
      ],
    },
    {
      title: 'Lead Novo',
      url: '/empresa/nova',
      icon: Inbox,
      roles: ['master', 'sup_comercial', 'func_comercial'],
    },
    {
      title: 'Pipeline',
      url: '/pipeline/1',
      icon: KanbanSquare,
      roles: ['master', 'sup_comercial', 'func_comercial'],
    },
    {
      title: 'Nutrição',
      url: '/pipeline/2',
      icon: Sprout,
      roles: ['master', 'sup_comercial', 'func_comercial', 'func_marketing'],
    },
    {
      title: 'Contatos',
      url: '/contatos',
      icon: Users,
      roles: ['master', 'sup_comercial', 'func_comercial'],
    },
    {
      title: 'Empresas',
      url: '/empresas',
      icon: Building2,
      roles: ['master', 'sup_comercial', 'func_comercial'],
    },
    {
      title: 'Propostas',
      url: '/financeiro',
      icon: FileText,
      roles: ['master', 'sup_financeiro'],
    },
    {
      title: 'Controle de Gastos',
      url: '/financeiro/controle-gastos',
      icon: Wallet,
      roles: ['master', 'sup_financeiro'],
    },
    {
      title: 'Relatórios',
      url: '/analytics',
      icon: BarChart3,
      roles: ['master', 'sup_financeiro', 'sup_comercial', 'sup_coleta'],
    },
    {
      title: 'Roteirização',
      url: '/roteirizacao',
      icon: MapIcon,
      roles: ['master', 'sup_coleta', 'func_coleta'],
    },
    {
      title: 'Aprovações',
      url: '/supervisor/approvals',
      icon: CheckSquare,
      roles: ['master', 'sup_financeiro', 'sup_comercial', 'sup_coleta'],
    },
    {
      title: 'Governança',
      url: '/admin/logins',
      icon: KeyRound,
      roles: ['master'],
    },
    {
      title: 'The Brain (Global)',
      url: '/ia',
      icon: BrainCircuit,
      roles: ['master', 'sup_financeiro', 'sup_comercial', 'sup_coleta'],
    },
  ]

  const userRole = user?.role || 'func_comercial'
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
