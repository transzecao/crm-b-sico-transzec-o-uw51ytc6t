migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('email_integrations', 'service', 'Titan')
      record.set('port', 587)
      record.set('security', 'STARTTLS')
      app.save(record)
    } catch (_) {
      // If the Titan record doesn't exist yet, we can safely ignore
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('email_integrations', 'service', 'Titan')
      record.set('port', 465)
      record.set('security', 'SSL/TLS')
      app.save(record)
    } catch (_) {
      // Safe to ignore if not found
    }
  },
)
