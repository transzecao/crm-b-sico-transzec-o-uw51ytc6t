import { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useCrmStore from '@/stores/useCrmStore'
import { Code2, User } from 'lucide-react'

export const TOOL_NAMES: Record<string, { user: string; dev: string }> = {
  finance_cpk: { user: 'Calculadora CPK', dev: 'Configuração CPK' },
  freight_calculation: { user: 'Cálculo de Frete', dev: 'Regras de Frete' },
  prospeccao: { user: 'Pipeline de Vendas', dev: 'Configuração de Campos' },
  collection_scheduling: { user: 'Agendamento de Coleta', dev: 'Configuração de Coleta' },
  lead_registration: { user: 'Cadastro de Leads', dev: 'Configuração de Leads' },
}

interface ToolBaseProps {
  toolId: string
  UserComponent: ReactNode
  DeveloperComponent: ReactNode
}

export function ToolBase({ toolId, UserComponent, DeveloperComponent }: ToolBaseProps) {
  const { state } = useCrmStore()
  const { canAccessTool, isDeveloperOf } = state.permissions

  if (!canAccessTool(toolId)) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-10">
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>Você não tem permissão para acessar esta ferramenta.</AlertDescription>
      </Alert>
    )
  }

  const names = TOOL_NAMES[toolId] || { user: 'Operacional', dev: 'Configuração' }

  if (isDeveloperOf(toolId)) {
    return (
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {names.user}
          </TabsTrigger>
          <TabsTrigger value="developer" className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            {names.dev}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="m-0">
          {UserComponent}
        </TabsContent>
        <TabsContent value="developer" className="m-0">
          {DeveloperComponent}
        </TabsContent>
      </Tabs>
    )
  }

  return <>{UserComponent}</>
}
