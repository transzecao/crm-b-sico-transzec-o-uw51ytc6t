migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_costs')
    col.fields.add(new JSONField({ name: 'details' }))
    col.fields.add(new NumberField({ name: 'total_cost' }))
    col.fields.add(new NumberField({ name: 'estimated_km' }))
    col.fields.add(new NumberField({ name: 'cpk' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_costs')
    col.fields.removeByName('details')
    col.fields.removeByName('total_cost')
    col.fields.removeByName('estimated_km')
    col.fields.removeByName('cpk')
    app.save(col)
  },
)
