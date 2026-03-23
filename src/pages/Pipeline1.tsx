import { useState } from 'react'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { LossReasonModal } from '@/components/LossReasonModal'
import { useToast } from '@/hooks/use-toast'

const COLUMNS = [
  'Primeiro contato',
  '1º contato sem resposta',
  'Qualificação',
  '2º contato sem resposta',
  '3º contato sem resposta',
  'Negociação',
  'Ganho',
  'Perda',
]

export default function Pipeline1() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const [lossModalOpen, setLossModalOpen] = useState(false)
  const [pendingMove, setPendingMove] = useState<{ id: string; stage: string } | null>(null)

  const prospectionLeads = state.leads.filter((l) => l.pipeline === 'Prospection')

  const handleMove = (id: string, stage: string) => {
    if (stage === 'Perda') {
      setPendingMove({ id, stage })
      setLossModalOpen(true)
      return
    }

    // Simulate Logic: 3º sem resposta -> Move to Nutrição after a delay (simulated immediate here for testing UX)
    if (stage === '3º contato sem resposta') {
      toast({
        title: 'Atenção',
        description: 'Lead movido para Nutrição (Regra de 3º sem resposta).',
      })
      updateState({
        leads: state.leads.map((l) =>
          l.id === id ? { ...l, pipeline: 'Nutrition', stage: 'Nutrição – Aquecimento' } : l,
        ),
      })
      return
    }

    updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
    toast({ title: `Movido para ${stage}` })
  }

  const confirmLoss = (reason: string, details?: string) => {
    if (pendingMove) {
      updateState({
        leads: state.leads.map((l) =>
          l.id === pendingMove.id ? { ...l, stage: 'Perda', lossReason: reason } : l,
        ),
      })
      toast({ title: 'Perda registrada', description: `Motivo: ${reason}`, variant: 'destructive' })
    }
    setLossModalOpen(false)
    setPendingMove(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Prospecção</h1>
        <p className="text-muted-foreground">Gestão de novos negócios e fechamentos.</p>
      </div>

      <KanbanBoard columns={COLUMNS} leads={prospectionLeads} onMove={handleMove} />

      <LossReasonModal
        open={lossModalOpen}
        onConfirm={confirmLoss}
        onCancel={() => {
          setLossModalOpen(false)
          setPendingMove(null)
        }}
      />
    </div>
  )
}
