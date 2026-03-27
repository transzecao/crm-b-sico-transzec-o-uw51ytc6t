import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { LossReasonModal } from '@/components/LossReasonModal'
import { QuickLeadModal } from '@/components/QuickLeadModal'
import { useToast } from '@/hooks/use-toast'
import { Pin, CalendarClock, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

const VALID_STAGES = [...COLUMNS, 'Perda']

export default function Pipeline1() {
  const { state, updateState, logAccess } = useCrmStore()
  const { toast } = useToast()
  const location = useLocation()
  const hasAlerted = useRef(false)

  const [lossModalOpen, setLossModalOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAddStage, setQuickAddStage] = useState('')
  const [pendingMove, setPendingMove] = useState<{ id: string; stage: string } | null>(null)

  const prospectionLeads = useMemo(
    () => state.leads.filter((l) => l.pipeline === 'Prospection'),
    [state.leads],
  )

  const canMove = ['Acesso Master', 'Supervisor Comercial', 'Funcionário Comercial'].includes(
    state.role,
  )

  useEffect(() => {
    if (location.pathname.includes('/pipeline/1')) {
      if (state.leads.length === 0 && !hasAlerted.current) {
        hasAlerted.current = true
        toast({
          title: 'Funil Vazio',
          description: 'Nenhum negócio de prospecção ativo no momento.',
        })
      }
    }
  }, [location.pathname, state.leads.length, toast])

  const handleMove = (id: string, stage: string) => {
    if (!canMove) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para mover leads na Prospecção.',
        variant: 'destructive',
      })
      return
    }

    const previousState = [...state.leads]
    try {
      if (!VALID_STAGES.includes(stage)) {
        throw new Error(`Etapa inválida: ${stage}`)
      }

      if (stage === 'Perda') {
        setPendingMove({ id, stage })
        setLossModalOpen(true)
        return
      }

      if (stage === 'Ganho') {
        const lead = state.leads.find((l) => l.id === id)
        const company = state.companies.find((c) => c.id === lead?.companyId)

        updateState({
          leads: state.leads.map((l) => (l.id === id ? { ...l, stage, score: 'Hot' } : l)),
        })
        logAccess(`Ganhou negócio: Lead ID ${id}`)
        toast({
          title: 'Negócio Ganho!',
          description: 'Acionando webhook de integração para ERP/Marketing...',
        })

        // Webhook Simulation Call
        fetch('https://hook.us1.make.com/mock-webhook-transzecao', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead_won',
            leadId: id,
            title: lead?.title,
            value: lead?.value,
            owner: lead?.owner,
            companyName: company?.nomeFantasia,
          }),
        }).catch(() => console.log('Webhook dispatched in background'))

        return
      }

      if (stage === '1º contato sem resposta') {
        toast({
          title: 'Tentativa Registrada',
          description: 'O histórico de tentativas foi atualizado.',
        })
      }

      if (stage === '3º contato sem resposta') {
        toast({
          title: 'Automação Ativada',
          description: '3º contato sem resposta registrado. Etapas anteriores concluídas.',
        })
      }

      updateState({
        leads: state.leads.map((l) =>
          l.id === id
            ? { ...l, stage, pipeline: 'Prospection', isStalled: false, stalledDays: 0 }
            : l,
        ),
      })
      logAccess(`Moveu Lead ID ${id} para ${stage} na Prospecção`)
    } catch (error) {
      updateState({ leads: previousState })
      toast({ variant: 'destructive', title: 'Erro', description: 'Revertido.' })
    }
  }

  const handleSendToMarketing = (id: string) => {
    if (!canMove) {
      toast({ title: 'Acesso Negado', variant: 'destructive' })
      return
    }
    updateState({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, pipeline: 'Nutrition', stage: 'Nutrição – Aquecimento' } : l,
      ),
    })
    logAccess(`Enviou Lead ID ${id} para Marketing (Pipeline 2)`)
    toast({
      title: 'Lead Qualificado!',
      description: 'Enviado para o fluxo de Nutrição do Marketing.',
    })
  }

  const confirmLoss = (reason: string, details?: string) => {
    if (!pendingMove) return
    updateState({
      leads: state.leads.map((l) =>
        l.id === pendingMove.id ? { ...l, stage: 'Perda', score: 'Cold' } : l,
      ),
    })
    logAccess(`Registrou Perda: Lead ID ${pendingMove.id} - ${reason}`)
    toast({ title: 'Perda registrada', description: `Motivo: ${reason}`, variant: 'destructive' })
    setLossModalOpen(false)
    setPendingMove(null)
  }

  const simulateInactivity = () => {
    if (!canMove) {
      toast({ title: 'Acesso Negado', variant: 'destructive' })
      return
    }
    const updatedLeads = state.leads.map((lead) => {
      if (lead.pipeline === 'Prospection' && lead.stage !== 'Ganho' && lead.stage !== 'Perda') {
        return { ...lead, pipeline: 'Nutrition' as const, stage: 'Nutrição – Aquecimento' }
      }
      return lead
    })
    updateState({ leads: updatedLeads })
    logAccess('Rodou Automação de Inatividade (Prospecção)')
    toast({
      title: 'Automação de Inatividade',
      description: 'Leads sem interação por 1 dia foram transferidos para Nutrição.',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-slate-50/80 rounded-xl border border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Pipeline de Prospecção <Pin className="w-5 h-5 text-primary rotate-45" />
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={simulateInactivity}
            variant="outline"
            className="text-secondary border-secondary/30 hover:bg-secondary/10 font-bold"
          >
            <CalendarClock className="w-4 h-4 mr-2" /> Simular Inatividade (1 Dia)
          </Button>
          <div className="px-3 py-1.5 bg-slate-100 rounded text-slate-700 font-bold flex items-center gap-2 text-sm border border-slate-200">
            <LayoutGrid className="w-4 h-4" /> Kanban
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <KanbanBoard
          columns={COLUMNS}
          leads={prospectionLeads}
          companies={state.companies}
          onMove={handleMove}
          onSendToMarketing={handleSendToMarketing}
          onQuickAdd={(stage) => {
            if (!canMove) {
              toast({ title: 'Acesso Negado', variant: 'destructive' })
              return
            }
            setQuickAddStage(stage)
            setQuickAddOpen(true)
          }}
        />
      </div>

      <LossReasonModal
        open={lossModalOpen}
        onConfirm={confirmLoss}
        onCancel={() => setLossModalOpen(false)}
      />
      <QuickLeadModal
        open={quickAddOpen}
        stage={quickAddStage}
        onConfirm={(t, v) => {
          updateState({
            leads: [
              ...state.leads,
              {
                id: Math.random().toString(),
                companyId: '1',
                title: t,
                value: v,
                pipeline: 'Prospection',
                stage: quickAddStage,
                owner: state.currentUser.name,
                updatedAt: new Date().toLocaleString(),
                createdAt: new Date().toLocaleDateString(),
                updatedBy: state.currentUser.name,
              },
            ],
          })
          logAccess(`Criou Negócio Rápido: ${t}`)
          setQuickAddOpen(false)
        }}
        onCancel={() => setQuickAddOpen(false)}
      />
    </div>
  )
}
