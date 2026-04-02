migrate(
  (app) => {
    // 1. Update Permission Rules for transzecao
    const collection = app.findCollectionByNameOrId('transzecao')
    collection.updateRule = "@request.auth.role = 'master' || id = @request.auth.id"
    app.save(collection)

    // 2. Configure Titan Mail SMTP Integration
    const settings = app.settings()
    settings.smtp.enabled = true
    settings.smtp.host = 'smtp.titan.email'
    settings.smtp.port = 587
    // Note: PocketBase uses STARTTLS automatically for port 587
    app.save(settings)

    // 3. Master Account Restoration (User Validation & Credential Sync)
    try {
      const record = app.findAuthRecordByEmail('transzecao', 'nicoly@transzecao.com.br')
      record.setPassword('SenhaMaster123')
      record.setVerified(true)
      record.set('role', 'master')
      app.save(record)
    } catch (_) {
      const record = new Record(collection)
      record.setEmail('nicoly@transzecao.com.br')
      record.setPassword('SenhaMaster123')
      record.setVerified(true)
      record.set('role', 'master')
      record.set('name', 'Nicoly')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('transzecao', 'nicoly@transzecao.com.br')
      app.delete(record)
    } catch (_) {
      // Ignore if not found
    }
  },
)
