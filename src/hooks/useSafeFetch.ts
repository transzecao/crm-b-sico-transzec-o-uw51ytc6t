import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export function useSafeFetch<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const execute = useCallback(
    async (fetcher: () => Promise<T>, successMsg?: string) => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetcher()
        setData(result)
        if (successMsg) {
          toast({ title: 'Sucesso', description: successMsg })
        }
        return result
      } catch (err: any) {
        setError(err)
        toast({
          title: 'Erro',
          description: err.message || 'Ocorreu um erro',
          variant: 'destructive',
        })
        throw err
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  return { data, loading, error, execute }
}
