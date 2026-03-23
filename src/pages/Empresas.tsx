import { Plus, FolderOpen } from 'lucide-react'
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
  const canEdit = !['Diretoria', 'Coleta'].includes(state.role)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de clientes e prospects.</p>
        </div>
        {canEdit && (
          <Button asChild>
            <Link to="/empresa/nova">
              <Plus className="w-4 h-4 mr-2" /> Nova Empresa
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CNPJ</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>Fantasia</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.companies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.cnpj}</TableCell>
                  <TableCell>{c.razaoSocial || '-'}</TableCell>
                  <TableCell>{c.nomeFantasia || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/empresa/${c.id}/editar`}>
                          <FolderOpen className="w-4 h-4 mr-2" /> Abrir Ficha
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {state.companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhuma empresa cadastrada.
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
