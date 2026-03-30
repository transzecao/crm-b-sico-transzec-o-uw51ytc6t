import { useState, useMemo } from 'react'
import { Plus, Building2, Search, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCrmStore from '@/stores/useCrmStore'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const SEGMENT_COLORS: Record<string, string> = {
  'Indústria': 'border-l-blue-500',
  'Comércio': 'border-l-green-500',
  'Serviços': 'border-l-yellow-500',
  'Tecnologia': 'border-l-purple-500',
  'Saúde': 'border-l-red-500',
  'Transporte': 'border-l-orange-500',
  'Logística': 'border-l-teal-500',
  'Varejo': 'border-l-pink-500',
}

function getSegmentColor(segment: string | undefined) {
  if (!segment) return 'border-l-slate-400'
  const match = Object.keys(SEGMENT_COLORS).find(k => segment.toLowerCase().includes(k.toLowerCase()))
  return match ? SEGMENT_COLORS[match] : 'border-l-slate-400'
}

export default function Empresas() {
  const { state } = useCrmStore()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(15)

  const canCreate = [
    'Acesso Master',
    'Supervisor Comercial',
    'Funcionário Comercial',
    'Funcionário Coleta',
  ].includes(state.role)

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return state.companies
    const term = searchTerm.toLowerCase()
    return state.companies.filter(c => 
      c.nomeFantasia?.toLowerCase().includes(term) ||
      c.razaoSocial?.toLowerCase().includes(term) ||
      c.cnpj.includes(term) ||
      c.segmento?.toLowerCase().includes(term) ||
      c.cidade?.toLowerCase().includes(term)
    )
  }, [state.companies, searchTerm])

  const visibleCompanies = filteredCompanies.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCompanies.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Empresas</h1>
            <p className="text-slate-500 font-medium mt-1">
              Diretório visual de clientes e prospects.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar empresas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary/30"
            />
          </div>
          {canCreate && (
            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-md font-bold whitespace-nowrap">
              <Link to="/empresa/nova">
                <Plus className="w-4 h-4 mr-2" /> Nova Empresa
              </Link>
            </Button>
          )}
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Nenhuma empresa encontrada</h3>
          <p className="text-slate-500 mt-1">Tente ajustar seus termos de busca.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCompanies.map((c) => (
              <Card 
                key={c.id} 
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 border-l-4",
                  getSegmentColor(c.segmento)
                )}
                onClick={() => navigate(`/empresa/${c.id}/360`)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2">
                      {c.nomeFantasia || c.razaoSocial}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="font-medium text-slate-500 w-12">CNPJ:</span>
                      <span className="font-mono">{c.cnpj}</span>
                    </div>
                    {c.cidade && (
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {c.cidade}{c.estado ? ` - ${c.estado}` : ''}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold truncate max-w-[120px]">
                      {c.segmento || 'Não definido'}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-400 font-medium">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setVisibleCount(v => v + 15)}
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary font-bold shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Carregar Mais Empresas
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
