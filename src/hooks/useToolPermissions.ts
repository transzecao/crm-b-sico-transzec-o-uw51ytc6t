import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { UserRole } from '@/types/roles'

export function useToolPermissions(role: UserRole) {
  const [permissions, setPermissions] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchPerms = async () => {
      try {
        setLoading(true)
        const records = await pb.collection('tool_permissions').getFullList({
          filter: `role="${role}"`,
        })
        if (isMounted) {
          const map: Record<string, any> = {}
          records.forEach((r) => {
            map[r.tool] = r
          })
          setPermissions(map)
        }
      } catch (err) {
        console.error('Failed to fetch permissions', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (role) {
      fetchPerms()
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [role])

  return { data: permissions, isLoading: loading }
}
