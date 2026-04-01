import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import Index from './pages/Index'
import Empresas from './pages/Empresas'
import EmpresaForm from './pages/EmpresaForm'
import Contatos from './pages/Contatos'
import Pipeline1 from './pages/Pipeline1'
import Pipeline2 from './pages/Pipeline2'
import Company360 from './pages/Company360'
import Financeiro from './pages/Financeiro'
import ControleGastos from './pages/ControleGastos'
import Analytics from './pages/Analytics'
import LoginAdmin from './pages/LoginAdmin'
import NotFound from './pages/NotFound'
import IA from './pages/IA'
import Roteirizacao from './pages/Roteirizacao'
import PortalCliente from './pages/PortalCliente'
import PortalAdmin from './pages/PortalAdmin'
import SupervisorApprovals from './pages/SupervisorApprovals'
import Profile from './pages/Profile'
import { PortalProvider } from '@/stores/usePortalStore'
import { AuthProvider } from '@/hooks/use-auth'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <PortalProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/portal" element={<PortalCliente />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/empresas" element={<Empresas />} />
              <Route path="/empresa/nova" element={<EmpresaForm />} />
              <Route path="/empresa/:id/editar" element={<EmpresaForm />} />
              <Route path="/contatos" element={<Contatos />} />
              <Route path="/pipeline/1" element={<Pipeline1 />} />
              <Route path="/pipeline/2" element={<Pipeline2 />} />
              <Route path="/empresa/:id/360" element={<Company360 />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/financeiro/controle-gastos" element={<ControleGastos />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin/logins" element={<LoginAdmin />} />
              <Route path="/admin/portal" element={<PortalAdmin />} />
              <Route path="/supervisor/approvals" element={<SupervisorApprovals />} />
              <Route path="/ia" element={<IA />} />
              <Route path="/roteirizacao" element={<Roteirizacao />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </PortalProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
