import pb from '@/lib/pocketbase/client'

export const getLeadByCnpj = async (cnpj: string) => {
  try {
    const records = await pb.collection('leads').getList(1, 1, {
      filter: `cnpj_id = '${cnpj}'`,
    })
    return records.items[0] || null
  } catch (e) {
    return null
  }
}

export const createLead = async (data: any) => {
  return pb.collection('leads').create(data)
}

export const getMessagesByLead = async (leadId: string) => {
  const records = await pb.collection('whatsapp_messages').getFullList({
    filter: `lead_id = '${leadId}'`,
    sort: '+created',
  })
  return records
}

export const sendWhatsAppMessage = async (leadId: string, content: string) => {
  return pb.collection('whatsapp_messages').create({
    lead_id: leadId,
    content,
    direction: 'outbound',
  })
}

export const receiveWhatsAppMessage = async (leadId: string, content: string) => {
  return pb.collection('whatsapp_messages').create({
    lead_id: leadId,
    content,
    direction: 'inbound',
  })
}
