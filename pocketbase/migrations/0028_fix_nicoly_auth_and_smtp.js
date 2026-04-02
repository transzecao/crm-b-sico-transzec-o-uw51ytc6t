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
    let record = null
    try {
      record = app.findAuthRecordByEmail('transzecao', 'nicoly@transzecao.com.br')
    } catch (_) {
      try {
        const records = app.findRecordsByFilter(
          'transzecao',
          "email ~ 'nicoly@transzecao.com.br'",
          '',
          1,
          0,
        )
        if (records && records.length > 0) {
          record = records[0]
        }
      } catch (_) {}
    }

    if (record) {
      record.setPassword('SenhaMaster123')
      record.setVerified(true)
      record.set('role', 'master')
      if (!record.get('name')) {
        record.set('name', 'Nicoly')
      }
      try {
        app.save(record)
      } catch (e) {
        console.log('Failed to update existing master record:', e)
      }
    } else {
      try {
        record = new Record(collection)
        record.setEmail('nicoly@transzecao.com.br')
        record.setPassword('SenhaMaster123')
        record.setVerified(true)
        record.set('role', 'master')
        record.set('name', 'Nicoly')
        app.save(record)
      } catch (e) {
        console.log('Failed to create master record (possibly already exists):', e)
      }
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
