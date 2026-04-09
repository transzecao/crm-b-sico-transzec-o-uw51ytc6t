migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('transzecao')
    try {
      const record = app.findAuthRecordByEmail('transzecao', 'nikytafurchi@outlook.com')
      record.set('role', 'master')
      app.save(record)
    } catch (_) {
      const record = new Record(users)
      record.setEmail('nikytafurchi@outlook.com')
      record.setPassword($secrets.get('MASTER_PASSWORD') || $security.randomString(16))
      record.setVerified(true)
      record.set('name', 'Nikyta Furchi')
      record.set('role', 'master')
      app.save(record)
    }
  },
  (app) => {},
)
