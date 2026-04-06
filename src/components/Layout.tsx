import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { state, updateState, logAccess } = useCrmStore()

  useEffect(() => {
    logAccess(location.pathname)
  }, [location.pathname])

  const handleRoleChange = (val: any) => {
    updateState({ role: val })
    if (val === 'Cliente') {
      navigate('/portal/home')
    } else {
      navigate('/app/dashboard')
    }
  }

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

          {state.role === 'Acesso Master' && (
            <div className="bg-primary/5 border-b border-primary/10 px-6 py-1.5 flex items-center justify-end z-20 sticky top-0">
              <Link
                to="/admin/logins"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" /> Gerenciar Acessos do Sistema
              </Link>
            </div>
          )}

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
