import pb from '@/lib/pocketbase/client'

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
  return await pb.collection('invitations').create(data)
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
