import { useState, useEffect } from 'react'

export function useDebouncedSearch<T>(value: T, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [isSearching, setIsSearching] = useState<boolean>(false)

  useEffect(() => {
    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsSearching(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return { debouncedValue, isSearching }
}
