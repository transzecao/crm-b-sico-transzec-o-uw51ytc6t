import { useState, useEffect } from 'react'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'

interface LeadSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function LeadSearch({ onSearch, placeholder = 'Buscar leads...' }: LeadSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { debouncedValue, isSearching } = useDebouncedSearch(searchTerm, 300)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 pr-10 bg-white"
      />
      {isSearching && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
      )}
    </div>
  )
}
