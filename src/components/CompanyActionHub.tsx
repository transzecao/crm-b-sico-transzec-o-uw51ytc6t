import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Phone, Mail, Building } from 'lucide-react'
import { Company } from '@/stores/useCrmStore'
import { InteractionsTimeline } from '@/components/InteractionsTimeline'
import { BrainAnalysis } from '@/components/BrainAnalysis'
import useCrmStore from '@/stores/useCrmStore'

export function CompanyActionHub({ company }: { company?: Company }) {
  const { state } = useCrmStore()

  if (!company) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
        <Building className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">Salve a empresa para acessar a visão 360º e IA.</p>
      </div>
    )
  }

  const interactions =
    state.interactions.filter((i) => i.companyId === company.id) || state.interactions

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div className="flex gap-2">
        <Button
          asChild
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
        >
          <Link to={`/empresa/${company.id}/360`}>Abrir Visão 360º Completa</Link>
        </Button>
      </div>

      <BrainAnalysis interactions={interactions} />
      <InteractionsTimeline />

      <div className="flex gap-2 pt-4">
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="w-4 h-4 mr-2" /> Ligar
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Mail className="w-4 h-4 mr-2" /> Email
        </Button>
      </div>
    </div>
  )
}
