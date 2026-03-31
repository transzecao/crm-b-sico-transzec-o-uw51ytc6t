migrate(
  (app) => {
    const usersCollection = app.findCollectionByNameOrId('transzecao')
    const collection = new Collection({
      name: 'fleet_costs',
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
          collectionId: usersCollection.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'month_year', type: 'text', required: true },
        { name: 'fixed_salary_driver', type: 'number' },
        { name: 'fixed_salary_helper', type: 'number' },
        { name: 'fixed_insurance', type: 'number' },
        { name: 'fixed_ipva', type: 'number' },
        { name: 'fixed_depreciation', type: 'number' },
        { name: 'fixed_tracking', type: 'number' },
        { name: 'fixed_warehouse', type: 'number' },
        { name: 'var_fuel', type: 'number' },
        { name: 'var_arla', type: 'number' },
        { name: 'var_maintenance', type: 'number' },
        { name: 'var_tires', type: 'number' },
        { name: 'var_washing', type: 'number' },
        { name: 'km_initial', type: 'number' },
        { name: 'km_final', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('fleet_costs')
    app.delete(collection)
  },
)
