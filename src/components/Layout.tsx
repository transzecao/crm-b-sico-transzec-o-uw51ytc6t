import { Outlet, useLocation, Link } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useEffect } from 'react'
import useCrmStore from '@/stores/useCrmStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield, Settings } from 'lucide-react'
import { GuidedTour } from './GuidedTour'

export default function Layout() {
  const location = useLocation()
  const { state, updateState, logAccess } = useCrmStore()

  useEffect(() => {
    logAccess(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('tour_seen_' + state.currentUser.name)
    if (!hasSeenTour) {
      updateState({ tourOpen: true })
      localStorage.setItem('tour_seen_' + state.currentUser.name, 'true')
    }
  }, [state.currentUser.name, updateState])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#F4F4F4] text-[#4A4A4A] selection:bg-primary/20 selection:text-primary">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />

          <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between shadow-sm z-20 sticky top-0">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-bold text-slate-700">Governança (Simulador):</span>
            </div>
            <div className="flex items-center gap-4">
              {state.role === 'Acesso Master' && (
                <Link
                  to="/admin/logins"
                  className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Settings className="w-3.5 h-3.5" /> Acessos
                </Link>
              )}
              <Select value={state.role} onValueChange={(val: any) => updateState({ role: val })}>
                <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-50 border-slate-200 font-semibold focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acesso Master">Acesso Master</SelectItem>
                  <SelectItem value="Supervisor Financeiro">Supervisor Financeiro</SelectItem>
                  <SelectItem value="Supervisor Comercial">Supervisor Comercial</SelectItem>
                  <SelectItem value="Supervisor Coleta">Supervisor Coleta</SelectItem>
                  <SelectItem value="Funcionário Comercial">Funcionário Comercial</SelectItem>
                  <SelectItem value="Funcionário Marketing">Funcionário Marketing</SelectItem>
                  <SelectItem value="Funcionário Coleta">Funcionário Coleta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <main className="flex-1 flex flex-col p-3 md:p-6 overflow-auto relative">
            <div className="mx-auto w-full max-w-7xl animate-fade-in-up flex-1 relative z-0">
              <Outlet />
            </div>

            <footer className="mt-12 py-6 border-t border-slate-200 flex flex-col items-center justify-center text-slate-500">
              <img
                src="https://storage.googleapis.com/skip-public-assets/public/7d501963-a24b-45d1-9072-0521cd179a05/1e6d4432-6a68-45af-bad2-e427cf6c9860/image.png"
                alt="Transzecão"
                className="h-10 grayscale opacity-50 mb-2 object-contain mix-blend-multiply"
              />
              <p className="text-xs font-medium uppercase tracking-wider mb-2">
                Transporte de Cargas &copy; {new Date().getFullYear()}
              </p>
              <Link to="/portal" className="text-xs text-primary font-bold hover:underline">
                Acessar Portal do Cliente (Simulação Externa)
              </Link>
            </footer>
          </main>
        </div>
      </div>
      <GuidedTour />
    </SidebarProvider>
  )
}
