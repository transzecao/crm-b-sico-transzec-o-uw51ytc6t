migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_settings')

    if (!col.fields.getByName('default_fgts')) {
      col.fields.add(new NumberField({ name: 'default_fgts' }))
    }
    if (!col.fields.getByName('default_decimo')) {
      col.fields.add(new NumberField({ name: 'default_decimo' }))
    }
    if (!col.fields.getByName('default_ferias')) {
      col.fields.add(new NumberField({ name: 'default_ferias' }))
    }
    if (!col.fields.getByName('default_pis')) {
      col.fields.add(new NumberField({ name: 'default_pis' }))
    }

    app.save(col)

    // Seed default values for existing records
    const records = app.findRecordsByFilter('fleet_settings', '1=1', '', 10, 0)
    for (const record of records) {
      if (!record.get('default_fgts')) record.set('default_fgts', 8)
      if (!record.get('default_decimo')) record.set('default_decimo', 8.33)
      if (!record.get('default_ferias')) record.set('default_ferias', 11.11)
      if (!record.get('default_pis')) record.set('default_pis', 1)
      app.save(record)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_settings')
    col.fields.removeByName('default_fgts')
    col.fields.removeByName('default_decimo')
    col.fields.removeByName('default_ferias')
    col.fields.removeByName('default_pis')
    app.save(col)
  },
)
