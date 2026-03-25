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

    if (stage === '3º contato sem resposta') {
      toast({
        title: 'Atenção Automática',
        description: 'Lead será movido para Nutrição em 1 dia útil (Regra de 3º sem resposta).',
      })
      updateState({
        leads: state.leads.map((l) => (l.id === id ? { ...l, stage, score: 'Cold' } : l)),
      })
      return
    }

    updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
  }

  const confirmLoss = (reason: string, details?: string) => {
    if (pendingMove) {
      updateState({
        leads: state.leads.map((l) =>
          l.id === pendingMove.id ? { ...l, stage: 'Perda', score: 'Cold' } : l,
        ),
      })
      toast({ title: 'Perda registrada', description: `Motivo: ${reason}`, variant: 'destructive' })
    }
    setLossModalOpen(false)
    setPendingMove(null)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden bg-violet-50/40 rounded-xl border border-violet-200/50 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col border-b border-violet-200/60 bg-white/80 backdrop-blur-md z-10 shadow-sm relative">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-violet-950 flex items-center gap-2 mr-2">
              Negócios <Pin className="w-5 h-5 text-violet-500 rotate-45" />
            </h1>

            <div className="flex items-center bg-violet-600 hover:bg-violet-700 text-white rounded shadow-sm overflow-hidden transition-colors">
              <button className="px-4 py-1.5 text-sm font-semibold border-r border-violet-700/50">
                Criar
              </button>
              <button className="px-2 py-1.5">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-violet-200/80 mx-1" />

            <button className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-800 px-3 py-1.5 rounded-full text-sm font-medium border border-violet-200/80 transition-colors shadow-sm">
              <Filter className="w-3 h-3 text-violet-600" />
              Pipeline Prospecção
              <span className="bg-rose-500 text-white rounded-full text-[10px] font-bold w-4 h-4 inline-flex items-center justify-center leading-none shadow-sm">
                {prospectionLeads.length}
              </span>
              <ChevronDown className="w-3 h-3 text-violet-600" />
            </button>

            <div className="relative group ml-2">
              <div className="flex items-center bg-white border border-violet-200/80 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-300">
                <span className="px-3 text-xs text-violet-700 font-medium whitespace-nowrap bg-violet-50/80 border-r border-violet-200/60 py-1.5">
                  Negócios em andamento &times;
                </span>
                <input
                  type="text"
                  placeholder="+ pesquisa"
                  className="bg-transparent border-none outline-none text-sm px-3 py-1.5 w-40 focus:w-64 transition-all placeholder:text-violet-400 text-violet-900 font-medium"
                />
                <button className="px-3 text-violet-400 hover:text-violet-700 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 text-violet-500 hover:bg-violet-100 hover:text-violet-800 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-sm text-violet-700/80 font-medium">
          <div className="flex items-center gap-1 bg-violet-50/80 p-1 rounded-md border border-violet-100/60">
            <button className="px-3 py-1 bg-white shadow-sm rounded text-violet-900 font-semibold flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
            <button className="px-3 py-1 hover:text-violet-900 hover:bg-white/60 rounded flex items-center gap-2 transition-colors">
              <List className="w-4 h-4" /> Lista
            </button>
            <button className="px-3 py-1 hover:text-violet-900 hover:bg-white/60 rounded flex items-center gap-2 transition-colors">
              <CheckSquare className="w-4 h-4" /> Atividades
            </button>
            <button className="px-3 py-1 hover:text-violet-900 hover:bg-white/60 rounded flex items-center gap-2 transition-colors">
              <CalendarIcon className="w-4 h-4" /> Calendário
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-violet-100/80 border border-violet-200 flex items-center justify-center text-[10px] text-violet-800 font-bold">
                  0
                </span>
                Recebidos
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-violet-900">
                <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  {prospectionLeads.length}
                </span>
                Planejado
              </span>
              <button className="flex items-center gap-1 hover:text-violet-900 ml-2 bg-violet-50/50 px-2 py-0.5 rounded">
                Mais <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="h-4 w-px bg-violet-200/80"></div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-violet-50/80 hover:bg-violet-100 border border-violet-200/80 px-3 py-1 rounded-md text-violet-800 transition-colors">
                <Settings className="w-3 h-3" /> Regras de automação
              </button>
            </div>
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
