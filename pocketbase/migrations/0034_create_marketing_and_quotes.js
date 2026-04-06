migrate(
  (app) => {
    const conteudo = new Collection({
      name: 'conteudo_nutricao',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'conteudo', type: 'text', required: true },
        { name: 'arquivo_url', type: 'file', maxSelect: 1, maxSize: 5242880 },
        { name: 'enviado_por', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'data_envio', type: 'date' },
        { name: 'clientes_destino', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(conteudo)

    const docs = new Collection({
      name: 'documentos_cotacao',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'cliente_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        {
          name: 'funcionario_financeiro_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        {
          name: 'supervisor_financeiro_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'documento_url', type: 'file', maxSelect: 1, maxSize: 5242880 },
        { name: 'data_geracao', type: 'date' },
        { name: 'status', type: 'select', values: ['pendente', 'aprovada', 'rejeitada'] },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(docs)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('documentos_cotacao'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('conteudo_nutricao'))
    } catch (_) {}
  },
)
