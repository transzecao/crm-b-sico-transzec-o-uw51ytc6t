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
  SidebarHeader,
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
      roles: ['Master', 'Supervisor', 'Comercial', 'Diretoria'],
    },
    {
      title: 'Empresas',
      url: '/empresas',
      icon: Building2,
      roles: ['Master', 'Supervisor', 'Comercial', 'Coleta'],
    },
    {
      title: 'Contatos',
      url: '/contatos',
      icon: Users,
      roles: ['Master', 'Supervisor', 'Comercial', 'Coleta'],
    },
    {
      title: 'Prospecção',
      url: '/pipeline/1',
      icon: KanbanSquare,
      roles: ['Master', 'Supervisor', 'Comercial'],
    },
    {
      title: 'Nutrição',
      url: '/pipeline/2',
      icon: Sprout,
      roles: ['Master', 'Supervisor', 'Comercial', 'Marketing'],
    },
    { title: 'Financeiro', url: '/financeiro', icon: DollarSign, roles: ['Master', 'Financeiro'] },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: BarChart3,
      roles: ['Master', 'Supervisor', 'Diretoria'],
    },
    {
      title: 'The Brain (IA)',
      url: '/ia',
      icon: BrainCircuit,
      roles: ['Master', 'Supervisor', 'Comercial', 'Marketing', 'Diretoria'],
    },
  ]

  const visibleItems = items.filter((item) => item.roles.includes(state.role))

  const getThemeClasses = (url: string) => {
    if (url.startsWith('/financeiro'))
      return 'data-[active=true]:bg-emerald-100/80 data-[active=true]:text-emerald-900 hover:bg-emerald-50 hover:text-emerald-800'
    if (url.startsWith('/contatos') || url.startsWith('/empresas') || url.startsWith('/empresa'))
      return 'data-[active=true]:bg-blue-100/80 data-[active=true]:text-blue-900 hover:bg-blue-50 hover:text-blue-800'
    if (url.startsWith('/pipeline/1'))
      return 'data-[active=true]:bg-violet-100/80 data-[active=true]:text-violet-900 hover:bg-violet-50 hover:text-violet-800'
    if (url.startsWith('/pipeline/2'))
      return 'data-[active=true]:bg-amber-100/80 data-[active=true]:text-amber-900 hover:bg-amber-50 hover:text-amber-800'
    if (url.startsWith('/analytics'))
      return 'data-[active=true]:bg-slate-200/80 data-[active=true]:text-slate-900 hover:bg-slate-100 hover:text-slate-800'
    if (url.startsWith('/ia'))
      return 'data-[active=true]:bg-fuchsia-100/80 data-[active=true]:text-fuchsia-900 hover:bg-fuchsia-50 hover:text-fuchsia-800'
    return 'data-[active=true]:bg-indigo-100/80 data-[active=true]:text-indigo-900 hover:bg-indigo-50 hover:text-indigo-800'
  }

  return (
    <Sidebar className="border-r border-slate-200 bg-slate-50/50 backdrop-blur-sm">
      <SidebarHeader className="p-4 border-b border-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="bg-indigo-100/80 p-1.5 rounded-lg border border-indigo-200/50">
            <Building2 className="w-5 h-5 text-indigo-700" />
          </div>
          Transzecão
        </h2>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-semibold text-xs tracking-wider uppercase mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url ||
                      (location.pathname.startsWith('/empresa/') && item.url === '/empresas')
                    }
                    className={cn(
                      'transition-all duration-200 font-medium mb-1 rounded-md',
                      getThemeClasses(item.url),
                      location.pathname !== item.url && 'text-slate-600 hover:bg-slate-100',
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-[18px] h-[18px]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
