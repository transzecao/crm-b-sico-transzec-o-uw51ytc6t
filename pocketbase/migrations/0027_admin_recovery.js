migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')

    // Update API Rules to permit administrative updates and resolve the "Failed to update record" error
    collection.updateRule = '@request.auth.role = "master" || id = @request.auth.id'

    // Explicitly ensure email and password authentication is allowed
    if (collection.authOptions) {
      collection.authOptions.allowEmailAuth = true
      collection.authOptions.allowPasswordAuth = true
    }

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')
    collection.updateRule = '@request.auth.role = "admin" || id = @request.auth.id'
    app.save(collection)
  },
)
