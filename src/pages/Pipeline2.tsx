import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { Sprout } from 'lucide-react'

const COLUMNS = ['Nutrição – Aquecimento', 'Conteúdo de Valor', 'Mercado', 'Segmento']

export default function Pipeline2() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const nutritionLeads = state.leads.filter((l) => l.pipeline === 'Nutrition')

  const handleMove = (id: string, stage: string) => {
    updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
    toast({ title: `Movido para ${stage}` })
  }

  const handleReactivate = (id: string, stage: 'Negociação' | 'Qualificação') => {
    updateState({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, pipeline: 'Prospection', stage, score: 'Hot' } : l,
      ),
    })
    toast({
      title: `Lead reativado para ${stage} em Prospecção!`,
      description: 'Score atualizado para Hot.',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden bg-amber-50/30 rounded-xl border border-amber-200/50 shadow-sm backdrop-blur-sm">
      <div className="relative z-10 p-5 pb-3 border-b border-amber-200/60 bg-white/80 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-amber-950 flex items-center gap-2">
          <div className="bg-amber-100/80 p-1.5 rounded-lg border border-amber-200/60">
            <Sprout className="w-5 h-5 text-amber-600" />
          </div>
          Pipeline de Nutrição
        </h1>
        <p className="text-amber-700/80 font-medium mt-1 text-sm">
          Reaquecimento de leads parados, sem resposta ou perdidos por timing. Utilize os botões
          para reativar para prospecção.
        </p>
      </div>

      <div className="relative z-10 flex-1 p-4 overflow-hidden">
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
