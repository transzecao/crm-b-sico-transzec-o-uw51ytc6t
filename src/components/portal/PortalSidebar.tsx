import { LayoutDashboard, Truck, Calculator, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

export function PortalSidebar({ activeTab, setActiveTab }: any) {
  const items = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'coleta', label: 'Agendar Coleta', icon: Truck },
    { id: 'cotacao', label: 'Cotação', icon: Calculator },
  ]

  const SidebarContent = () => (
    <>
      <div className="p-4 flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            data-tour={`menu-${item.id}`}
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
    </>
  )

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col h-full">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="bg-[#800020] text-white p-4 rounded-full shadow-xl hover:bg-[#600018] transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-white">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
