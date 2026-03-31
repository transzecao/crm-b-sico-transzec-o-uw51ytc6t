migrate(
  (app) => {
    // 1. Create Drivers Collection
    const drivers = new Collection({
      name: 'drivers',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'local_id', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'cpf', type: 'text' },
        { name: 'cnh', type: 'text' },
        { name: 'base_salary', type: 'number' },
        { name: 'periculosidade', type: 'bool' },
        { name: 'vr_daily', type: 'number' },
        { name: 'vt_mensal', type: 'number' },
        { name: 'cesta_basica', type: 'number' },
        { name: 'seguro_vida', type: 'number' },
        { name: 'tox_anual', type: 'number' },
        { name: 'rat', type: 'number' },
        { name: 'encargos', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_drivers_local_id ON drivers (local_id)'],
    })
    app.save(drivers)

    // 2. Update Vehicles Collection with Financial/Operational Fields
    const vehicles = app.findCollectionByNameOrId('vehicles')
    vehicles.fields.add(new TextField({ name: 'local_id' }))
    vehicles.fields.add(new NumberField({ name: 'purchase_value' }))
    vehicles.fields.add(new NumberField({ name: 'resale_value' }))
    vehicles.fields.add(new NumberField({ name: 'ipva' }))
    vehicles.fields.add(new NumberField({ name: 'licenciamento' }))
    vehicles.fields.add(new NumberField({ name: 'seguro_casco' }))
    vehicles.fields.add(new NumberField({ name: 'rctrc' }))
    vehicles.fields.add(new NumberField({ name: 'rcfdc' }))
    vehicles.fields.add(new NumberField({ name: 'consumo' }))
    vehicles.fields.add(new NumberField({ name: 'diesel_price' }))
    vehicles.fields.add(new NumberField({ name: 'pneus_jogo' }))
    vehicles.fields.add(new NumberField({ name: 'km_pneus' }))
    vehicles.fields.add(new NumberField({ name: 'manutencao' }))
    vehicles.fields.add(new BoolField({ name: 'usa_arla' }))
    vehicles.fields.add(new NumberField({ name: 'limpeza' }))
    vehicles.fields.add(new NumberField({ name: 'averbacao' }))
    vehicles.fields.add(new NumberField({ name: 'consulta' }))
    vehicles.fields.add(new NumberField({ name: 'satelite' }))
    vehicles.fields.add(new NumberField({ name: 'year' }))
    vehicles.fields.add(new TextField({ name: 'vehicle_type' }))
    app.save(vehicles)

    // 3. Create Vinculos Collection
    const vinculos = new Collection({
      name: 'vinculos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'local_id', type: 'text', required: true },
        { name: 'driver_local_id', type: 'text', required: true },
        { name: 'vehicle_local_id', type: 'text', required: true },
        { name: 'km_mensal', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_vinculos_local_id ON vinculos (local_id)'],
    })
    app.save(vinculos)
  },
  (app) => {
    try {
      const vinculos = app.findCollectionByNameOrId('vinculos')
      app.delete(vinculos)
    } catch (e) {}

    try {
      const vehicles = app.findCollectionByNameOrId('vehicles')
      vehicles.fields.removeByName('local_id')
      vehicles.fields.removeByName('purchase_value')
      vehicles.fields.removeByName('resale_value')
      vehicles.fields.removeByName('ipva')
      vehicles.fields.removeByName('licenciamento')
      vehicles.fields.removeByName('seguro_casco')
      vehicles.fields.removeByName('rctrc')
      vehicles.fields.removeByName('rcfdc')
      vehicles.fields.removeByName('consumo')
      vehicles.fields.removeByName('diesel_price')
      vehicles.fields.removeByName('pneus_jogo')
      vehicles.fields.removeByName('km_pneus')
      vehicles.fields.removeByName('manutencao')
      vehicles.fields.removeByName('usa_arla')
      vehicles.fields.removeByName('limpeza')
      vehicles.fields.removeByName('averbacao')
      vehicles.fields.removeByName('consulta')
      vehicles.fields.removeByName('satelite')
      vehicles.fields.removeByName('year')
      vehicles.fields.removeByName('vehicle_type')
      app.save(vehicles)
    } catch (e) {}

    try {
      const drivers = app.findCollectionByNameOrId('drivers')
      app.delete(drivers)
    } catch (e) {}
  },
)
