import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Map, Plus, Trash2 } from 'lucide-react'
import { useFinanceCalculator } from '@/hooks/useFinanceCalculator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function FinanceGeoTab({ calc }: { calc: ReturnType<typeof useFinanceCalculator> }) {
  const [clusters, setClusters] = useState([
    { id: '1', name: 'Campinas e Região', km: 120, active: true },
    { id: '2', name: 'Vale do Paraíba', km: 150, active: true },
    { id: '3', name: 'Baixada Santista', km: 80, active: false },
  ])

  const [newCluster, setNewCluster] = useState({ name: '', km: '' })

  const handleAddCluster = () => {
    if (newCluster.name && newCluster.km) {
      setClusters([
        ...clusters,
        {
          id: Math.random().toString(),
          name: newCluster.name,
          km: Number(newCluster.km),
          active: true,
        },
      ])
      setNewCluster({ name: '', km: '' })
    }
  }

  const toggleCluster = (id: string) => {
    setClusters(clusters.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
  }

  const removeCluster = (id: string) => {
    setClusters(clusters.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
            <MapPin className="w-5 h-5 text-secondary" /> Gestão de Clusters (Regiões)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex-1 space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Nome do Cluster</Label>
              <Input
                value={newCluster.name}
                onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })}
                placeholder="Ex: Ribeirão Preto"
                className="bg-white"
              />
            </div>
            <div className="w-32 space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">KM Médio</Label>
              <Input
                type="number"
                value={newCluster.km}
                onChange={(e) => setNewCluster({ ...newCluster, km: e.target.value })}
                placeholder="Ex: 310"
                className="bg-white"
              />
            </div>
            <Button
              onClick={handleAddCluster}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Região / Cluster</TableHead>
                <TableHead className="font-bold text-center">KM Médio (Distância)</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="font-bold text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clusters.map((cluster) => (
                <TableRow key={cluster.id}>
                  <TableCell className="font-semibold text-slate-800">{cluster.name}</TableCell>
                  <TableCell className="text-center">{cluster.km} km</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={cluster.active}
                        onCheckedChange={() => toggleCluster(cluster.id)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      {cluster.active ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          Ativo
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-500 border-slate-200"
                        >
                          Inativo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCluster(cluster.id)}
                      className="text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
            <Map className="w-5 h-5 text-secondary" /> Parâmetros Específicos da Rota
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-bold text-slate-800 flex items-center gap-2 text-base">
                Zona Máxima de Restrição de Circulação (ZMRC)
              </Label>
              <Switch
                checked={calc.data.zmrc}
                onCheckedChange={(v) => calc.update({ zmrc: v })}
                className="data-[state=checked]:bg-rose-500"
              />
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Ative se o destino ou coleta ocorrer dentro do perímetro restrito de SP. Adiciona taxa
              no cálculo final.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
