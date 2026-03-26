import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Lead, Company } from '@/stores/useCrmStore'
import { Plus, RefreshCw, BrainCircuit } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { calculateAIProbability } from '@/utils/aiPredict'
import useCrmStore from '@/stores/useCrmStore'

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
  onReactivate?: (leadId: string, toStage: 'Negociação' | 'Primeiro contato') => void
  onQuickAdd?: (stage: string) => void
}) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null)
  const { state } = useCrmStore()

  return (
    <div className="flex gap-4 overflow-x-auto h-full items-start pb-4">
      {columns.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage)

        return (
          <div
            key={stage}
            className="flex-shrink-0 w-[300px] flex flex-col h-full"
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (draggedLead) onMove(draggedLead, stage)
              setDraggedLead(null)
            }}
          >
            <div className="px-3 py-2 text-xs font-bold rounded-t-lg bg-slate-200 text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>{stage}</span>
              <span className="bg-slate-300 px-1.5 rounded">{stageLeads.length}</span>
            </div>

            <div className="flex-1 flex flex-col gap-3 bg-slate-100/50 p-2 rounded-b-lg border-x border-b border-slate-200 overflow-y-auto">
              {stage === 'Primeiro contato' && (
                <button
                  onClick={() => onQuickAdd?.(stage)}
                  className="text-xs font-bold text-primary bg-white hover:bg-slate-50 py-1.5 rounded border border-slate-200 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar Lead
                </button>
              )}

              {stageLeads.map((lead) => {
                const company = companies?.find((c) => c.id === lead.companyId)
                const prob = calculateAIProbability(lead, state.interactions)

                return (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedLead(lead.id)
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                    className="p-3 bg-white border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm leading-snug flex-1 pr-2">
                        {lead.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        title="IA: Probabilidade de Fechamento"
                        className={cn(
                          'text-[9px] px-1.5 py-0.5 flex items-center gap-1 cursor-help',
                          prob >= 70
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : prob >= 40
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                        )}
                      >
                        <BrainCircuit className="w-2.5 h-2.5" />
                        {prob}%
                      </Badge>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {lead.score && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary"
                        >
                          {lead.score}
                        </Badge>
                      )}
                      {company?.segmento && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                          {company.segmento}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={lead.ownerAvatar} />
                        <AvatarFallback className="text-[8px] bg-primary text-white">
                          {lead.owner[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-slate-500 font-semibold truncate">
                        {company?.nomeFantasia || company?.razaoSocial}
                      </span>
                    </div>

                    {onReactivate && (
                      <div className="mt-3 grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => onReactivate(lead.id, 'Primeiro contato')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold py-1 rounded flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Reativar
                        </button>
                        <button
                          onClick={() => onReactivate(lead.id, 'Negociação')}
                          className="bg-green-100 hover:bg-green-200 text-green-700 text-[10px] font-bold py-1 rounded flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Preço
                        </button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
