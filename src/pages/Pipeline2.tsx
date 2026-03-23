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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Nutrição</h1>
        <p className="text-muted-foreground">
          Reaquecimento de leads parados ou perdidos por timing.
        </p>
      </div>

      <KanbanBoard columns={COLUMNS} leads={nutritionLeads} onMove={handleMove} />
    </div>
  )
}
