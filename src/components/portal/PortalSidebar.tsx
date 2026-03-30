import {
  LayoutDashboard,
  Truck,
  Calculator,
  FileText,
  MessageSquare,
  LogOut,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function PortalSidebar({ activeTab, setActiveTab, onLogout }: any) {
  const items = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'coleta', label: 'Agendar Coleta', icon: Truck },
    { id: 'cotacao', label: 'Cotação', icon: Calculator },
    { id: 'cotacao-hist', label: 'Histórico de Cotações', icon: History },
    { id: 'docs', label: 'Ver Documentos', icon: FileText },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 flex-1 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm',
              activeTab === item.id
                ? 'bg-[#800020]/10 text-[#800020]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#800020]',
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sair do Portal
        </button>
      </div>
    </aside>
  )
}
