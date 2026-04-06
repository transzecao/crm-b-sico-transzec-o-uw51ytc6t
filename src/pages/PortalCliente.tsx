import { useState } from 'react'
import usePortalStore from '@/stores/usePortalStore'
import { PortalAuth } from '@/components/portal/PortalAuth'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import { PortalHome } from '@/components/portal/PortalHome'
import { PortalColeta } from '@/components/portal/PortalColeta'
import { PortalCotacao } from '@/components/portal/PortalCotacao'
import { PortalCotacaoHist } from '@/components/portal/PortalCotacaoHist'
import { PortalDocs } from '@/components/portal/PortalDocs'
import { PortalMessages } from '@/components/portal/PortalMessages'
import { PortalConteudo } from '@/components/portal/PortalConteudo'
import { PortalPedidos } from '@/components/portal/PortalPedidos'
import { PortalTour } from '@/components/portal/PortalTour'
import { Package } from 'lucide-react'

export default function PortalCliente() {
  const { currentUser, logout } = usePortalStore()
  const [activeTab, setActiveTab] = useState('home')

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center p-4">
        <PortalAuth />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F4F4F4] text-slate-800">
      <PortalSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#800020] h-16 flex items-center px-6 justify-between shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <Package className="text-white w-6 h-6" />
            <h1 className="text-xl font-black text-white">Transzecão Portal</h1>
          </div>
          <div className="text-white text-sm font-medium">
            Olá, {currentUser.name} (ID: {currentUser.customerId})
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'home' && <PortalHome />}
          {activeTab === 'pedidos' && <PortalPedidos />}
          {activeTab === 'coleta' && <PortalColeta />}
          {activeTab === 'cotacao' && <PortalCotacao />}
          {activeTab === 'cotacao-hist' && <PortalCotacaoHist />}
          {activeTab === 'docs' && <PortalDocs />}
          {activeTab === 'messages' && <PortalMessages />}
          {activeTab === 'conteudo' && <PortalConteudo />}
        </main>
      </div>
      <PortalTour />
    </div>
  )
}
