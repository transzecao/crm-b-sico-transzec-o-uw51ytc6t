import pb from '@/lib/pocketbase/client'

export const createAuditLog = async (data: {
  parameter: string
  old_value: string
  new_value: string
  impact: string
}) => {
  try {
    const user = pb.authStore.record
    await pb.collection('settings_audit_logs').create({
      ...data,
      user_id: user?.id || null,
    })
  } catch (error) {
    console.error('Failed to create audit log', error)
  }
}
