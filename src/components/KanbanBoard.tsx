import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Lead, Company } from '@/stores/useCrmStore'
import { Phone, Mail, MessageSquare, Plus, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const COLUMN_COLORS: Record<string, { bg: string; text: string }> = {
  'Primeiro contato': { bg: 'bg-violet-800/90', text: 'text-white' },
  '1º contato sem resposta': { bg: 'bg-violet-600/90', text: 'text-white' },
  Qualificação: { bg: 'bg-violet-500/90', text: 'text-white' },
  '2º contato sem resposta': { bg: 'bg-violet-400/90', text: 'text-violet-950' },
  '3º contato sem resposta': { bg: 'bg-violet-300/90', text: 'text-violet-950' },
  'Nutrição – Aquecimento': { bg: 'bg-amber-500/90', text: 'text-white' },
  'Conteúdo de valor': { bg: 'bg-amber-400/90', text: 'text-amber-950' },
  'Conteúdo do mercado': { bg: 'bg-amber-300/90', text: 'text-amber-950' },
  'Conteúdo do segmento': { bg: 'bg-amber-200/90', text: 'text-amber-950' },
  Negociação: { bg: 'bg-blue-500/90', text: 'text-white' },
  Ganho: { bg: 'bg-emerald-600/90', text: 'text-white' },
  Perda: { bg: 'bg-rose-600/90', text: 'text-white' },
}

const translateScore = (score?: string) => {
  if (score === 'Hot') return 'Quente'
  if (score === 'Warm') return 'Morno'
  if (score === 'Cold') return 'Frio'
  return score
}

export function KanbanBoard({
  columns,
  leads,
  companies,
  onMove,
  onReactivate,
  onQuickAdd,
}: {
  columns: string[]
  leads: Lead[]
  companies?: Company[]
  onMove: (leadId: string, toStage: string) => void
  onReactivate?: (leadId: string, toStage: 'Negociação' | 'Qualificação') => void
  onQuickAdd?: (stage: string) => void
}) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLead(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    if (draggedLead) {
      onMove(draggedLead, stage)
      setDraggedLead(null)
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto h-full items-start pb-4 scrollbar-thin scrollbar-thumb-violet-300/50 scrollbar-track-transparent">
      {columns.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage)
        const totalValue = stageLeads.reduce((acc, l) => acc + Math.max(0, l.value), 0)
        const colors = COLUMN_COLORS[stage] || { bg: 'bg-slate-200/90', text: 'text-slate-800' }

        return (
          <div
            key={stage}
            role="region"
            aria-label={`Coluna do funil: ${stage}`}
            className="flex-shrink-0 w-[310px] flex flex-col h-full max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div
              className={cn(
                'px-3 py-2 text-[11px] font-bold rounded-t-lg flex items-center justify-between uppercase tracking-wider shadow-sm border border-violet-900/10 backdrop-blur-md',
                colors.bg,
                colors.text,
              )}
            >
              <div className="flex items-center gap-2">
                <span id={`stage-title-${stage}`}>{stage}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] leading-none bg-black/20 font-medium"
                  aria-label={`${stageLeads.length} negócios nesta etapa`}
                >
                  {stageLeads.length}
                </span>
              </div>
              {stage === 'Primeiro contato' && (
                <div
                  className="w-2.5 h-2.5 rounded-sm bg-green-400 border border-green-500/50"
                  aria-hidden="true"
                ></div>
              )}
              {stage === 'Negociação' && (
                <div
                  className="w-3 h-3 rounded-full bg-black/20 text-[10px] flex items-center justify-center font-bold"
                  title="Recomenda-se max 3 semanas"
                  aria-label="Aviso: Máximo de 3 semanas"
                >
                  <AlertCircle className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-3 bg-white/40 backdrop-blur-sm px-2.5 py-3 rounded-b-lg border-x border-b border-violet-200/60 shadow-inner overflow-hidden">
              <div
                className="text-center text-[22px] font-light text-violet-950/80 my-1 font-mono tracking-tight"
                aria-label={`Valor total em ${stage}: R$ ${totalValue.toLocaleString('pt-BR')}`}
              >
                R$ {totalValue.toLocaleString('pt-BR')}
              </div>

              {stage === 'Primeiro contato' || stage === '1º contato sem resposta' ? (
                <button
                  onClick={() => onQuickAdd?.(stage)}
                  aria-label={`Adicionar negócio rápido na etapa ${stage}`}
                  className="text-xs font-semibold text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-white py-1.5 rounded-md transition-colors flex items-center justify-center gap-1 shadow-sm border border-violet-200/60"
                >
                  <Plus className="w-3 h-3" aria-hidden="true" /> Negócio rápido
                </button>
              ) : (
                <div
                  aria-label={`Adicionar novo em ${stage}`}
                  role="button"
                  tabIndex={0}
                  className="h-7 flex items-center justify-center text-violet-400 font-bold hover:bg-violet-200/50 hover:text-violet-600 rounded-md cursor-pointer transition-colors border border-dashed border-transparent hover:border-violet-300"
                >
                  <span aria-hidden="true">+</span>
                </div>
              )}

              <div
                className="flex flex-col gap-3 overflow-y-auto pb-4 scrollbar-hide"
                role="list"
                aria-labelledby={`stage-title-${stage}`}
              >
                {stageLeads.map((lead) => {
                  const company = companies?.find((c) => c.id === lead.companyId)
                  return (
                    <Card
                      key={lead.id}
                      draggable
                      role="listitem"
                      aria-label={`Negócio: ${lead.title}`}
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className={cn(
                        'p-3 bg-white/95 backdrop-blur-sm hover:bg-white hover:shadow-violet-200/50 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border border-violet-100/80 hover:border-violet-300 rounded-lg relative group',
                        lead.isStalled &&
                          'border-orange-300 shadow-[0_0_10px_-2px_rgba(251,146,60,0.4)]',
                      )}
                    >
                      {lead.isStalled && (
                        <div
                          className="absolute -top-2 -right-2 bg-orange-100 text-orange-600 border border-orange-200 rounded-full p-1 shadow-sm z-20"
                          title="Muito tempo nesta etapa (Aviso)"
                          aria-label="Aviso: Estagnado na etapa"
                        >
                          <Clock className="w-3 h-3" aria-hidden="true" />
                        </div>
                      )}

                      <div className="absolute right-2 top-3 flex flex-col gap-2.5 text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded backdrop-blur-md border border-violet-50 shadow-sm z-10">
                        <button
                          aria-label={`Ligar para o lead ${lead.title}`}
                          className="hover:text-violet-600 transition-colors"
                        >
                          <Phone className="w-[16px] h-[16px]" aria-hidden="true" />
                        </button>
                        <button
                          aria-label={`Enviar email para o lead ${lead.title}`}
                          className="hover:text-violet-600 transition-colors"
                        >
                          <Mail className="w-[16px] h-[16px]" aria-hidden="true" />
                        </button>
                        <button
                          aria-label={`Enviar mensagem no chat para ${lead.title}`}
                          className="hover:text-violet-600 transition-colors"
                        >
                          <MessageSquare className="w-[16px] h-[16px]" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="pr-6 relative z-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-violet-950 text-[13px] leading-snug uppercase tracking-wide">
                            {lead.title}
                          </h4>
                        </div>

                        <div className="flex gap-1.5 mb-3 flex-wrap">
                          {lead.score && (
                            <Badge
                              variant="outline"
                              aria-label={`Score: ${translateScore(lead.score)}`}
                              className={cn(
                                'text-[9px] uppercase font-bold py-0 h-4 border',
                                lead.score === 'Hot'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : lead.score === 'Warm'
                                    ? 'bg-orange-50 text-orange-600 border-orange-200'
                                    : 'bg-blue-50 text-blue-600 border-blue-200',
                              )}
                            >
                              {translateScore(lead.score)}
                            </Badge>
                          )}
                          {company?.segmento && (
                            <Badge
                              variant="outline"
                              aria-label={`Segmento: ${company.segmento}`}
                              className="text-[9px] uppercase font-bold py-0 h-4 border bg-slate-50 text-slate-500 border-slate-200"
                            >
                              {company.segmento}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3 text-[11px] leading-none text-slate-700 bg-violet-50/30 p-2 rounded border border-violet-50/50">
                          <div>
                            <span className="text-violet-600/80 block mb-1 font-semibold uppercase text-[9px] tracking-wider">
                              Responsável
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Avatar className="w-5 h-5 border border-violet-200 shadow-sm">
                                <AvatarImage src={lead.ownerAvatar} alt={lead.owner} />
                                <AvatarFallback className="text-[10px] bg-violet-700 text-white font-bold">
                                  {lead.owner.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-violet-950">{lead.owner}</span>
                            </div>
                          </div>

                          {company && (
                            <div className="pt-1">
                              <span className="text-violet-600/80 block mb-1 font-semibold uppercase text-[9px] tracking-wider">
                                Empresa
                              </span>
                              <span className="font-medium text-violet-800/80 line-clamp-1 leading-tight">
                                {company.nomeFantasia || company.razaoSocial}
                              </span>
                              {company.clusters && company.clusters.length > 0 && (
                                <span className="text-[9px] text-violet-500 mt-1 block">
                                  {company.clusters.join(', ')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {onReactivate ? (
                          <div className="pt-3 mt-3 border-t border-violet-100/60 grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => onReactivate(lead.id, 'Qualificação')}
                              aria-label={`Reativar ${lead.title} para Qualificação`}
                              className="text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded flex items-center justify-center gap-1 text-[10px] font-bold transition-colors border border-blue-100 shadow-sm"
                            >
                              <RefreshCw className="w-3 h-3" aria-hidden="true" /> Qualif.
                            </button>
                            <button
                              onClick={() => onReactivate(lead.id, 'Negociação')}
                              aria-label={`Reativar ${lead.title} para Negociação`}
                              className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-1.5 rounded flex items-center justify-center gap-1 text-[10px] font-bold transition-colors border border-emerald-100 shadow-sm"
                              title="Inbound - Pedido de Preço"
                            >
                              <RefreshCw className="w-3 h-3" aria-hidden="true" /> Negoc.
                            </button>
                          </div>
                        ) : (
                          <div className="pt-3 mt-3 border-t border-violet-100/60">
                            <button
                              aria-label={`Adicionar atividade ao lead ${lead.title}`}
                              className="text-violet-600 bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded flex items-center gap-1 text-[11px] font-bold transition-colors w-full justify-center border border-violet-100 shadow-sm"
                            >
                              <Plus className="w-3 h-3" aria-hidden="true" /> Adicionar Atividade
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}

                {stageLeads.length === 0 && (
                  <div
                    className="h-24 border-2 border-dashed border-violet-200/60 rounded-lg flex items-center justify-center p-4 bg-violet-50/30"
                    aria-hidden="true"
                  >
                    <span className="text-xs text-violet-400 font-medium">Nenhum negócio</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
