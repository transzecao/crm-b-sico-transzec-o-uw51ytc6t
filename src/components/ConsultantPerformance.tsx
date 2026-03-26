import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Target, Edit2, Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useCrmStore from '@/stores/useCrmStore'

export function ConsultantPerformance() {
  const { state, updateState } = useCrmStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const isAdmin = ['Master', 'Supervisor', 'Diretoria'].includes(state.role)
  const visibleGoals = isAdmin
    ? state.consultantGoals
    : state.consultantGoals.filter((g) => g.consultantName === state.currentUser.name)

  const handleEdit = (id: string, currentTarget: number) => {
    setEditingId(id)
    setEditValue(currentTarget.toString())
  }

  const handleSave = (id: string) => {
    const val = parseFloat(editValue)
    if (!isNaN(val) && val > 0) {
      updateState({
        consultantGoals: state.consultantGoals.map((g) =>
          g.id === id ? { ...g, targetValue: val } : g,
        ),
      })
    }
    setEditingId(null)
  }

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  if (visibleGoals.length === 0) return null

  return (
    <Card className="border-slate-200 shadow-sm bg-white mb-6">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-800 font-bold">
          <Target className="w-5 h-5 text-primary" /> Performance Individual (Metas)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
        {visibleGoals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
          const isNearTarget = percentage >= 80 && percentage < 100
          const isAchieved = percentage >= 100

          return (
            <div key={goal.id} className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-bold text-slate-900">{goal.consultantName}</h4>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Período: {goal.period}
                  </span>
                </div>
                {isAdmin && editingId !== goal.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-slate-400 hover:text-primary"
                    onClick={() => handleEdit(goal.id, goal.targetValue)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Editar Meta
                  </Button>
                )}
                {editingId === goal.id && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-24 h-8 text-xs"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <Button size="sm" className="h-8 px-2" onClick={() => handleSave(goal.id)}>
                      <Save className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-700">
                  <span>Atual: {fmt(goal.currentValue)}</span>
                  <span>Alvo: {fmt(goal.targetValue)}</span>
                </div>
                <Progress value={percentage} className="h-2.5" />
                <div className="text-right text-xs font-bold text-slate-500">
                  {percentage}% Concluído
                </div>
              </div>

              {isNearTarget && (
                <Alert className="bg-orange-50 border-orange-200 text-orange-800 py-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-xs font-bold mb-0 ml-2">Meta Quase Lá!</AlertTitle>
                  <AlertDescription className="text-xs ml-2">
                    Faltam apenas {fmt(goal.targetValue - goal.currentValue)} para bater a meta.
                  </AlertDescription>
                </Alert>
              )}

              {isAchieved && (
                <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="text-xs font-bold mb-0 ml-2">Meta Atingida!</AlertTitle>
                  <AlertDescription className="text-xs ml-2">
                    Parabéns! O alvo do período foi superado com sucesso.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
