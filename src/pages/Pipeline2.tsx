import { useMemo } from 'react'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { Sprout, Mail, Reply, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COLUMNS = [
  'Nutrição – Aquecimento',
  'Conteúdo de valor',
  'Conteúdo do mercado',
  'Conteúdo do segmento',
]

export default function Pipeline2() {
  const { state, updateState, logAccess } = useCrmStore()
  const { toast } = useToast()

  const nutritionLeads = useMemo(
    () => state.leads.filter((l) => l.pipeline === 'Nutrition'),
    [state.leads],
  )

  const canMove = ['Comercial', 'Master', 'Marketing', 'Supervisor', 'Diretoria'].includes(
    state.role,
  )

  const handleMove = (id: string, stage: string) => {
    if (!canMove) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para mover leads na Nutrição.',
        variant: 'destructive',
      })
      return
    }
    updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
    logAccess(`Moveu Lead ID ${id} para ${stage} na Nutrição`)
  }

  const handleReactivate = (
    id: string,
    stage: 'Negociação' | 'Qualificação' | 'Primeiro contato',
  ) => {
    if (!canMove) {
      toast({ title: 'Acesso Negado', variant: 'destructive' })
      return
    }
    updateState({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, pipeline: 'Prospection', stage, score: 'Hot' } : l,
      ),
    })
    logAccess(`Reativou Lead ID ${id} para ${stage}`)
    toast({ title: `Automação Inbound`, description: `Movido para "${stage}" na Prospecção.` })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-slate-50/80 rounded-xl border border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-600" /> Pipeline de Nutrição
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Respostas Inbound reativam o prospect automaticamente para a Prospecção.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              nutritionLeads[0] && handleReactivate(nutritionLeads[0].id, 'Primeiro contato')
            }
          >
            <Reply className="w-4 h-4 mr-2" /> Simular Resposta
          </Button>
          <Button
            variant="outline"
            className="border-green-600 text-green-700"
            onClick={() =>
              nutritionLeads[0] && handleReactivate(nutritionLeads[0].id, 'Negociação')
            }
          >
            <DollarSign className="w-4 h-4 mr-2" /> Pedido de Preço
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-4">
        <KanbanBoard
          columns={COLUMNS}
          leads={nutritionLeads}
          companies={state.companies}
          onMove={handleMove}
          onReactivate={handleReactivate}
        />
      </div>
    </div>
  )
}
