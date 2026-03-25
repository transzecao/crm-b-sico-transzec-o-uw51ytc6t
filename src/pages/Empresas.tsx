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

  const canCreate = !['Diretoria', 'Financeiro', 'Supervisor Financeiro'].includes(state.role)

  return (
    <div className="space-y-6 bg-blue-50/20 min-h-[calc(100vh-6rem)] p-2 md:p-6 rounded-xl border border-blue-100/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100/60 p-3 rounded-xl border border-blue-200/50 text-blue-600 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">Empresas</h1>
            <p className="text-blue-700/80 font-medium mt-1">
              Gerencie o cadastro de clientes e prospects comerciais.
            </p>
          </div>
        </div>
        {canCreate && (
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
          >
            <Link to="/empresa/nova">
              <Plus className="w-4 h-4 mr-2" /> Nova Empresa
            </Link>
          </Button>
        )}
      </div>

      <Card className="border-blue-100 shadow-sm overflow-hidden bg-white/70 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-blue-50/70 border-b border-blue-100">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-blue-900 font-semibold py-4">CNPJ</TableHead>
                <TableHead className="text-blue-900 font-semibold py-4">Razão Social</TableHead>
                <TableHead className="text-blue-900 font-semibold py-4">Fantasia</TableHead>
                <TableHead className="text-blue-900 font-semibold py-4 w-[140px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.companies.map((c) => (
                <TableRow
                  key={c.id}
                  className="border-b border-blue-50 hover:bg-blue-50/40 transition-colors"
                >
                  <TableCell className="font-semibold text-blue-950">{c.cnpj}</TableCell>
                  <TableCell className="text-blue-900/80 font-medium">
                    {c.razaoSocial || '-'}
                  </TableCell>
                  <TableCell className="text-blue-900/80">{c.nomeFantasia || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300 w-full shadow-sm"
                    >
                      <Link to={`/empresa/${c.id}/editar`}>
                        <FolderOpen className="w-4 h-4 mr-2" /> Abrir Ficha
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {state.companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-blue-800/50 font-medium">
                    Nenhuma empresa cadastrada no módulo comercial.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
