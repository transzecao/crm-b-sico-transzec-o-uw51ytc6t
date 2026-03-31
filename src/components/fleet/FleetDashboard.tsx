import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Trash2,
  FileJson,
  AlertCircle,
  Download,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Database,
  FileBarChart,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { createAuditLog } from '@/services/audit_logs'

export function FleetDashboard() {
  const { toast } = useToast()
  const [history, setHistory] = useState<any[]>([])

  const loadHistory = () => {
    const historyStr = localStorage.getItem('cpkHistoricoCalculos')
    if (historyStr) {
      setHistory(JSON.parse(historyStr))
    } else {
      setHistory([])
    }
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener('cpkHistoryUpdated', loadHistory)
    return () => window.removeEventListener('cpkHistoryUpdated', loadHistory)
  }, [])

  const clearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico local de cálculos?')) {
      localStorage.removeItem('cpkHistoricoCalculos')
      loadHistory()
      toast({
        title: 'Histórico limpo',
        description: 'O histórico de cálculos foi removido do navegador.',
      })
    }
  }

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2))
    const dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', 'historico_calculos_cpk.json')
    dlAnchorElem.click()
  }

  const exportSingleJSON = (data: any, filename: string) => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2))
    const a = document.createElement('a')
    a.href = dataStr
    a.download = filename
    a.click()
  }

  const exportChartAsPNG = (svgId: string, filename: string) => {
    const wrapper = document.getElementById(svgId)
    if (!wrapper) return
    const svgElement = wrapper.querySelector('svg')
    if (!svgElement) return

    const clone = svgElement.cloneNode(true) as SVGSVGElement
    const svgData = new XMLSerializer().serializeToString(clone)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = svgElement.clientWidth || 800
      canvas.height = svgElement.clientHeight || 400
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      const a = document.createElement('a')
      a.download = filename
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const exportAllPNGs = () => {
    exportChartAsPNG('chart-pie', 'grafico_composicao.png')
    setTimeout(() => exportChartAsPNG('chart-line', 'grafico_historico.png'), 500)
    setTimeout(() => exportChartAsPNG('chart-bar', 'grafico_fixo_variavel.png'), 1000)
    setTimeout(() => exportChartAsPNG('chart-doughnut', 'grafico_granular.png'), 1500)
    toast({ title: 'Download Iniciado', description: 'Baixando os gráficos em formato PNG.' })
  }

  const latest = history.length > 0 ? history[history.length - 1] : null

  const handleExportPDF = async (type: 'completo' | 'resumido' | 'graficos') => {
    if (!latest) {
      alert('⚠️ Nenhum cálculo realizado. Realize um cálculo antes de exportar.')
      return
    }

    try {
      toast({ title: 'Gerando PDF...', description: 'Aguarde um momento.' })

      const html2canvas = (await import('https://esm.sh/html2canvas@1.4.1')).default
      const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1')

      let targetId = ''
      let filename = ''
      let orientation: 'p' | 'l' = 'p'

      if (type === 'completo') {
        targetId = 'relatorioExportacao'
        filename = `CPK_Relatorio_Completo_${new Date().toISOString().split('T')[0]}.pdf`
      } else if (type === 'resumido') {
        targetId = 'resultadosSection'
        filename = `CPK_Resultados_Resumido_${new Date().toISOString().split('T')[0]}.pdf`
      } else if (type === 'graficos') {
        targetId = 'chart-container-section'
        filename = `CPK_Graficos_${new Date().toISOString().split('T')[0]}.pdf`
        orientation = 'l'
      }

      const element = document.getElementById(targetId)
      if (!element) {
        throw new Error(
          `Elemento ${targetId} não encontrado no DOM. Certifique-se de estar na aba correta.`,
        )
      }

      const wasHidden = element.style.display === 'none'
      if (wasHidden) element.style.display = 'block'

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false })

      if (wasHidden) element.style.display = 'none'

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation, unit: 'px', format: [canvas.width, canvas.height] })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(filename)

      await createAuditLog({
        parameter: 'EXPORTACAO_PDF',
        old_value: 'N/A',
        new_value: filename,
        impact: `Relatório PDF ${type} exportado com sucesso`,
      })

      toast({ title: 'Sucesso', description: 'PDF exportado com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro', description: 'Falha ao exportar PDF.', variant: 'destructive' })
    }
  }

  const handleExportExcel = async () => {
    if (!latest) {
      alert('⚠️ Nenhum cálculo realizado. Realize um cálculo antes de exportar.')
      return
    }

    try {
      toast({ title: 'Gerando Excel...', description: 'Aguarde um momento.' })

      const XLSX = await import('https://esm.sh/xlsx@0.18.5')

      const wb = XLSX.utils.book_new()
      const dateStr = new Date().toISOString().split('T')[0]

      // 1. Resumo
      const resumoData = [
        ['Indicador', 'Valor'],
        ['CPK (R$/km)', latest.cpk],
        [
          'Custo Total (R$)',
          latest.finalTotalCost ||
            latest.costs.drivers +
              latest.costs.hq +
              latest.costs.structuralTaxes +
              latest.dasCost +
              latest.costs.depreciation +
              latest.costs.insurance +
              latest.costs.diesel +
              latest.costs.tires +
              latest.costs.otherVariable,
        ],
        ['Faturamento Estimado (R$)', latest.faturamento],
        ['Margem Líquida (%)', latest.margin],
        ['Custo DAS (R$)', latest.dasCost],
        [],
        ['Categoria', 'Custo (R$)'],
        ['Motoristas', latest.costs.drivers],
        [
          'Veículos',
          (latest.costs.depreciation || 0) +
            (latest.costs.insurance || 0) +
            (latest.costs.diesel || 0) +
            (latest.costs.tires || 0) +
            (latest.costs.otherVariable || 0),
        ],
        ['Sede (Rateio)', latest.costs.hq],
        ['Impostos/Taxas', (latest.costs.structuralTaxes || 0) + (latest.dasCost || 0)],
      ]
      const wsResumo = XLSX.utils.aoa_to_sheet(resumoData)
      wsResumo['!cols'] = [{ wch: 30 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')

      // 2. Motoristas
      let driversData = [
        [
          'ID',
          'Nome',
          'CPF',
          'Salário Base',
          'Periculosidade',
          'VR',
          'Cesta Básica',
          'Seguro',
          'RAT',
          'Custo Total Estimado',
        ],
      ]
      if (latest.fullState?.drivers) {
        driversData = [
          ...driversData,
          ...latest.fullState.drivers.map((d: any) => [
            d.id,
            d.name,
            d.cpf,
            d.baseSalary,
            d.periculosidade ? 'Sim' : 'Não',
            d.vrDaily,
            d.cestaBasica,
            d.seguroVida,
            d.rat,
            d.baseSalary * 1.5,
          ]),
        ]
      }
      const wsMotoristas = XLSX.utils.aoa_to_sheet(driversData)
      wsMotoristas['!cols'] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
      ]
      XLSX.utils.book_append_sheet(wb, wsMotoristas, 'Motoristas')

      // 3. Veículos
      let vehiclesData = [
        [
          'ID',
          'Placa',
          'Tipo',
          'Valor Compra',
          'Valor Revenda',
          'Consumo',
          'Preço Diesel',
          'Seguro Casco',
        ],
      ]
      if (latest.fullState?.vehicles) {
        vehiclesData = [
          ...vehiclesData,
          ...latest.fullState.vehicles.map((v: any) => [
            v.id,
            v.plate,
            v.type,
            v.purchaseValue,
            v.resaleValue,
            v.consumo,
            v.dieselPrice,
            v.seguroCasco,
          ]),
        ]
      }
      const wsVeiculos = XLSX.utils.aoa_to_sheet(vehiclesData)
      wsVeiculos['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
      ]
      XLSX.utils.book_append_sheet(wb, wsVeiculos, 'Veículos')

      // 4. Histórico
      const wsHistorico = XLSX.utils.json_to_sheet(
        history.slice(-10).map((h: any) => ({
          Data: new Date(h.date).toLocaleString(),
          CPK: h.cpk,
          Margem: h.margin,
          Faturamento: h.faturamento,
        })),
      )
      wsHistorico['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, wsHistorico, 'Histórico')

      // 5. Configuração
      let configData = [['Parâmetro', 'Valor']]
      if (latest.fullState?.settings) {
        configData = [
          ...configData,
          ['Dias Úteis', latest.fullState.settings.workingDays],
          ['Max CPK', latest.fullState.settings.maxCpk],
          ['Min Margem', latest.fullState.settings.minMargin],
          ['Max DAS', latest.fullState.settings.maxDas],
          ['Alíquota DAS', latest.fullState.taxes?.dasRate || 0],
        ]
      }
      const wsConfig = XLSX.utils.aoa_to_sheet(configData)
      wsConfig['!cols'] = [{ wch: 20 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, wsConfig, 'Configuração')

      const filename = `CPK_Relatorio_Completo_${dateStr}.xlsx`
      XLSX.writeFile(wb, filename)

      await createAuditLog({
        parameter: 'EXPORTACAO_EXCEL',
        old_value: 'N/A',
        new_value: filename,
        impact: 'Relatório Excel completo exportado com sucesso',
      })

      toast({ title: 'Sucesso', description: 'Excel exportado com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro', description: 'Falha ao exportar Excel.', variant: 'destructive' })
    }
  }

  const pieData =
    latest && latest.costs
      ? [
          { name: 'Motoristas', value: latest.costs.drivers || 0 },
          {
            name: 'Veículos',
            value:
              (latest.costs.depreciation || 0) +
              (latest.costs.insurance || 0) +
              (latest.costs.diesel || 0) +
              (latest.costs.tires || 0) +
              (latest.costs.otherVariable || 0),
          },
          { name: 'Sede', value: latest.costs.hq || 0 },
          {
            name: 'Impostos/Taxas',
            value: (latest.costs.structuralTaxes || 0) + (latest.dasCost || 0),
          },
        ]
      : []

  const lineData = history.slice(-10).map((h, i) => ({
    name: h.date ? format(new Date(h.date), 'dd/MM HH:mm') : `Calc ${i + 1}`,
    cpk: Number(h.cpk.toFixed(2)),
    margin: Number(h.margin.toFixed(2)),
  }))

  const fixedCosts =
    latest && latest.costs
      ? latest.costs.drivers +
        latest.costs.hq +
        latest.costs.structuralTaxes +
        latest.costs.depreciation +
        latest.costs.insurance
      : 0
  const variableCosts =
    latest && latest.costs
      ? latest.costs.diesel + latest.costs.tires + latest.costs.deadKm + latest.costs.otherVariable
      : 0

  const barData = latest
    ? [
        {
          name: 'Custos Totais',
          Fixo: Number(fixedCosts.toFixed(2)),
          Variável: Number(variableCosts.toFixed(2)),
        },
      ]
    : []

  const doughnutData =
    latest && latest.costs
      ? [
          { name: 'Motoristas', value: latest.costs.drivers || 0 },
          { name: 'Depreciação', value: latest.costs.depreciation || 0 },
          { name: 'Combustível', value: latest.costs.diesel || 0 },
          { name: 'Pneus', value: latest.costs.tires || 0 },
          { name: 'Seguros', value: latest.costs.insurance || 0 },
          { name: 'Sede', value: latest.costs.hq || 0 },
          { name: 'DAS', value: latest.dasCost || 0 },
          { name: 'CT-e/Taxas', value: latest.costs.structuralTaxes || 0 },
        ].filter((d) => d.value > 0)
      : []

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  const DOUGHNUT_COLORS = [
    '#3b82f6',
    '#8b5cf6',
    '#ef4444',
    '#f97316',
    '#14b8a6',
    '#64748b',
    '#ec4899',
    '#06b6d4',
  ]

  if (!latest) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
        <h3 className="text-lg font-medium text-slate-900">Nenhum cálculo histórico</h3>
        <p className="max-w-sm text-center mt-2">
          Realize um cálculo na aba "Calculadora CPK" para visualizar o dashboard.
        </p>
      </div>
    )
  }

  // Dynamic evaluation to reconstruct alerts for PDF if needed
  let alertsForPdf: { text: string; color: string }[] = []
  if (latest && latest.fullState?.settings) {
    if (latest.cpk > latest.fullState.settings.maxCpk) {
      alertsForPdf.push({ text: `CPK Crítico: R$ ${latest.cpk.toFixed(2)}/km`, color: '#dc3545' })
    } else if (latest.cpk > latest.fullState.settings.maxCpk * 0.9) {
      alertsForPdf.push({ text: `CPK em Alerta: R$ ${latest.cpk.toFixed(2)}/km`, color: '#ffc107' })
    }

    if (latest.margin < latest.fullState.settings.minMargin) {
      alertsForPdf.push({ text: `Margem Crítica: ${latest.margin.toFixed(2)}%`, color: '#dc3545' })
    } else if (latest.margin < latest.fullState.settings.yellowMargin) {
      alertsForPdf.push({
        text: `Margem em Alerta: ${latest.margin.toFixed(2)}%`,
        color: '#ffc107',
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12" id="resultadosSection">
      <div className="bg-[#e9f7ef] border-l-4 border-[#28a745] p-5 rounded-r-xl shadow-sm print:hidden mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-[#155724] font-semibold text-lg flex items-center gap-2">
            <Download className="w-5 h-5" /> Exportar Relatórios e Dados
          </h3>
          <p className="text-sm text-[#155724] opacity-80 mt-1">
            Gere relatórios executivos ou extraia os dados puros para análise externa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleExportPDF('completo')}
            className="bg-[#28a745] hover:bg-[#218838] text-white"
          >
            <FileText className="w-4 h-4 mr-2" /> PDF Completo
          </Button>
          <Button
            onClick={handleExportExcel}
            className="bg-[#17a2b8] hover:bg-[#138496] text-white"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 bg-white"
            onClick={exportAllPNGs}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Gráficos
          </Button>
          <Button
            variant="secondary"
            className="bg-[#6c757d] hover:bg-[#5a6268] text-white"
            onClick={exportJSON}
          >
            <Database className="w-4 h-4 mr-2" /> JSON Histórico
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="chart-container-section">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-slate-100 mb-4">
            <div>
              <CardTitle>Composição de Custos</CardTitle>
              <CardDescription>Visão macro da estrutura de custos (%)</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportChartAsPNG('chart-pie', 'composicao.png')}
                title="Copiar Gráfico"
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportSingleJSON(pieData, 'composicao.json')}
                title="Exportar JSON do Gráfico"
              >
                <FileJson className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]" id="chart-pie">
            <ChartContainer config={{}} className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-slate-100 mb-4">
            <div>
              <CardTitle>Histórico de Performance</CardTitle>
              <CardDescription>
                Evolução de CPK (R$) vs Margem Líquida (%) - Últimos 10
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportChartAsPNG('chart-line', 'historico.png')}
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportSingleJSON(lineData, 'historico.json')}
              >
                <FileJson className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]" id="chart-line">
            <ChartContainer
              config={{
                cpk: { label: 'CPK', color: '#3b82f6' },
                margin: { label: 'Margem', color: '#10b981' },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer>
                <ComposedChart
                  data={lineData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cpk"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    name="CPK (R$)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="margin"
                    stroke="#10b981"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    name="Margem (%)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-slate-100 mb-4">
            <div>
              <CardTitle>Custos Fixos vs Variáveis</CardTitle>
              <CardDescription>Comparação absoluta de incidência financeira</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportChartAsPNG('chart-bar', 'fixo_variavel.png')}
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportSingleJSON(barData, 'fixo_variavel.json')}
              >
                <FileJson className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]" id="chart-bar">
            <ChartContainer
              config={{
                Fixo: { label: 'Custo Fixo', color: '#64748b' },
                Variável: { label: 'Custo Variável', color: '#f59e0b' },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Fixo"
                    stackId="a"
                    fill="#64748b"
                    radius={[4, 0, 0, 4]}
                    barSize={60}
                  />
                  <Bar
                    dataKey="Variável"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-slate-100 mb-4">
            <div>
              <CardTitle>Distribuição Granular</CardTitle>
              <CardDescription>
                Visão em 8 categorias detalhadas para análise de gargalos
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportChartAsPNG('chart-doughnut', 'granular.png')}
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => exportSingleJSON(doughnutData, 'granular.json')}
              >
                <FileJson className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]" id="chart-doughnut">
            <ChartContainer config={{}} className="w-full h-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={doughnutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {doughnutData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div
        id="relatorioExportacao"
        style={{
          display: 'none',
          padding: '40px',
          fontFamily: 'Arial, sans-serif',
          width: '900px',
          backgroundColor: 'white',
          color: '#333',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            borderBottom: '3px solid #28a745',
            paddingBottom: '15px',
            marginBottom: '20px',
            color: '#155724',
          }}
        >
          Relatório Executivo CPK - Transzecão
        </h1>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>
          <strong>Data de Emissão:</strong> {new Date().toLocaleDateString()}
        </p>

        {latest && (
          <>
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px' }}>
                Resumo de Indicadores
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                <tbody>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', fontWeight: 'bold' }}
                    >
                      CPK Atual:
                    </td>
                    <td
                      style={{
                        border: '1px solid #dee2e6',
                        padding: '12px',
                        color: '#0056b3',
                        fontWeight: 'bold',
                      }}
                    >
                      R$ {latest.cpk.toFixed(2)} / km
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', fontWeight: 'bold' }}
                    >
                      Margem Líquida:
                    </td>
                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                      {latest.margin.toFixed(2)}%
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', fontWeight: 'bold' }}
                    >
                      Faturamento Estimado:
                    </td>
                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                      R$ {latest.faturamento?.toFixed(2) || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {alertsForPdf.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px' }}>
                  Alertas Ativos
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {alertsForPdf.map((a, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: a.color,
                        fontWeight: 'bold',
                        padding: '10px',
                        borderLeft: `4px solid ${a.color}`,
                        backgroundColor: '#f9f9f9',
                        marginBottom: '8px',
                      }}
                    >
                      {a.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px' }}>
                Detalhamento de Custos
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#28a745', color: 'white' }}>
                    <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>
                      Categoria
                    </th>
                    <th
                      style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}
                    >
                      Valor (R$)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>Motoristas</td>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}
                    >
                      {latest.costs?.drivers?.toFixed(2) || 0}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                      Veículos (Depreciação, Combustível, Manutenção, etc)
                    </td>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}
                    >
                      {(
                        (latest.costs?.depreciation || 0) +
                        (latest.costs?.insurance || 0) +
                        (latest.costs?.diesel || 0) +
                        (latest.costs?.tires || 0) +
                        (latest.costs?.otherVariable || 0)
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                      Sede (Rateio Fixo)
                    </td>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}
                    >
                      {latest.costs?.hq?.toFixed(2) || 0}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                      Impostos e Taxas Estruturais
                    </td>
                    <td
                      style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}
                    >
                      {((latest.costs?.structuralTaxes || 0) + (latest.dasCost || 0)).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderLeft: '5px solid #ffc107',
                borderRadius: '4px',
              }}
            >
              <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
                Este documento é confidencial e gerado automaticamente pelo sistema de cálculo
                Transzecão.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
