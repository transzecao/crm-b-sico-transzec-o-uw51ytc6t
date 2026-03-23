import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  KanbanSquare,
  Sprout,
  DollarSign,
  BarChart3,
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
  ]

  const visibleItems = items.filter((item) => item.roles.includes(state.role))

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Transzecão LTDA
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
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
