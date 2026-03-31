migrate(
  (app) => {
    const usersCollection = app.findCollectionByNameOrId('transzecao')
    const collection = new Collection({
      name: 'settings_audit_logs',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'parameter', type: 'text', required: true },
        { name: 'old_value', type: 'text', required: false },
        { name: 'new_value', type: 'text', required: true },
        { name: 'impact', type: 'text', required: false },
        {
          name: 'user_id',
          type: 'relation',
          required: false,
          collectionId: usersCollection.id,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('settings_audit_logs')
    app.delete(collection)
  },
)
