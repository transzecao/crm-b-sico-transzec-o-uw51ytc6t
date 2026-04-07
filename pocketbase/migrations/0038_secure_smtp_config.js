migrate(
  (app) => {
    const configs = app.findRecordsByFilter('email_integrations', '1=1', '', 100, 0)
    for (const record of configs) {
      if (record.get('service') === 'titan') {
        const securePass = $os.getenv('VITE_SMTP_PASSWORD')
        if (securePass) {
          record.set('password', securePass)
          app.save(record)
        }
      }
    }

    try {
      const user = app.findAuthRecordByEmail('transzecao', 'nikytafurchi@outlook.com')
      if (user) {
        user.setPassword($security.randomString(20))
        app.save(user)
      }
    } catch (e) {}
  },
  (app) => {},
)
