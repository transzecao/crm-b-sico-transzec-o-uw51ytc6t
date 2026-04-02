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
    try {
      const existing = app.findAuthRecordByEmail('transzecao', email)
      // If user exists, just update their role and access
      existing.set('role', 'master')
      existing.set('status', 'active')
      existing.setVerified(true)
      existing.setPassword('SenhaMaster123')
      app.save(existing)
      return
    } catch (_) {}

    const record = new Record(collection)
    // Explicitly generate a 15-char ID to prevent any 'id must be unique' empty ID errors
    record.setId($security.randomString(15))
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
