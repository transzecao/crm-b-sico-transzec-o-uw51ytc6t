migrate(
  (app) => {
    const collection = new Collection({
      name: 'fleet_settings',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'max_cpk', type: 'number' },
        { name: 'min_margin', type: 'number' },
        { name: 'yellow_margin', type: 'number' },
        { name: 'max_das', type: 'number' },
        { name: 'fuel_consumption', type: 'number' },
        { name: 'fuel_price', type: 'number' },
        { name: 'working_days', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('fleet_settings')
    app.delete(collection)
  },
)
