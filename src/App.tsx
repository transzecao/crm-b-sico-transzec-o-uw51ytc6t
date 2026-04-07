import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NavigateToDashboard } from './components/NavigateToDashboard'
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
import MarketingConteudo from './pages/MarketingConteudo'
import FinanceiroNovaCotacao from './pages/FinanceiroNovaCotacao'
import FinanceiroCotacoes from './pages/FinanceiroCotacoes'
import RoteirizacaoAgendar from './pages/RoteirizacaoAgendar'
import RoteirizacaoHistorico from './pages/RoteirizacaoHistorico'
import PortalHomeInt from './pages/PortalHomeInt'
import PortalCotacaoInt from './pages/PortalCotacaoInt'
import PortalConteudoInt from './pages/PortalConteudoInt'
import PortalColetaInt from './pages/PortalColetaInt'
import PortalDocumentosInt from './pages/PortalDocumentosInt'
import Tarefas from './pages/Tarefas'
import CotacaoDinamica from './pages/CotacaoDinamica'
import RoutePlansList from './pages/RoutePlansList'
import ThirdPartyLeads from './pages/ThirdPartyLeads'
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
            <Route path="/login" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/portal" element={<PortalCliente />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<NavigateToDashboard />} />

                <Route path="/admin/logins" element={<LoginAdmin />} />
                <Route path="/admin/portal" element={<PortalAdmin />} />

                <Route path="/supervisor/approvals" element={<SupervisorApprovals />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ia" element={<IA />} />

                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/financeiro/controle-gastos" element={<ControleGastos />} />
                <Route path="/financeiro/nova-cotacao" element={<FinanceiroNovaCotacao />} />
                <Route path="/financeiro/cotacoes" element={<FinanceiroCotacoes />} />
                <Route path="/cotacao-dinamica" element={<CotacaoDinamica />} />

                <Route path="/roteirizacao/agendar" element={<RoteirizacaoAgendar />} />
                <Route path="/roteirizacao/historico" element={<RoteirizacaoHistorico />} />
                <Route path="/roteirizacao/planos" element={<RoutePlansList />} />
                <Route path="/roteirizacao/regras" element={<Roteirizacao />} />
                <Route path="/roteirizacao/equipe" element={<Roteirizacao />} />
                <Route path="/marketing/conteudo" element={<MarketingConteudo />} />

                <Route path="/portal/home" element={<PortalHomeInt />} />
                <Route path="/portal/pedidos" element={<PortalColetaInt />} />
                <Route path="/portal/cotacao" element={<PortalCotacaoInt />} />
                <Route path="/portal/cotacao-dinamica" element={<CotacaoDinamica />} />
                <Route path="/portal/coleta" element={<PortalColetaInt />} />
                <Route path="/portal/conteudo" element={<PortalConteudoInt />} />
                <Route path="/portal/documentos" element={<PortalDocumentosInt />} />
                <Route path="/tarefas" element={<Tarefas />} />

                <Route path="/pipeline/1" element={<Pipeline1 />} />
                <Route path="/pipeline/2" element={<Pipeline2 />} />
                <Route path="/contatos" element={<Contatos />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/empresas/terceiros" element={<ThirdPartyLeads />} />
                <Route path="/empresa/nova" element={<EmpresaForm />} />
                <Route path="/empresa/:id/editar" element={<EmpresaForm />} />
                <Route path="/empresa/:id/360" element={<Company360 />} />

                <Route path="/roteirizacao" element={<Roteirizacao />} />

                <Route path="/app/dashboard" element={<Index />} />
                <Route path="/admin/dashboard" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
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
