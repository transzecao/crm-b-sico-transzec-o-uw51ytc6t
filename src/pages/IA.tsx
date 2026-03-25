import { BrainCircuit, Activity, Database, ShieldCheck, History, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'
import { Badge } from '@/components/ui/badge'

export default function IA() {
  const { state } = useCrmStore()

  return (
    <div className="space-y-6 bg-slate-50/50 min-h-[calc(100vh-6rem)] p-4 md:p-8 rounded-xl border border-slate-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 border border-indigo-200/50">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              The Brain (Inteligência Central)
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Motor de Aprendizado Contínuo & Integração Web Segura.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900 font-bold">
              <Activity className="w-5 h-5 text-indigo-500" /> Aprendizado Contínuo
            </CardTitle>
            <CardDescription className="text-xs">Padrões de mercado analisados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="text-sm text-slate-600 border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-800 block mb-1">Setor: Autopeças</span>
              Taxa de sucesso com "Teste Leve" subiu 40%. Padrão priorizado no gerador de respostas
              automáticas.
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-bold text-slate-800 block mb-1">Setor: Metalúrgica</span>
              Objeções sobre "avarias" sendo superadas usando novos cases de SLA (98% intacto).
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 font-bold">
              <Database className="w-5 h-5 text-emerald-500" /> Business Intelligence
            </CardTitle>
            <CardDescription className="text-xs">Atualizações de Conhecimento Web</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center bg-emerald-50/30 p-2 rounded border border-emerald-100/50">
              <span className="text-sm font-medium text-slate-700">Tabela ANTT (Frete)</span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Há 2h
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-emerald-50/30 p-2 rounded border border-emerald-100/50">
              <span className="text-sm font-medium text-slate-700">Relatório Logístico 2025</span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Sincronizado
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-amber-50/30 p-2 rounded border border-amber-100/50">
              <span className="text-sm font-medium text-slate-700">Demandas Sazonais</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Pendente
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2 text-sky-900 font-bold">
              <ShieldCheck className="w-5 h-5 text-sky-500" /> Camada de Segurança
            </CardTitle>
            <CardDescription className="text-xs">Domínios Confiáveis (Whitelist)</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex flex-wrap gap-2">
            {['antt.gov.br', 'reclameaqui.com.br', 'sindipesp.com.br', 'google.com/maps'].map(
              (domain) => (
                <Badge
                  key={domain}
                  variant="secondary"
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 py-1 px-2"
                >
                  <Globe className="w-3 h-3 text-sky-500" /> {domain}
                </Badge>
              ),
            )}
            <div className="w-full mt-2 text-xs text-slate-500 italic bg-sky-50/50 p-2 rounded border border-sky-100">
              Acesso web restrito a dados públicos, governamentais e ferramentas de geocoding
              validadas.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-white">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
            <History className="w-5 h-5 text-slate-500" /> Log de Auditoria: Web Search & API
          </CardTitle>
          <CardDescription>
            Registro completo de atualizações automáticas e validações web.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {state.aiAuditLogs?.map((log) => (
              <div
                key={log.id}
                className="p-5 hover:bg-slate-50/80 transition-colors flex justify-between items-start gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-2 mb-1">
                    {log.action}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {log.details}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                    {log.date}
                  </span>
                  {log.domainChecked && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-white text-slate-600 flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3 text-indigo-400" /> {log.domainChecked}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {(!state.aiAuditLogs || state.aiAuditLogs.length === 0) && (
              <div className="p-8 text-center text-slate-500 font-medium">
                Nenhum log de auditoria recente.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
