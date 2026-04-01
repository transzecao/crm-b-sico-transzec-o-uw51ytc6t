migrate(
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')

    transzecao.fields.add(
      new SelectField({
        name: 'role',
        values: [
          'Acesso Master',
          'Supervisor Financeiro',
          'Supervisor Comercial',
          'Supervisor Coleta',
          'Funcionário Comercial',
          'Funcionário Marketing',
          'Funcionário Coleta',
          'Cliente',
        ],
      }),
    )

    transzecao.fields.add(
      new SelectField({
        name: 'status',
        values: ['active', 'pending', 'inactive'],
      }),
    )

    transzecao.fields.add(
      new DateField({
        name: 'last_activity',
      }),
    )

    transzecao.fields.add(new TextField({ name: 'phone' }))
    transzecao.fields.add(new TextField({ name: 'position' }))

    app.save(transzecao)

    const invitations = new Collection({
      name: 'invitations',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'email', type: 'email', required: true },
        {
          name: 'role',
          type: 'select',
          required: true,
          values: [
            'Acesso Master',
            'Supervisor Financeiro',
            'Supervisor Comercial',
            'Supervisor Coleta',
            'Funcionário Comercial',
            'Funcionário Marketing',
            'Funcionário Coleta',
            'Cliente',
          ],
        },
        { name: 'token', type: 'text', required: true },
        { name: 'status', type: 'select', required: true, values: ['sent', 'accepted', 'expired'] },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(invitations)

    const loginHistory = new Collection({
      name: 'login_history',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: transzecao.id,
          maxSelect: 1,
        },
        { name: 'ip_address', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(loginHistory)
  },
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')
    transzecao.fields.removeByName('role')
    transzecao.fields.removeByName('status')
    transzecao.fields.removeByName('last_activity')
    transzecao.fields.removeByName('phone')
    transzecao.fields.removeByName('position')
    app.save(transzecao)

    try {
      app.delete(app.findCollectionByNameOrId('invitations'))
      app.delete(app.findCollectionByNameOrId('login_history'))
    } catch (e) {}
  },
)
