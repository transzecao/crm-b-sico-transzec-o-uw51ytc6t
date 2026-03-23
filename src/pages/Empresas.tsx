import { useState } from 'react'
import { Plus, Eye } from 'lucide-react'
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
import useCrmStore, { Company } from '@/stores/useCrmStore'
import { EmpresaModal } from '@/components/EmpresaModal'
import { Link } from 'react-router-dom'

export default function Empresas() {
  const { state } = useCrmStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>()

  const canEdit = !['Diretoria', 'Coleta'].includes(state.role)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de clientes e prospects.</p>
        </div>
        {canEdit && (
          <Button
            onClick={() => {
              setSelectedCompany(undefined)
              setModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Empresa
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
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(c)
                            setModalOpen(true)
                          }}
                        >
                          Editar
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/empresa/${c.id}/360`}>
                          <Eye className="w-4 h-4 mr-2" /> 360º
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {modalOpen && (
        <EmpresaModal open={modalOpen} onOpenChange={setModalOpen} company={selectedCompany} />
      )}
    </div>
  )
}
