migrate(
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')
    let needsSave = false

    const roleField = transzecao.fields.getByName('role')
    if (roleField && roleField.type === 'select') {
      const currentValues = roleField.values ? Array.from(roleField.values) : []
      const missing = ['Cliente', 'CLIENTE', 'SUPORTE_TECNICO'].filter(
        (v) => !currentValues.includes(v),
      )
      if (missing.length > 0) {
        roleField.values = [...currentValues, ...missing]
        needsSave = true
      }
    }

    if (!transzecao.fields.getByName('requires_password_setup')) {
      transzecao.fields.add(new BoolField({ name: 'requires_password_setup' }))
      needsSave = true
    }

    if (needsSave) {
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
        { name: 'defaultValue', type: 'text' },
        { name: 'order', type: 'number' },
        { name: 'values', type: 'json' },
        { name: 'min', type: 'number' },
        { name: 'max', type: 'number' },
        { name: 'step', type: 'number' },
        { name: 'pattern', type: 'text' },
        { name: 'helpText', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)

    const usersToSeed = [
      {
        email: 'financeiro.novo@transzecao.com',
        name: 'Financeiro Novo',
        role: 'SUPERVISOR_FINANCEIRO',
      },
      { email: 'coleta.novo@transzecao.com', name: 'Coleta Novo', role: 'SUPERVISOR_COLETA' },
      {
        email: 'comercial.novo@transzecao.com',
        name: 'Comercial Novo',
        role: 'SUPERVISOR_COMERCIAL',
      },
      {
        email: 'func.finan@transzecao.com',
        name: 'Funcionario Financeiro',
        role: 'FUNCIONARIO_FINANCEIRO',
      },
      {
        email: 'func.coleta@transzecao.com',
        name: 'Funcionario Coleta',
        role: 'FUNCIONARIO_COLETA',
      },
      {
        email: 'func.comercial@transzecao.com',
        name: 'Funcionario Prospeccao',
        role: 'FUNCIONARIO_PROSPECCAO',
      },
    ]

    for (let u of usersToSeed) {
      try {
        app.findAuthRecordByEmail('transzecao', u.email)
      } catch (_) {
        let record = new Record(transzecao)
        record.setEmail(u.email)
        record.setPassword('Skip@Pass')
        record.setVerified(true)
        record.set('name', u.name)
        record.set('role', u.role)
        record.set('status', 'Ativo')
        record.set('requires_password_setup', true)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('tool_fields')
      app.delete(collection)
    } catch (_) {}
  },
)
