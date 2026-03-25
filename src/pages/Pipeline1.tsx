import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore, { Lead } from '@/stores/useCrmStore'
import { LossReasonModal } from '@/components/LossReasonModal'
import { QuickLeadModal } from '@/components/QuickLeadModal'
import { useToast } from '@/hooks/use-toast'
import {
  Pin,
  ChevronDown,
  Filter,
  Settings,
  Search,
  LayoutGrid,
  List,
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()
  const location = useLocation()
  const hasAlerted = useRef(false)

  const [lossModalOpen, setLossModalOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [quickAddStage, setQuickAddStage] = useState('')
  const [pendingMove, setPendingMove] = useState<{ id: string; stage: string } | null>(null)

  const [rulesForm, setRulesForm] = useState(state.pipelineRules)

  const prospectionLeads = useMemo(
    () => state.leads.filter((l) => l.pipeline === 'Prospection'),
    [state.leads],
  )

  useEffect(() => {
    if (location.pathname.includes('/pipeline/1')) {
      if (state.leads.length === 0 && !hasAlerted.current) {
        hasAlerted.current = true
        toast({
          title: 'Nenhum negócio encontrado',
          description: 'O funil de prospecção está vazio no momento.',
          variant: 'default',
        })
      }
    }
  }, [location.pathname, state.leads.length, toast])

  const handleMove = (id: string, stage: string) => {
    const previousState = [...state.leads]
    try {
      if (!VALID_STAGES.includes(stage)) {
        throw new Error(`Etapa de destino inválida: ${stage}`)
      }

      const lead = state.leads.find((l) => l.id === id)
      if (!lead) {
        throw new Error('Negócio não encontrado na base de dados.')
      }

      if (stage === 'Perda') {
        setPendingMove({ id, stage })
        setLossModalOpen(true)
        return
      }

      if (stage === 'Ganho') {
        updateState({
          leads: state.leads.map((l) => (l.id === id ? { ...l, stage, score: 'Hot' } : l)),
        })
        toast({
          title: 'Parabéns!',
          description: 'Negócio marcado como Ganho. Aceitou cotação/teste.',
        })
        return
      }

      // Automation Rules
      let finalStage = stage
      let newPipeline = lead.pipeline

      if (stage === '3º contato sem resposta') {
        finalStage = 'Nutrição – Aquecimento'
        newPipeline = 'Nutrition'
        toast({
          title: 'Automação Disparada: Nutrição',
          description: '3º contato sem resposta atingido. Movido para Nutrição (inativo).',
        })
      }

      updateState({
        leads: state.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                stage: finalStage,
                pipeline: newPipeline as any,
                isStalled: false,
                stalledDays: 0,
              }
            : l,
        ),
      })
    } catch (error) {
      try {
        updateState({ leads: previousState }) // Rollback
      } catch (rollbackError) {
        console.error('Falha de integridade no rollback:', rollbackError)
      }
      toast({
        variant: 'destructive',
        title: 'Erro de Movimentação',
        description:
          error instanceof Error ? error.message : 'Falha ao processar movimento. Card revertido.',
      })
    }
  }

  const confirmLoss = (reason: string, details?: string) => {
    if (!pendingMove) return
    const previousState = [...state.leads]
    try {
      updateState({
        leads: state.leads.map((l) =>
          l.id === pendingMove.id ? { ...l, stage: 'Perda', score: 'Cold' } : l,
        ),
      })
      toast({
        title: 'Perda registrada',
        description: `Motivo: ${reason}`,
        variant: 'destructive',
      })
    } catch (error) {
      try {
        updateState({ leads: previousState })
      } catch (rollbackError) {
        console.error('Rollback falhou', rollbackError)
      }
      toast({
        variant: 'destructive',
        title: 'Erro de Sistema',
        description: 'Não foi possível registrar a perda.',
      })
    } finally {
      setLossModalOpen(false)
      setPendingMove(null)
    }
  }

  const handleQuickAdd = (stage: string) => {
    setQuickAddStage(stage)
    setQuickAddOpen(true)
  }

  const confirmQuickAdd = (title: string, value: number) => {
    const previousState = [...state.leads]
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: state.companies[0]?.id || '1',
      title,
      value,
      pipeline: 'Prospection',
      stage: quickAddStage,
      owner: state.currentUser.name,
      ownerAvatar: state.currentUser.avatar,
      updatedBy: state.currentUser.name,
      updatedAt: new Date().toLocaleString('pt-BR'),
      createdAt: new Date().toLocaleDateString('pt-BR'),
      score: 'Warm',
    }

    try {
      updateState({ leads: [...state.leads, newLead] })
      toast({ title: 'Negócio adicionado com sucesso!' })
    } catch (err) {
      updateState({ leads: previousState })
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar',
        description: 'Não foi possível salvar o negócio devido a erro de integridade.',
      })
    } finally {
      setQuickAddOpen(false)
    }
  }

  const simulateTimeSkip = () => {
    const updatedLeads = state.leads.map((lead) => {
      if (lead.pipeline !== 'Prospection') return lead
      let newDays = (lead.stalledDays || 0) + 7
      let isStalled =
        newDays >= state.pipelineRules.negotiationMaxDays && lead.stage === 'Negociação'

      let newStage = lead.stage
      let newPipe = lead.pipeline

      if (isStalled) {
        newStage = 'Nutrição – Aquecimento'
        newPipe = 'Nutrition'
        isStalled = false
        newDays = 0
        toast({
          title: 'Automação SLA Expirado',
          description: `O negócio ${lead.title} excedeu ${state.pipelineRules.negotiationMaxDays} dias e foi movido para Nutrição.`,
        })
      }

      return { ...lead, stalledDays: newDays, isStalled, stage: newStage, pipeline: newPipe }
    })

    updateState({ leads: updatedLeads })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden bg-violet-50/40 rounded-xl border border-violet-200/50 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col border-b border-violet-200/60 bg-white/80 backdrop-blur-md z-10 shadow-sm relative">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-violet-950 flex items-center gap-2 mr-2">
              Negócios <Pin className="w-5 h-5 text-violet-500 rotate-45" aria-hidden="true" />
            </h1>

            <div className="flex items-center bg-violet-600 hover:bg-violet-700 text-white rounded shadow-sm overflow-hidden transition-colors">
              <button
                aria-label="Criar novo negócio"
                className="px-4 py-1.5 text-sm font-semibold border-r border-violet-700/50"
              >
                Criar
              </button>
              <button aria-label="Opções de criação" className="px-2 py-1.5">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-violet-200/80 mx-1" />

            <button
              aria-label="Filtro de Pipeline"
              className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-800 px-3 py-1.5 rounded-full text-sm font-medium border border-violet-200/80 transition-colors shadow-sm"
            >
              <Filter className="w-3 h-3 text-violet-600" />
              Pipeline Prospecção
              <span className="bg-rose-500 text-white rounded-full text-[10px] font-bold w-4 h-4 inline-flex items-center justify-center leading-none shadow-sm">
                {prospectionLeads.length}
              </span>
              <ChevronDown className="w-3 h-3 text-violet-600" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={simulateTimeSkip}
              className="text-xs bg-white text-violet-700 border-violet-200 hover:bg-violet-50"
            >
              <Clock className="w-3 h-3 mr-1" /> Simular +7 Dias (Testar Regras)
            </Button>
            {state.role === 'Master' && (
              <button
                onClick={() => setSettingsOpen(true)}
                aria-label="Configurações do Pipeline"
                className="p-2 text-violet-500 hover:bg-violet-100 hover:text-violet-800 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-sm text-violet-700/80 font-medium">
          <div className="flex items-center gap-1 bg-violet-50/80 p-1 rounded-md border border-violet-100/60">
            <button
              aria-label="Visualização Kanban"
              className="px-3 py-1 bg-white shadow-sm rounded text-violet-900 font-semibold flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="relative z-10 h-full p-4 overflow-y-hidden">
          <KanbanBoard
            columns={COLUMNS}
            leads={prospectionLeads}
            companies={state.companies}
            onMove={handleMove}
            onQuickAdd={handleQuickAdd}
          />
        </div>
      </div>

      <LossReasonModal
        open={lossModalOpen}
        onConfirm={confirmLoss}
        onCancel={() => {
          setLossModalOpen(false)
          setPendingMove(null)
        }}
      />
      <QuickLeadModal
        open={quickAddOpen}
        stage={quickAddStage}
        onConfirm={confirmQuickAdd}
        onCancel={() => setQuickAddOpen(false)}
      />

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-violet-900">
              <Settings className="w-5 h-5" /> Regras de Automação
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>SLA Máximo na Etapa "Negociação" (Dias)</Label>
              <Input
                type="number"
                value={rulesForm.negotiationMaxDays}
                onChange={(e) =>
                  setRulesForm({ ...rulesForm, negotiationMaxDays: parseInt(e.target.value) || 21 })
                }
              />
              <p className="text-xs text-slate-500">
                Exceder este prazo move o negócio automaticamente para Nutrição.
              </p>
            </div>
            <div className="space-y-2">
              <Label>SLA "3º contato sem resposta" para Nutrição (Dias)</Label>
              <Input
                type="number"
                value={rulesForm.inactivityDaysToNutrition}
                onChange={(e) =>
                  setRulesForm({
                    ...rulesForm,
                    inactivityDaysToNutrition: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                updateState({ pipelineRules: rulesForm })
                setSettingsOpen(false)
                toast({ title: 'Regras salvas com sucesso!' })
              }}
            >
              Salvar Regras
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
