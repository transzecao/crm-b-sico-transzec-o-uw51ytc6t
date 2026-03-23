import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useCrmStore, { Role } from '@/stores/useCrmStore'

export function AppHeader() {
  const { state, updateState } = useCrmStore()

  const roles: Role[] = [
    'Master',
    'Supervisor',
    'Comercial',
    'Financeiro',
    'Coleta',
    'Marketing',
    'Diretoria',
  ]

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center h-16 px-4 gap-4">
      <SidebarTrigger />
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-md hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar empresas, contatos..."
            className="w-full bg-background pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Select value={state.role} onValueChange={(val) => updateState({ role: val as Role })}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  )
}
