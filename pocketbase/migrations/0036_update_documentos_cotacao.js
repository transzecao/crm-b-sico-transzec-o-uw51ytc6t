migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('documentos_cotacao')
    if (!col.fields.getByName('numero_cotacao')) {
      col.fields.add(new TextField({ name: 'numero_cotacao' }))
    }
    if (!col.fields.getByName('origem')) {
      col.fields.add(new TextField({ name: 'origem' }))
    }
    if (!col.fields.getByName('destino')) {
      col.fields.add(new TextField({ name: 'destino' }))
    }
    if (!col.fields.getByName('peso')) {
      col.fields.add(new NumberField({ name: 'peso' }))
    }
    if (!col.fields.getByName('valor')) {
      col.fields.add(new NumberField({ name: 'valor' }))
    }
    if (!col.fields.getByName('detalhes')) {
      col.fields.add(new JSONField({ name: 'detalhes' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('documentos_cotacao')
    col.fields.removeByName('numero_cotacao')
    col.fields.removeByName('origem')
    col.fields.removeByName('destino')
    col.fields.removeByName('peso')
    col.fields.removeByName('valor')
    col.fields.removeByName('detalhes')
    app.save(col)
  },
)
