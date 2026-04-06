import pb from '@/lib/pocketbase/client'

export const getMyCollectionSchedules = async (clientId: string) => {
  return pb.collection('collection_schedules').getFullList({
    filter: `creator_id = "${clientId}"`,
    sort: '-created',
  })
}
