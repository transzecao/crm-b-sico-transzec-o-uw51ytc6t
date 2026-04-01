migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'invitations',
        "email = 'bruna@transzecao.com.br'",
        '',
        100,
        0,
      )
      for (const record of records) {
        app.delete(record)
      }
    } catch (err) {
      console.log('Cleanup skipped or failed:', err.message)
    }

    try {
      const collection = app.findCollectionByNameOrId('invitations')
      collection.createRule = "@request.auth.id != ''"
      app.save(collection)
    } catch (err) {
      console.log('Failed to update invitations rules:', err.message)
    }
  },
  (app) => {
    // No revert needed
  },
)
