migrate(
  (app) => {
    // 1. Update transzecao collection rules
    const collection = app.findCollectionByNameOrId('transzecao')
    collection.updateRule = '@request.auth.role = "master" || id = @request.auth.id'

    // Explicitly ensure email and password authentication is allowed
    if (collection.authOptions) {
      collection.authOptions.allowEmailAuth = true
      collection.authOptions.allowPasswordAuth = true
    }

    app.save(collection)

    // 2. Safely seed the master user without hardcoding an ID to avoid conflicts
    const email = 'nikytafurchi@outlook.com'
    let record
    try {
      record = app.findAuthRecordByEmail('transzecao', email)
    } catch (_) {
      record = new Record(collection)
      // PocketBase will automatically generate a valid, unique 15-char ID
    }

    record.setEmail(email)
    record.setPassword('SenhaMaster123')
    record.setVerified(true)
    record.set('role', 'master')
    record.set('status', 'active')
    record.set('name', 'Admin Master')

    app.save(record)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('transzecao')
      collection.updateRule = '@request.auth.role = "admin" || id = @request.auth.id'
      app.save(collection)
    } catch (_) {}

    try {
      const record = app.findAuthRecordByEmail('transzecao', 'nikytafurchi@outlook.com')
      app.delete(record)
    } catch (_) {}
  },
)
