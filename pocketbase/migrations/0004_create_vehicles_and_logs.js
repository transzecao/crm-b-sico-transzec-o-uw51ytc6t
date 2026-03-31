migrate(
  (app) => {
    const vehicles = new Collection({
      name: 'vehicles',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'plate', type: 'text', required: true },
        { name: 'model', type: 'text' },
        { name: 'km_critical_limit', type: 'number' },
        { name: 'maintenance_frequency_months', type: 'number' },
        { name: 'last_maintenance_date', type: 'date' },
        { name: 'next_maintenance_date', type: 'date' },
        {
          name: 'status',
          type: 'select',
          values: ['active', 'maintenance', 'inactive'],
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_vehicles_plate ON vehicles (plate)'],
    })
    app.save(vehicles)

    const logs = new Collection({
      name: 'maintenance_logs',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'vehicle_id',
          type: 'relation',
          required: true,
          collectionId: vehicles.id,
          maxSelect: 1,
        },
        { name: 'alert_type', type: 'text', required: true },
        { name: 'message_sent', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(logs)

    const fleetCosts = app.findCollectionByNameOrId('fleet_costs')
    fleetCosts.fields.add(
      new RelationField({
        name: 'vehicle_id',
        collectionId: vehicles.id,
        maxSelect: 1,
      }),
    )
    app.save(fleetCosts)
  },
  (app) => {
    const fleetCosts = app.findCollectionByNameOrId('fleet_costs')
    try {
      fleetCosts.fields.removeByName('vehicle_id')
      app.save(fleetCosts)
    } catch (_) {}

    try {
      app.delete(app.findCollectionByNameOrId('maintenance_logs'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('vehicles'))
    } catch (_) {}
  },
)
