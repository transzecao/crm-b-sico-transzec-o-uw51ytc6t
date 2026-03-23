import { useState } from 'react'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { LossReasonModal } from '@/components/LossReasonModal'
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
} from 'lucide-react'

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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden bg-slate-50">
      {/* Sub Header (Toolbar) */}
      <div className="flex flex-col border-b bg-background z-10 shadow-sm relative">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium text-slate-700 flex items-center gap-2 mr-2">
              Negócios <Pin className="w-4 h-4 text-muted-foreground rotate-45" />
            </h1>

            <div className="flex items-center bg-green-500 hover:bg-green-600 text-white rounded shadow-sm overflow-hidden transition-colors">
              <button className="px-4 py-1.5 text-sm font-semibold border-r border-green-600/30">
                Criar
              </button>
              <button className="px-2 py-1.5">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-border mx-1" />

            <button className="flex items-center gap-2 bg-muted/40 hover:bg-muted text-slate-600 px-3 py-1.5 rounded-full text-sm font-medium border border-border/60 transition-colors shadow-sm">
              <Filter className="w-3 h-3 text-muted-foreground" />
              Pipeline Prospecção
              <span className="bg-destructive text-white rounded-full text-[10px] font-bold w-4 h-4 inline-flex items-center justify-center leading-none">
                4
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            <div className="relative group ml-2">
              <div className="flex items-center bg-background border border-input rounded-full overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-ring">
                <span className="px-3 text-xs text-muted-foreground whitespace-nowrap bg-muted/30 border-r border-input py-1.5">
                  Negócios em andamento &times;
                </span>
                <input
                  type="text"
                  placeholder="+ pesquisa"
                  className="bg-transparent border-none outline-none text-sm px-3 py-1.5 w-40 focus:w-64 transition-all placeholder:text-muted-foreground/60"
                />
                <button className="px-3 text-muted-foreground hover:text-foreground">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-md border border-border/50">
            <button className="px-3 py-1 bg-background shadow-sm rounded text-foreground font-medium flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
            <button className="px-3 py-1 hover:text-foreground hover:bg-background/50 rounded flex items-center gap-2 transition-colors">
              <List className="w-4 h-4" /> Lista
            </button>
            <button className="px-3 py-1 hover:text-foreground hover:bg-background/50 rounded flex items-center gap-2 transition-colors">
              <CheckSquare className="w-4 h-4" /> Atividades
            </button>
            <button className="px-3 py-1 hover:text-foreground hover:bg-background/50 rounded flex items-center gap-2 transition-colors">
              <CalendarIcon className="w-4 h-4" /> Calendário
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground font-medium">
                  0
                </span>
                Recebidos
              </span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
                  4
                </span>
                Planejado
              </span>
              <button className="flex items-center gap-1 hover:text-foreground ml-2">
                Mais <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-muted/40 hover:bg-muted border border-border/50 px-3 py-1 rounded text-foreground transition-colors">
                <Settings className="w-3 h-3" /> Regras de automação
              </button>
              <button className="flex items-center gap-1.5 hover:bg-muted px-3 py-1 rounded border border-transparent hover:border-border/50 transition-colors">
                Criar script <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 mix-blend-multiply"
          style={{
            backgroundImage: 'url("https://img.usecurling.com/p/1920/1080?q=sunset%20clouds")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-slate-200/90 z-0" />

        <div className="relative z-10 h-full p-4 overflow-y-hidden">
          <KanbanBoard
            columns={COLUMNS}
            leads={prospectionLeads}
            companies={state.companies}
            onMove={handleMove}
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
    </div>
  )
}
