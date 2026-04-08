migrate(
  (app) => {
    try {
      const skipUser = app.findAuthRecordByEmail('transzecao', 'nikytafurchi@outlook.com')
      skipUser.setPassword($security.randomString(16))
      skipUser.set('requires_password_setup', true)
      app.save(skipUser)
    } catch (_) {}

    try {
      const masterUser = app.findAuthRecordByEmail('transzecao', 'master@transzecao.com')
      masterUser.setPassword($security.randomString(16))
      masterUser.set('requires_password_setup', true)
      app.save(masterUser)
    } catch (_) {}
  },
  (app) => {},
)
