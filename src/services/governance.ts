import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

export const getUsersList = async () => {
  try {
    return await pb.collection('transzecao').getFullList({ sort: '-created' })
  } catch (error) {
    console.error('Failed to fetch users', error)
    return []
  }
}

export const updateUser = async (id: string, data: any) => {
  return await pb.collection('transzecao').update(id, data)
}

export const getLoginHistory = async () => {
  try {
    return await pb.collection('login_history').getFullList({ sort: '-created', expand: 'user_id' })
  } catch (error) {
    console.error('Failed to fetch login history', error)
    return []
  }
}

export const getInvitations = async () => {
  try {
    return await pb.collection('invitations').getFullList({ sort: '-created' })
  } catch (error) {
    console.error('Failed to fetch invitations', error)
    return []
  }
}

export const createInvitation = async (data: any) => {
  const payload = {
    ...data,
    token: data.token || crypto.randomUUID(),
    status: data.status || 'sent',
  }

  try {
    const existing = await pb.collection('invitations').getFirstListItem(`email="${payload.email}"`)
    if (existing) {
      return await pb.collection('invitations').update(existing.id, payload)
    }
  } catch (err: any) {
    if (err.status !== 404) {
      console.error('Error fetching existing invitation:', err)
      throw err
    }
  }

  try {
    return await pb.collection('invitations').create(payload)
  } catch (error: any) {
    if (error instanceof ClientResponseError) {
      const fieldErrors = extractFieldErrors(error)
      console.error('Validation errors creating invitation:', fieldErrors)
    } else {
      console.error('Network or unknown error creating invitation:', error)
    }
    throw error
  }
}

export const getAuditLogs = async () => {
  try {
    return await pb
      .collection('settings_audit_logs')
      .getFullList({ sort: '-created', expand: 'user_id' })
  } catch (error) {
    console.error('Failed to fetch audit logs', error)
    return []
  }
}
