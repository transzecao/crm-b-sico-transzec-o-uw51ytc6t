import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NavigateToDashboard } from './components/NavigateToDashboard'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portal" element={<PortalCliente />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<NavigateToDashboard />} />

                <Route element={<ProtectedRoute allowedRoles={['Master']} />}>
                  <Route path="/admin/logins" element={<LoginAdmin />} />
                  <Route path="/admin/portal" element={<PortalAdmin />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'Master',
                        'Supervisor_Financeiro',
                        'Supervisor_Comercial',
                        'Supervisor_Coleta',
                      ]}
                    />
                  }
                >
                  <Route path="/supervisor/approvals" element={<SupervisorApprovals />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ia" element={<IA />} />
                </Route>

                <Route
                  element={<ProtectedRoute allowedRoles={['Master', 'Supervisor_Financeiro']} />}
                >
                  <Route path="/financeiro" element={<Financeiro />} />
                  <Route path="/financeiro/controle-gastos" element={<ControleGastos />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'Master',
                        'Supervisor_Comercial',
                        'Funcionário_Comercial',
                        'Funcionário_Marketing',
                      ]}
                    />
                  }
                >
                  <Route path="/pipeline/1" element={<Pipeline1 />} />
                  <Route path="/pipeline/2" element={<Pipeline2 />} />
                  <Route path="/contatos" element={<Contatos />} />
                  <Route path="/empresas" element={<Empresas />} />
                  <Route path="/empresa/nova" element={<EmpresaForm />} />
                  <Route path="/empresa/:id/editar" element={<EmpresaForm />} />
                  <Route path="/empresa/:id/360" element={<Company360 />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['Master', 'Supervisor_Coleta', 'Funcionário_Coleta']}
                    />
                  }
                >
                  <Route path="/roteirizacao" element={<Roteirizacao />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'Master',
                        'Supervisor_Financeiro',
                        'Supervisor_Comercial',
                        'Supervisor_Coleta',
                        'Funcionário_Comercial',
                        'Funcionário_Marketing',
                        'Funcionário_Coleta',
                        'Cliente',
                      ]}
                    />
                  }
                >
                  <Route path="/app/dashboard" element={<Index />} />
                  <Route path="/admin/dashboard" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </PortalProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
