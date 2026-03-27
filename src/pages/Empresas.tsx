import { Plus, FolderOpen, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'
import { Link } from 'react-router-dom'

export default function Empresas() {
  const { state } = useCrmStore()
  const canCreate = [
    'Acesso Master',
    'Supervisor Comercial',
    'Funcionário Comercial',
    'Funcionário Coleta',
  ].includes(state.role)

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
              Gerencie o cadastro de clientes e prospects.
            </p>
          </div>
        </div>
        {canCreate && (
          <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-md font-bold">
            <Link to="/empresa/nova">
              <Plus className="w-4 h-4 mr-2" /> Nova Empresa
            </Link>
          </Button>
        )}
      </div>

      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-slate-700 font-bold py-4">CNPJ</TableHead>
                <TableHead className="text-slate-700 font-bold py-4">Nome Fantasia</TableHead>
                <TableHead className="text-slate-700 font-bold py-4">Segmento</TableHead>
                <TableHead className="text-slate-700 font-bold py-4 w-[140px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.companies.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-slate-900">{c.cnpj}</TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {c.nomeFantasia || '-'}
                  </TableCell>
                  <TableCell className="text-slate-600">{c.segmento || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-slate-200 text-primary hover:bg-primary/10 hover:text-primary w-full font-bold"
                    >
                      <Link to={`/empresa/${c.id}/editar`}>
                        <FolderOpen className="w-4 h-4 mr-2" /> Ficha
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
