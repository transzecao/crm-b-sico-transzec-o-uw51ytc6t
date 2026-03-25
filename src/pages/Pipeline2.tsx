import { useMemo } from 'react'
import { KanbanBoard } from '@/components/KanbanBoard'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { Sprout, Mail, Filter, Reply, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const COLUMNS = [
  'Nutrição – Aquecimento',
  'Conteúdo de valor',
  'Conteúdo do mercado',
  'Conteúdo do segmento',
]

export default function Pipeline2() {
  const { state, updateState } = useCrmStore()
  const { toast } = useToast()

  const nutritionLeads = useMemo(
    () => state.leads.filter((l) => l.pipeline === 'Nutrition'),
    [state.leads],
  )

  const handleMove = (id: string, stage: string) => {
    const prevState = [...state.leads]
    try {
      if (!COLUMNS.includes(stage)) {
        throw new Error(`Etapa de nutrição inválida: ${stage}`)
      }
      updateState({ leads: state.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })
    } catch (error) {
      updateState({ leads: prevState })
      toast({
        variant: 'destructive',
        title: 'Erro de Movimentação',
        description: 'Não foi possível mover o negócio. Estado revertido.',
      })
    }
  }

  const handleReactivate = (
    id: string,
    stage: 'Negociação' | 'Qualificação' | 'Primeiro contato',
  ) => {
    const prevState = [...state.leads]
    try {
      const lead = state.leads.find((l) => l.id === id)
      if (!lead) throw new Error('Negócio não encontrado para reativação.')

      updateState({
        leads: state.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                pipeline: 'Prospection',
                stage,
                score: 'Hot',
                isStalled: false,
                stalledDays: 0,
              }
            : l,
        ),
      })
      toast({
        title: `Automação Inbound: Lead reativado!`,
        description: `O negócio foi movido para a etapa de "${stage}" na Prospecção com Score Quente.`,
      })
    } catch (error) {
      updateState({ leads: prevState })
      toast({
        variant: 'destructive',
        title: 'Erro do Sistema',
        description: 'Falha grave ao tentar reativar o negócio.',
      })
    }
  }

  const handleDistribute = () => {
    const targetLeads = nutritionLeads.filter(
      (l) => l.stage === 'Conteúdo do mercado' || l.stage === 'Conteúdo do segmento',
    )
    if (targetLeads.length === 0) {
      toast({
        title: 'Nenhum lead elegível',
        description: 'Não há leads nas etapas de "Mercado" ou "Segmento".',
        variant: 'destructive',
      })
      return
    }
    toast({
      title: 'Distribuição em Lote Executada',
      description: `E-mails de conteúdo agendados e disparados para ${targetLeads.length} leads.`,
    })
  }

  const simulateInbound = (type: 'reply' | 'price') => {
    if (nutritionLeads.length === 0) {
      toast({ title: 'Adicione um negócio em nutrição para testar.' })
      return
    }
    const target = nutritionLeads[0]

    if (type === 'reply') {
      handleReactivate(target.id, 'Primeiro contato')
      toast({
        title: 'Simulação: Cliente Respondeu E-mail!',
        description: `Lead "${target.title}" voltou para Primeiro Contato.`,
      })
    } else {
      handleReactivate(target.id, 'Negociação')
      toast({
        title: 'Simulação: Pedido de Preço!',
        description: `Lead "${target.title}" saltou direto para Negociação.`,
      })
    }
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
              Reaquecimento inteligente de leads parados. Respostas Inbound reativam o prospect
              automaticamente.
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Filter className="w-4 h-4 mr-2" /> Testar Inbound
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Disparar Gatilho Automático</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => simulateInbound('reply')}
                  className="cursor-pointer"
                >
                  <Reply className="w-4 h-4 mr-2 text-blue-500" />
                  Resposta Padrão (1º Contato)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => simulateInbound('price')}
                  className="cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                  Pedido de Cotação (Negociação)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {['Master', 'Supervisor Geral', 'Supervisor Comercial', 'Marketing'].includes(
              state.role,
            ) && (
              <Button
                onClick={handleDistribute}
                aria-label="Distribuir conteúdo em lote"
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" /> Distribuir Conteúdo
              </Button>
            )}
          </div>
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
