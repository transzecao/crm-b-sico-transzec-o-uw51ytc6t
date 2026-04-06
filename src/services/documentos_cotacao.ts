import pb from '@/lib/pocketbase/client'

export const getDocumentosCotacao = async (clienteId: string) => {
  return pb.collection('documentos_cotacao').getFullList({
    filter: `cliente_id = "${clienteId}"`,
    sort: '-created',
  })
}

export const createDocumentoCotacao = async (data: any) => {
  return pb.collection('documentos_cotacao').create(data)
}
