import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FileText, Package } from 'lucide-react'
import { FleetDashboard } from '@/components/fleet/FleetDashboard'
import { ConsultantPerformance } from '@/components/ConsultantPerformance'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function DashboardFuncColeta() {
  const data = [
    { name: 'Seg', coletas: 4 },
    { name: 'Ter', coletas: 7 },
    { name: 'Qua', coletas: 5 },
    { name: 'Qui', coletas: 8 },
    { name: 'Sex', coletas: 6 },
  ]
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance de Coleta</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Coletas Hoje</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">5</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atrasos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nota Média</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-500">4.8</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico Semanal</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="coletas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardSupColeta() {
  const data = [
    { name: 'Semana 1', rotas: 12 },
    { name: 'Semana 2', rotas: 15 },
    { name: 'Semana 3', rotas: 14 },
  ]
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Dashboard Operacional (Coleta)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rotas Ativas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">12</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-amber-500">8</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eficiência da Frota</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-500">92%</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Rotas Executadas por Semana</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="rotas" fill="#800020" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardFuncFinanceiro() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Área Financeira</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <FileText className="w-5 h-5" /> Cotações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700 mb-4">14</div>
            <Button
              asChild
              variant="outline"
              className="w-full bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <Link to="/financeiro/cotacoes">Ver Cotações</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Package className="w-5 h-5" /> Requisições de Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-700 mb-4">3</div>
            <Button
              asChild
              variant="outline"
              className="w-full bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            >
              <Link to="/portal/documentos">Analisar Requisições</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function DashboardSupFinanceiro() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Gestão Financeira & Custos
      </h1>
      <FleetDashboard />
    </div>
  )
}

export function DashboardFuncProspeccao() {
  const data = [
    { name: 'Seg', leads: 4 },
    { name: 'Ter', leads: 6 },
    { name: 'Qua', leads: 2 },
    { name: 'Qui', leads: 5 },
    { name: 'Sex', leads: 8 },
  ]
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Minhas Métricas (Prospecção)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Leads Convertidos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">12</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Hoje</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-amber-600">5</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contatos Feitos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">42</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Leads Contatados na Semana</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardFuncMarketing() {
  const data = [
    { name: 'Semana 1', views: 400 },
    { name: 'Semana 2', views: 600 },
    { name: 'Semana 3', views: 850 },
  ]
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance de Nutrição</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Posts Criados</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">8</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engajamento Médio</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-500">24%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads Qualificados</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-500">15</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Visualizações de Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardSupComercial() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Performance da Equipe Comercial
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Prospecção (Novos Leads)</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-purple-700">
            42 <span className="text-sm text-purple-500 font-normal">ativos no funil</span>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Nutrição (Marketing)</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-green-700">
            18 <span className="text-sm text-green-500 font-normal">engajados</span>
          </CardContent>
        </Card>
      </div>
      <ConsultantPerformance />
    </div>
  )
}
