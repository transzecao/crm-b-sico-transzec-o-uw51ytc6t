import pb from '@/lib/pocketbase/client'

export const getAgendamentos = () => pb.collection('agendamentos').getFullList({ sort: '-created' })
export const getMyAgendamentos = () =>
  pb.collection('agendamentos').getFullList({ sort: '-created' })
export const getAgendamento = (id: string) => pb.collection('agendamentos').getOne(id)
export const createAgendamento = (data: any) => pb.collection('agendamentos').create(data)
export const updateAgendamento = (id: string, data: any) =>
  pb.collection('agendamentos').update(id, data)
export const deleteAgendamento = (id: string) => pb.collection('agendamentos').delete(id)
