migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter('transzecao', '1=1', '', 1000, 0)
      for (let record of records) {
        if (!record.get('requires_password_setup')) {
          record.set('requires_password_setup', true)
          app.save(record)
        }
      }
    } catch (e) {
      console.log('Error updating transzecao requires_password_setup:', e)
    }
  },
  (app) => {
    // down migration
  },
)
