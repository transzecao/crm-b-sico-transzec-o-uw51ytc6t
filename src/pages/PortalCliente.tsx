import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Download, Package, Truck, CheckCircle2, Clock, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { cn } from '@/lib/utils'

export default function PortalCliente() {
  const { state } = useCrmStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = state.freightOrders.filter(
    (o) =>
      o.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDownload = (tracking: string) => {
    toast({
      title: 'Download Iniciado',
      description: `A Nota Fiscal do pedido ${tracking} está sendo baixada.`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entregue':
        return <CheckCircle2 className="w-4 h-4 mr-1.5" />
      case 'Em Trânsito':
        return <Truck className="w-4 h-4 mr-1.5" />
      case 'Em Coleta':
        return <Package className="w-4 h-4 mr-1.5" />
      default:
        return <Clock className="w-4 h-4 mr-1.5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Em Trânsito':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Em Coleta':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-primary px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-tight">Transzecão Portal</h1>
            <p className="text-primary-foreground/80 text-xs font-medium tracking-wide uppercase">
              Autoatendimento do Cliente
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rastreamento e Documentos</h2>
            <p className="text-slate-500 font-medium mt-1">
              Acompanhe suas cargas e baixe os arquivos fiscais de forma fácil.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por código TRZ ou destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-slate-200 focus-visible:ring-primary shadow-sm"
            />
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
            <CardTitle className="text-lg text-slate-800 font-bold flex items-center gap-2">
              <Truck className="w-5 h-5 text-secondary" /> Seus Fretes Ativos e Histórico
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-bold text-slate-700">Código de Rastreio</TableHead>
                  <TableHead className="font-bold text-slate-700">Origem & Destino</TableHead>
                  <TableHead className="font-bold text-slate-700">Status Atual</TableHead>
                  <TableHead className="font-bold text-slate-700">Última Atualização</TableHead>
                  <TableHead className="font-bold text-right text-slate-700">Documentos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-bold text-slate-900 font-mono">
                      {order.trackingCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-bold">
                          De: {order.origin}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          Para: {order.destination}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('font-bold', getStatusColor(order.status))}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{order.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary/20 hover:bg-primary/5 shadow-sm"
                        onClick={() => handleDownload(order.trackingCode)}
                      >
                        <FileText className="w-4 h-4 mr-2" /> Baixar NF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">
                      Nenhum frete encontrado com este termo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <footer className="py-6 border-t border-slate-200 flex flex-col items-center justify-center text-slate-500 bg-white">
        <p className="text-xs font-medium uppercase tracking-wider">
          Portal do Cliente &copy; {new Date().getFullYear()} Transzecão
        </p>
      </footer>
    </div>
  )
}
