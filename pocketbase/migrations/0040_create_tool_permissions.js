migrate(
  (app) => {
    const collection = new Collection({
      name: 'tool_permissions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'tool', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'can_access', type: 'bool' },
        { name: 'is_developer', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_tool_permissions_tool_role ON tool_permissions (tool, role)',
      ],
    })
    app.save(collection)

    const perms = [
      { tool: 'finance_cpk', role: 'SUPERVISOR_FINANCEIRO', access: true, dev: true },
      { tool: 'finance_cpk', role: 'FUNCIONARIO_FINANCEIRO', access: true, dev: false },
      { tool: 'freight_calculation', role: 'SUPERVISOR_COLETA', access: true, dev: true },
      { tool: 'freight_calculation', role: 'FUNCIONARIO_COLETA', access: true, dev: false },
      { tool: 'collection_scheduling', role: 'SUPERVISOR_COLETA', access: true, dev: true },
      { tool: 'collection_scheduling', role: 'FUNCIONARIO_COLETA', access: true, dev: false },
      { tool: 'lead_registration', role: 'SUPERVISOR_COMERCIAL', access: true, dev: true },
      { tool: 'lead_registration', role: 'FUNCIONARIO_PROSPECCAO', access: true, dev: false },
      { tool: 'lead_registration', role: 'FUNCIONARIO_MARKETING', access: true, dev: false },
    ]

    const col = app.findCollectionByNameOrId('tool_permissions')
    for (const p of perms) {
      const existing = app.findRecordsByFilter(
        'tool_permissions',
        `tool='${p.tool}' && role='${p.role}'`,
        '',
        1,
        0,
      )
      if (existing.length === 0) {
        const record = new Record(col)
        record.set('tool', p.tool)
        record.set('role', p.role)
        record.set('can_access', p.access)
        record.set('is_developer', p.dev)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('tool_permissions')
      app.delete(col)
    } catch (_) {}
  },
)
