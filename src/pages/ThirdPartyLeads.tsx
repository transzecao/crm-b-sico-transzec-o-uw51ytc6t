import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCrmStore from '@/stores/useCrmStore'

export default function ThirdPartyLeads() {
  const { state } = useCrmStore()

  const leadsFromOthers = state.companies.filter(
    (c) => c.createdBy !== state.currentUser.name && c.createdBy !== 'Sistema',
  )

  return (
    <div className="space-y-6 animate-fade-in-up p-4 md:p-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cadastros de Terceiros
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gerencie leads captados por Marketing, Coleta e outros setores.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Criado Por</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsFromOthers.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell className="font-bold text-slate-900">
                    {c.nomeFantasia || c.razaoSocial}
                  </TableCell>
                  <TableCell className="font-mono text-slate-600">{c.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700">
                      {c.createdBy || 'Desconhecido'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{c.segmento || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild className="gap-2">
                      <Link to={`/empresa/${c.id}/editar`}>
                        <Edit className="w-3.5 h-3.5" /> Editar Cadastro
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {leadsFromOthers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    Nenhum cadastro de terceiros disponível no momento.
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
