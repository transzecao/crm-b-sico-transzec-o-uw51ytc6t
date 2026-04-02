migrate(
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')
    let record

    try {
      record = app.findAuthRecordByEmail('transzecao', 'nikytafurchi@outlook.com')
    } catch (_) {
      record = new Record(transzecao)
      record.setEmail('nikytafurchi@outlook.com')
    }

    record.setPassword('SenhaMaster123')
    record.setVerified(true)
    record.set('role', 'Master')
    record.set('status', 'Ativo')

    app.save(record)
  },
  (app) => {
    // Optionally revert the seeding if needed
  },
)
