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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden bg-purple-50/20">
      {/* Sub Header (Toolbar) */}
      <div className="flex flex-col border-b border-purple-100 bg-background z-10 shadow-sm relative">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium text-purple-950 flex items-center gap-2 mr-2">
              Negócios <Pin className="w-4 h-4 text-purple-400 rotate-45" />
            </h1>

            <div className="flex items-center bg-purple-600 hover:bg-purple-700 text-white rounded shadow-sm overflow-hidden transition-colors">
              <button className="px-4 py-1.5 text-sm font-semibold border-r border-purple-700/50">
                Criar
              </button>
              <button className="px-2 py-1.5">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-purple-200 mx-1" />

            <button className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-200 transition-colors shadow-sm">
              <Filter className="w-3 h-3 text-purple-600" />
              Pipeline Prospecção
              <span className="bg-destructive text-white rounded-full text-[10px] font-bold w-4 h-4 inline-flex items-center justify-center leading-none">
                4
              </span>
              <ChevronDown className="w-3 h-3 text-purple-600" />
            </button>

            <div className="relative group ml-2">
              <div className="flex items-center bg-background border border-purple-200 rounded-full overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-purple-500/50">
                <span className="px-3 text-xs text-purple-700 whitespace-nowrap bg-purple-50/50 border-r border-purple-200 py-1.5">
                  Negócios em andamento &times;
                </span>
                <input
                  type="text"
                  placeholder="+ pesquisa"
                  className="bg-transparent border-none outline-none text-sm px-3 py-1.5 w-40 focus:w-64 transition-all placeholder:text-muted-foreground/60 text-purple-900"
                />
                <button className="px-3 text-purple-400 hover:text-purple-700">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 text-purple-500 hover:bg-purple-50 hover:text-purple-700 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-sm text-purple-600/80">
          <div className="flex items-center gap-1 bg-purple-50/50 p-1 rounded-md border border-purple-100">
            <button className="px-3 py-1 bg-white shadow-sm rounded text-purple-900 font-medium flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
            <button className="px-3 py-1 hover:text-purple-900 hover:bg-white/50 rounded flex items-center gap-2 transition-colors">
              <List className="w-4 h-4" /> Lista
            </button>
            <button className="px-3 py-1 hover:text-purple-900 hover:bg-white/50 rounded flex items-center gap-2 transition-colors">
              <CheckSquare className="w-4 h-4" /> Atividades
            </button>
            <button className="px-3 py-1 hover:text-purple-900 hover:bg-white/50 rounded flex items-center gap-2 transition-colors">
              <CalendarIcon className="w-4 h-4" /> Calendário
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-800 font-medium">
                  0
                </span>
                Recebidos
              </span>
              <span className="flex items-center gap-1.5 font-medium text-purple-900">
                <span className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
                  4
                </span>
                Planejado
              </span>
              <button className="flex items-center gap-1 hover:text-purple-900 ml-2">
                Mais <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="h-4 w-px bg-purple-200"></div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 rounded text-purple-800 transition-colors">
                <Settings className="w-3 h-3" /> Regras de automação
              </button>
              <button className="flex items-center gap-1.5 hover:bg-purple-50 px-3 py-1 rounded border border-transparent hover:border-purple-200 text-purple-800 transition-colors">
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
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/70 to-slate-200/90 z-0" />

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
