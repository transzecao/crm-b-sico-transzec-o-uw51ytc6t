import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lead } from '@/stores/useCrmStore'
import { formatCurrency } from '@/utils/formatters'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, GripVertical } from 'lucide-react'

export function KanbanBoard({
  columns,
  leads,
  onMove,
}: {
  columns: string[]
  leads: Lead[]
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
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {columns.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage)
        return (
          <div
            key={stage}
            className="flex-shrink-0 w-80 flex flex-col bg-muted/40 rounded-lg p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-semibold text-sm">{stage}</h3>
              <Badge variant="secondary">{stageLeads.length}</Badge>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {stageLeads.map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group border-l-4 border-l-primary"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h4 className="font-medium text-sm leading-tight">{lead.title}</h4>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center -mr-1 text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Mover para
                        </div>
                        {columns
                          .filter((c) => c !== stage)
                          .map((c) => (
                            <DropdownMenuItem key={c} onClick={() => onMove(lead.id, c)}>
                              {c}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground font-medium pl-5">
                    {formatCurrency(lead.value)}
                  </div>
                </Card>
              ))}
              {stageLeads.length === 0 && (
                <div className="h-full border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center p-4">
                  <span className="text-xs text-muted-foreground text-center">
                    Arraste cards para cá
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
