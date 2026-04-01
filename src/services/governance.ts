import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

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

export const createInvitation = async (data: { email: string; role: string; setor: string }) => {
  const payload = {
    email: data.email.trim(),
    role: data.role,
    setor: data.setor,
    token: crypto.randomUUID(),
    status: 'sent',
  }

  if (!pb.authStore.isValid) {
    throw new Error('Usuário não autenticado. Faça login novamente.')
  }

  try {
    let existingId: string | null = null
    try {
      const existing = await pb
        .collection('invitations')
        .getFirstListItem(`email="${payload.email}"`)
      existingId = existing.id
    } catch (err: any) {
      if (err.status !== 404) {
        console.error('Error fetching existing invitation:', err)
        throw new Error(getErrorMessage(err) || 'Erro ao verificar convite existente.')
      }
    }

    if (existingId) {
      return await pb.collection('invitations').update(existingId, payload)
    }

    return await pb.collection('invitations').create(payload)
  } catch (error: any) {
    if (error instanceof ClientResponseError) {
      const fieldErrors = extractFieldErrors(error)
      console.error('Validation errors creating invitation:', fieldErrors)
      const msg = getErrorMessage(error)
      throw new Error(msg || 'Erro de validação ao criar convite.')
    } else {
      console.error('Network or unknown error creating invitation:', error)
      throw new Error('Erro de rede ou desconhecido ao criar convite.')
    }
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
