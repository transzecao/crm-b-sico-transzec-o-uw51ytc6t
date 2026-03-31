migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_settings')

    if (!col.fields.getByName('var_cost_max_percent')) {
      col.fields.add(new NumberField({ name: 'var_cost_max_percent' }))
    }
    if (!col.fields.getByName('das_rate')) {
      col.fields.add(new NumberField({ name: 'das_rate' }))
    }
    if (!col.fields.getByName('cte_cost')) {
      col.fields.add(new NumberField({ name: 'cte_cost' }))
    }
    if (!col.fields.getByName('docs_count')) {
      col.fields.add(new NumberField({ name: 'docs_count' }))
    }
    if (!col.fields.getByName('taxas_fiscal')) {
      col.fields.add(new NumberField({ name: 'taxas_fiscal' }))
    }
    if (!col.fields.getByName('dead_km')) {
      col.fields.add(new NumberField({ name: 'dead_km' }))
    }
    if (!col.fields.getByName('vr_daily')) {
      col.fields.add(new NumberField({ name: 'vr_daily' }))
    }
    if (!col.fields.getByName('cesta_basica')) {
      col.fields.add(new NumberField({ name: 'cesta_basica' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_settings')

    col.fields.removeByName('var_cost_max_percent')
    col.fields.removeByName('das_rate')
    col.fields.removeByName('cte_cost')
    col.fields.removeByName('docs_count')
    col.fields.removeByName('taxas_fiscal')
    col.fields.removeByName('dead_km')
    col.fields.removeByName('vr_daily')
    col.fields.removeByName('cesta_basica')

    app.save(col)
  },
)
