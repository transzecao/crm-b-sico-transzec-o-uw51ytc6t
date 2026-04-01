migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('vehicles')
    if (!collection.fields.getByName('custom_fields')) {
      collection.fields.add(new JSONField({ name: 'custom_fields' }))
      app.save(collection)
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('vehicles')
    if (collection.fields.getByName('custom_fields')) {
      collection.fields.removeByName('custom_fields')
      app.save(collection)
    }
  },
)
