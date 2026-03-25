import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useEffect, useState } from 'react'
import useCrmStore from '@/stores/useCrmStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  const { state, updateState, logAccess } = useCrmStore()

  useEffect(() => {
    logAccess(location.pathname)
  }, [location.pathname])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/80 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />

          <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between shadow-sm z-20 sticky top-0">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-700">
                Simulador de Perfil (Governança):
              </span>
            </div>
            <Select value={state.role} onValueChange={(val: any) => updateState({ role: val })}>
              <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-50 border-slate-200 focus:ring-indigo-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Master">Master (Acesso Total)</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Coleta">Coleta</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Diretoria">Diretoria (Apenas Leitura)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <main className="flex-1 p-3 md:p-6 overflow-auto">
            <div className="mx-auto w-full max-w-7xl animate-fade-in-up h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
