migrate(
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')
    if (!transzecao.fields.getByName('requires_password_setup')) {
      transzecao.fields.add(new BoolField({ name: 'requires_password_setup' }))
      app.save(transzecao)
    }

    const collection = new Collection({
      name: 'tool_fields',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'tool', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['text', 'number', 'select', 'checkbox', 'date', 'email', 'tel'],
        },
        { name: 'required', type: 'bool' },
        { name: 'showInUserInterface', type: 'bool' },
        { name: 'placeholder', type: 'text' },
        { name: 'order', type: 'number' },
        { name: 'values', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('tool_fields')
      app.delete(collection)
    } catch (_) {}
  },
)
