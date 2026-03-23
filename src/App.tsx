import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import Index from './pages/Index'
import Empresas from './pages/Empresas'
import Contatos from './pages/Contatos'
import Pipeline1 from './pages/Pipeline1'
import Pipeline2 from './pages/Pipeline2'
import Company360 from './pages/Company360'
import Financeiro from './pages/Financeiro'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/pipeline/1" element={<Pipeline1 />} />
          <Route path="/pipeline/2" element={<Pipeline2 />} />
          <Route path="/empresa/:id/360" element={<Company360 />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
