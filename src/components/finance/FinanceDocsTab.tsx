import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, FileText, Download, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

export function FinanceDocsTab() {
  const { state } = useCrmStore()
  const { toast } = useToast()

  const canAccess = ['Acesso Master', 'Supervisor Financeiro'].includes(state.role)

  const docs = [
    { id: 1, name: 'Contrato_SLA_IndustrialSP.pdf', date: '10/10/2023', type: 'Fiscal' },
    { id: 2, name: 'Tabela_Precos_Fracionado_2024.xlsx', date: '12/10/2023', type: 'Comercial' },
    { id: 3, name: 'Apolice_Seguro_GRIS.pdf', date: '05/01/2024', type: 'Seguro' },
  ]

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2 text-primary font-bold">
          <Lock className="w-5 h-5 text-secondary" /> Documentos Sensíveis & Contratos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {!canAccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
            <ShieldAlert className="w-12 h-12 mb-3 text-rose-500 opacity-50" />
            <h3 className="font-bold text-slate-700 text-lg">Acesso Restrito</h3>
            <p className="text-sm mt-1 text-center max-w-md">
              Seu nível de permissão ({state.role}) não permite visualizar documentos financeiros
              criptografados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                Todos os arquivos estão protegidos com <strong>criptografia AES-256</strong> at-rest
                no banco de dados.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-primary/40 transition-colors shadow-sm gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                      <FileText className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                        {doc.type} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto bg-white border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() =>
                      toast({
                        title: 'Descriptografando arquivo...',
                        description: `Download de ${doc.name} iniciado de forma segura.`,
                      })
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Decrypt & Baixar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
