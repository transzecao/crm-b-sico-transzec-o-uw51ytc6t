migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('transzecao')

    const roleField = users.fields.getByName('role')
    if (roleField) {
      roleField.values = [
        'master',
        'sup_financeiro',
        'sup_comercial',
        'sup_coleta',
        'func_comercial',
        'func_marketing',
        'func_coleta',
        'cliente',
      ]
      users.fields.add(roleField)
    }

    if (!users.fields.getByName('setor_slug')) {
      users.fields.add(new TextField({ name: 'setor_slug' }))
    }
    app.save(users)

    try {
      app.findCollectionByNameOrId('action_logs')
    } catch (_) {
      const actionLogs = new Collection({
        name: 'action_logs',
        type: 'base',
        listRule: "@request.auth.role = 'master'",
        viewRule: "@request.auth.role = 'master'",
        createRule: "@request.auth.id != ''",
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'user_id',
            type: 'relation',
            required: true,
            collectionId: users.id,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'action_type', type: 'text', required: true },
          { name: 'description', type: 'text', required: true },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(actionLogs)
    }

    const invitations = app.findCollectionByNameOrId('invitations')
    const invRoleField = invitations.fields.getByName('role')
    if (invRoleField) {
      invRoleField.values = [
        'master',
        'sup_financeiro',
        'sup_comercial',
        'sup_coleta',
        'func_comercial',
        'func_marketing',
        'func_coleta',
        'cliente',
      ]
      invitations.fields.add(invRoleField)
      app.save(invitations)
    }
  },
  (app) => {
    try {
      const actionLogs = app.findCollectionByNameOrId('action_logs')
      app.delete(actionLogs)
    } catch (_) {}
  },
)
