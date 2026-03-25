import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/80 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
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
