import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Lead, Company } from '@/stores/useCrmStore'
import { Phone, Mail, MessageSquare, Plus, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const COLUMN_COLORS: Record<string, { bg: string; text: string }> = {
  'Primeiro contato': { bg: 'bg-purple-800/90', text: 'text-white' },
  '1º contato sem resposta': { bg: 'bg-purple-600/90', text: 'text-white' },
  Qualificação: { bg: 'bg-purple-500/90', text: 'text-white' },
  '2º contato sem resposta': { bg: 'bg-purple-400/90', text: 'text-purple-950' },
  '3º contato sem resposta': { bg: 'bg-purple-300/90', text: 'text-purple-950' },
  'Nutrição – Aquecimento': { bg: 'bg-purple-700/90', text: 'text-white' },
  'Conteúdo de Valor': { bg: 'bg-purple-500/90', text: 'text-white' },
  Mercado: { bg: 'bg-purple-400/90', text: 'text-purple-950' },
  Segmento: { bg: 'bg-purple-300/90', text: 'text-purple-950' },
  Negociação: { bg: 'bg-amber-400/90', text: 'text-black' },
  Ganho: { bg: 'bg-emerald-600/90', text: 'text-white' },
  Perda: { bg: 'bg-rose-600/90', text: 'text-white' },
}

export function KanbanBoard({
  columns,
  leads,
  companies,
  onMove,
}: {
  columns: string[]
  leads: Lead[]
  companies?: Company[]
  onMove: (leadId: string, toStage: string) => void
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
    <div className="flex gap-4 overflow-x-auto h-full items-start pb-4 scrollbar-thin scrollbar-thumb-purple-300/50 scrollbar-track-transparent">
      {columns.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage)
        const totalValue = stageLeads.reduce((acc, l) => acc + l.value, 0)
        const colors = COLUMN_COLORS[stage] || { bg: 'bg-slate-200/90', text: 'text-slate-800' }

        return (
          <div
            key={stage}
            className="flex-shrink-0 w-[310px] flex flex-col h-full max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {/* Column Header */}
            <div
              className={cn(
                'px-3 py-2 text-[11px] font-bold rounded-t-lg flex items-center justify-between uppercase tracking-wider shadow-sm border border-purple-900/10 backdrop-blur-md',
                colors.bg,
                colors.text,
              )}
            >
              <div className="flex items-center gap-2">
                <span>{stage}</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] leading-none bg-black/20 font-medium">
                  {stageLeads.length}
                </span>
              </div>
              {stage === 'Primeiro contato' && (
                <div className="w-2.5 h-2.5 rounded-sm bg-green-400 border border-green-500/50"></div>
              )}
              {stage === 'Negociação' && (
                <div className="w-3 h-3 rounded-full bg-black/20 text-[10px] flex items-center justify-center font-bold">
                  +
                </div>
              )}
            </div>

            {/* Column Body */}
            <div className="flex-1 flex flex-col gap-3 bg-purple-100/40 backdrop-blur-sm px-2.5 py-3 rounded-b-lg border-x border-b border-purple-200/60 shadow-inner overflow-hidden">
              <div className="text-center text-[22px] font-light text-purple-950/80 my-1 font-mono tracking-tight">
                R$ {totalValue.toLocaleString('pt-BR')}
              </div>

              {stage === 'Primeiro contato' || stage === '1º contato sem resposta' ? (
                <button className="text-xs font-semibold text-purple-700 bg-white/80 backdrop-blur-sm hover:bg-white py-1.5 rounded-md transition-colors flex items-center justify-center gap-1 shadow-sm border border-purple-200/60">
                  <Plus className="w-3 h-3" /> Negócio rápido
                </button>
              ) : (
                <div className="h-7 flex items-center justify-center text-purple-400 font-bold hover:bg-purple-200/50 hover:text-purple-600 rounded-md cursor-pointer transition-colors border border-dashed border-transparent hover:border-purple-300">
                  +
                </div>
              )}

              <div className="flex flex-col gap-3 overflow-y-auto pb-4 scrollbar-hide">
                {stageLeads.map((lead) => {
                  const company = companies?.find((c) => c.id === lead.companyId)
                  return (
                    <Card
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-purple-200/50 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border border-purple-100/80 hover:border-purple-300 rounded-lg relative group"
                    >
                      {/* Action Icons */}
                      <div className="absolute right-2 top-3 flex flex-col gap-2.5 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded backdrop-blur-md border border-purple-50 shadow-sm">
                        <button className="hover:text-purple-600 transition-colors">
                          <Phone className="w-[16px] h-[16px]" />
                        </button>
                        <button className="hover:text-purple-600 transition-colors">
                          <Mail className="w-[16px] h-[16px]" />
                        </button>
                        <button className="hover:text-purple-600 transition-colors">
                          <MessageSquare className="w-[16px] h-[16px]" />
                        </button>
                      </div>

                      {/* Mock notification badge */}
                      {(lead.id === '1' || lead.id === '3') && (
                        <div className="absolute right-2 top-1.5 w-4 h-4 bg-purple-100 text-purple-800 rounded-full text-[10px] flex items-center justify-center font-bold border border-purple-200 shadow-sm">
                          1
                        </div>
                      )}

                      <div className="pr-6">
                        <h4 className="font-bold text-purple-950 text-[13px] leading-snug mb-3 uppercase tracking-wide">
                          {lead.title}
                        </h4>

                        <div className="space-y-3 text-[11px] leading-none text-slate-700 bg-purple-50/30 p-2 rounded border border-purple-50">
                          <div>
                            <span className="text-purple-600/80 block mb-1 font-semibold uppercase text-[9px] tracking-wider">
                              Pessoa responsável
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Avatar className="w-5 h-5 border border-purple-200 shadow-sm">
                                <AvatarImage src={lead.ownerAvatar} />
                                <AvatarFallback className="text-[10px] bg-purple-700 text-white font-bold">
                                  {lead.owner.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-purple-950">{lead.owner}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-purple-600/80 block mb-1 font-semibold uppercase text-[9px] tracking-wider">
                              Etapa alterada por
                            </span>
                            <span className="font-semibold text-purple-900">{lead.updatedBy}</span>
                          </div>

                          <div>
                            <span className="text-purple-600/80 block mb-1 font-semibold uppercase text-[9px] tracking-wider">
                              Modificado em
                            </span>
                            <span className="font-medium text-purple-950">{lead.updatedAt}</span>
                          </div>

                          {company && (
                            <>
                              <div className="pt-1">
                                <span className="text-purple-600/80 block mb-1 font-semibold uppercase text-[9px] tracking-wider">
                                  CNPJ / Empresa
                                </span>
                                <span className="font-medium text-purple-950 block">
                                  {company.cnpj}
                                </span>
                                <span className="font-medium text-purple-800/80 line-clamp-1 leading-tight mt-0.5">
                                  {company.razaoSocial}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="pt-3 mt-3 border-t border-purple-100/60">
                          <button className="text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded flex items-center gap-1 text-[11px] font-bold transition-colors w-full justify-center border border-purple-100">
                            <Plus className="w-3 h-3" /> Adicionar Atividade
                          </button>
                        </div>
                      </div>
                    </Card>
                  )
                })}

                {stageLeads.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-purple-200/60 rounded-lg flex items-center justify-center p-4 bg-purple-50/30">
                    <span className="text-xs text-purple-400 font-medium">Nenhum negócio</span>
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
