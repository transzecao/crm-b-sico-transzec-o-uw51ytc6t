import { useMemo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { Sprout, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COLUMNS = [
  'Nutrição – Aquecimento',
  'Conteúdo de valor',
  'Conteúdo do mercado',
  'Conteúdo do segmento',
]

export default function Pipeline2() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()
  const location = useLocation()
  const hasLogged = useRef(false)

  const nutritionLeads = useMemo(
    () => state.leads.filter((l) => l.pipeline === 'Nutrition'),
    [state.leads],
  )

  useEffect(() => {
    // Route-based tracking to avoid stale states
    if (location.pathname.includes('/pipeline/2')) {
      if (!hasLogged.current) {
        hasLogged.current = true
        console.debug('Pipeline Nutrição acessado. Preparando dados de reaquecimento.')
      }
    }
  }, [location.pathname])

  const handleMove = (id: string, stage: string) => {
    const prevState = [...state.leads]
    try {
      if (!COLUMNS.includes(stage)) {
        throw new Error(`Etapa de nutrição inválida: ${stage}`)
      }

      const lead = state.leads.find((l) => l.id === id)
      if (!lead) throw new Error('Negócio não encontrado na base de dados.')

      updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
      toast({ title: `Movido para ${stage}` })
    } catch (error) {
      updateState({ leads: prevState })
      toast({
        variant: 'destructive',
        title: 'Erro de Movimentação',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível mover o negócio. Estado revertido.',
      })
    }
  }

  const handleReactivate = (id: string, stage: 'Negociação' | 'Qualificação') => {
    const prevState = [...state.leads]
    try {
      if (!['Negociação', 'Qualificação'].includes(stage)) {
        throw new Error(`Etapa de prospecção de destino inválida: ${stage}`)
      }

      const lead = state.leads.find((l) => l.id === id)
      if (!lead) throw new Error('Negócio não encontrado para reativação.')

      updateState({
        leads: state.leads.map((l) =>
          l.id === id ? { ...l, pipeline: 'Prospection', stage, score: 'Hot' } : l,
        ),
      })
      toast({
        title: `Automação: Lead reativado para ${stage}!`,
        description: 'Atividade Inbound detectada. Score atualizado para Quente na Prospecção.',
      })
    } catch (error) {
      updateState({ leads: prevState })
      toast({
        variant: 'destructive',
        title: 'Erro do Sistema',
        description:
          error instanceof Error ? error.message : 'Falha grave ao tentar reativar o negócio.',
      })
    }
  }

  const handleDistribute = () => {
    toast({
      title: 'Distribuição em Lote',
      description:
        'Disparo de conteúdo programado para leads ativos nas colunas de mercado/segmento.',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden bg-amber-50/30 rounded-xl border border-amber-200/50 shadow-sm backdrop-blur-sm">
      <div className="relative z-10 p-5 pb-3 border-b border-amber-200/60 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-950 flex items-center gap-2">
              <div
                className="bg-amber-100/80 p-1.5 rounded-lg border border-amber-200/60"
                aria-hidden="true"
              >
                <Sprout className="w-5 h-5 text-amber-600" />
              </div>
              Pipeline de Nutrição
            </h1>
            <p
              className="text-amber-700/80 font-medium mt-1 text-sm"
              aria-describedby="Descrição do pipeline de nutrição"
            >
              Reaquecimento de leads parados, sem resposta ou perdidos por timing. Utilize os botões
              para reativar para prospecção.
            </p>
          </div>
          {['Master', 'Marketing', 'Supervisor'].includes(state.role) && (
            <Button
              onClick={handleDistribute}
              aria-label="Distribuir conteúdo em lote"
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
            >
              <Mail className="w-4 h-4 mr-2" aria-hidden="true" /> Distribuir Conteúdo (Lote)
            </Button>
          )}
        </div>
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
