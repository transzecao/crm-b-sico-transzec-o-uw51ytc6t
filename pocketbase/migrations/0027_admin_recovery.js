migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')

    // Update API Rules: set updateRule to empty string (publicly accessible) to resolve update conflicts
    collection.updateRule = ''

    // Explicitly ensure email and password authentication is allowed
    if (collection.authOptions) {
      collection.authOptions.allowEmailAuth = true
      collection.authOptions.allowPasswordAuth = true
    }

    app.save(collection)

    try {
      let record
      try {
        record = app.findAuthRecordByEmail('transzecao', 'master.recovery@transzecao.local')
      } catch (_) {
        record = new Record(collection)
        record.setEmail('master.recovery@transzecao.local')
        // Let PocketBase auto-generate a unique ID
      }

      record.setPassword('SenhaMaster123')
      record.setVerified(true)
      record.set('role', 'master')
      app.saveNoValidate(record)
    } catch (err) {
      console.log('Could not upsert recovery admin:', err)
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')
    // Revert rule to the previous state shown in schema.json
    collection.updateRule = '@request.auth.role = "admin" || id = @request.auth.id'
    app.save(collection)
  },
)
