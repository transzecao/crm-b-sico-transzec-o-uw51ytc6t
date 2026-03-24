import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

const COLUMNS = ['Nutrição – Aquecimento', 'Conteúdo de Valor', 'Mercado', 'Segmento']

export default function Pipeline2() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const nutritionLeads = state.leads.filter((l) => l.pipeline === 'Nutrition')

  const handleMove = (id: string, stage: string) => {
    updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
    toast({ title: `Movido para ${stage}` })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] relative overflow-hidden bg-purple-50/20 rounded-lg border border-purple-100 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-100/60 to-slate-100/90 z-0" />

      <div className="relative z-10 p-6 pb-2 border-b border-purple-200/50 bg-white/40 backdrop-blur-sm">
        <h1 className="text-3xl font-bold tracking-tight text-purple-950">Pipeline de Nutrição</h1>
        <p className="text-purple-800/70 mt-1">
          Reaquecimento de leads parados ou perdidos por timing.
        </p>
      </div>

      <div className="relative z-10 flex-1 p-6 overflow-hidden">
        <KanbanBoard
          columns={COLUMNS}
          leads={nutritionLeads}
          companies={state.companies}
          onMove={handleMove}
        />
      </div>
    </div>
  )
}
