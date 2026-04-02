migrate(
  (app) => {
    const collectionSchedules = new Collection({
      name: 'collection_schedules',
      type: 'base',
      listRule:
        "(@request.auth.role = 'Cliente' && creator_id = @request.auth.id) || (@request.auth.id != '' && @request.auth.role != 'Cliente')",
      viewRule:
        "(@request.auth.role = 'Cliente' && creator_id = @request.auth.id) || (@request.auth.id != '' && @request.auth.role != 'Cliente')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "(@request.auth.role = 'Cliente' && creator_id = @request.auth.id) || (@request.auth.id != '' && @request.auth.role != 'Cliente')",
      deleteRule:
        "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Coleta' || creator_id = @request.auth.id",
      fields: [
        {
          name: 'creator_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'freight_type', type: 'select', required: true, values: ['CIF', 'FOB'] },
        { name: 'sender_cnpj', type: 'text', required: true },
        { name: 'sender_name', type: 'text', required: true },
        { name: 'sender_address', type: 'text', required: true },
        { name: 'dest_cnpj', type: 'text', required: true },
        { name: 'dest_name', type: 'text', required: true },
        { name: 'dest_address', type: 'text', required: true },
        { name: 'invoice_id', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'total_volume', type: 'text', required: false },
        { name: 'total_weight', type: 'number', required: true },
        { name: 'invoice_value', type: 'number', required: true },
        { name: 'observations', type: 'text', required: false },
        { name: 'status', type: 'select', required: true, values: ['pending', 'routed'] },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_collection_schedules_invoice_id ON collection_schedules (invoice_id)',
      ],
    })
    app.save(collectionSchedules)

    const vehiclesCol = app.findCollectionByNameOrId('vehicles')

    const routePlans = new Collection({
      name: 'route_plans',
      type: 'base',
      listRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      viewRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      createRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      updateRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      deleteRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      fields: [
        {
          name: 'schedule_id',
          type: 'relation',
          required: true,
          collectionId: collectionSchedules.id,
          maxSelect: null,
        },
        {
          name: 'vehicle_id',
          type: 'relation',
          required: true,
          collectionId: vehiclesCol.id,
          maxSelect: 1,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'cluster',
          type: 'select',
          required: true,
          values: [
            'Campinas',
            'Diadema',
            'Guarulhos',
            'Hortolandia',
            'Louveira',
            'Osasco',
            'São Paulo',
            'São Bernardo do Campo',
            'São Caetano do Sul',
            'Sumaré',
            'Valinhos',
            'Vinhedo',
            'Itupeva',
          ],
        },
        {
          name: 'created_by',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(routePlans)

    const routingConfig = new Collection({
      name: 'routing_config',
      type: 'base',
      listRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      viewRule: "@request.auth.id != '' && @request.auth.role != 'Cliente'",
      createRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Coleta'",
      updateRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Coleta'",
      deleteRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Coleta'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'settings', type: 'json', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(routingConfig)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('route_plans'))
    app.delete(app.findCollectionByNameOrId('collection_schedules'))
    app.delete(app.findCollectionByNameOrId('routing_config'))
  },
)
