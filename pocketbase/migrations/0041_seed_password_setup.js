migrate(
  (app) => {
    try {
      const users = app.findRecordsByFilter('transzecao', '1=1', '', 1000, 0)
      for (let u of users) {
        u.set('requires_password_setup', true)
        app.save(u)
      }
    } catch (e) {
      // Ignore if no users found
    }
  },
  (app) => {
    try {
      const users = app.findRecordsByFilter('transzecao', '1=1', '', 1000, 0)
      for (let u of users) {
        u.set('requires_password_setup', false)
        app.save(u)
      }
    } catch (e) {}
  },
)
