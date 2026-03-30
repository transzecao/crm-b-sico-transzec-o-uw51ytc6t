import { useEngineStore } from '@/stores/useEngineStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatCnpj } from '@/utils/formatters'

export function FinanceQuotesTab() {
  const { internalQuotes } = useEngineStore()
  const { toast } = useToast()

  const handleDownload = (id: string) => {
    toast({
      title: 'Download Iniciado',
      description: `Gerando PDF da cotação #${id}...`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="shadow-sm border-slate-200 bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 font-bold">
            <FileText className="w-5 h-5 text-primary" /> Histórico de Cotações Internas
          </CardTitle>
          <CardDescription>
            Registro de todas as cotações geradas pela equipe, com auditoria de descontos e valores.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {internalQuotes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">
              Nenhuma cotação foi gerada ainda. Utilize o simulador para criar uma cotação e ela
              aparecerá aqui.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Data / Hora</th>
                    <th className="px-4 py-3">CNPJ Cliente</th>
                    <th className="px-4 py-3">Funcionário (Setor)</th>
                    <th className="px-4 py-3 text-right">Valor Original</th>
                    <th className="px-4 py-3 text-right">Desconto</th>
                    <th className="px-4 py-3 text-right">Valor Final</th>
                    <th className="px-4 py-3 text-center w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {internalQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{quote.date}</div>
                        <div className="text-xs text-slate-400">{quote.time}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {formatCnpj(quote.customerCnpj)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{quote.employeeName}</div>
                        <div className="text-xs text-slate-500">{quote.department}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 line-through">
                        {formatCurrency(quote.originalValue)}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-500 font-medium">
                        - {formatCurrency(quote.discountValue)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(quote.finalValue)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(quote.id)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
                        >
                          <Download className="w-4 h-4" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
