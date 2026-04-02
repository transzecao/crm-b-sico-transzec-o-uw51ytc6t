migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')

    let record
    try {
      record = app.findRecordById('transzecao', 'rnw4xx77v05fpck')
    } catch (_) {
      record = new Record(collection)
      record.set('id', 'rnw4xx77v05fpck')
    }

    record.setEmail('nikytafurchi@outlook.com')
    record.setPassword('SenhaMaster123')
    record.setVerified(true)
    record.set('role', 'master')
    record.set('status', 'active')

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findRecordById('transzecao', 'rnw4xx77v05fpck')
      app.delete(record)
    } catch (_) {}
  },
)
