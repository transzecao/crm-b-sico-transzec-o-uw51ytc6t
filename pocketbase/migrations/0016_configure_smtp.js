migrate(
  (app) => {
    try {
      if (typeof app.settings !== 'function') {
        console.log('app.settings is not available, skipping SMTP configuration.')
        return
      }

      const settings = app.settings()

      // Sender info
      settings.meta.senderName = 'Transzecão CRM'
      settings.meta.senderAddress = 'nicoly@transzecao.com.br'

      // SMTP Configuration
      settings.smtp.enabled = true
      settings.smtp.host = 'smtp.titan.email'
      settings.smtp.port = 465
      settings.smtp.username = 'nicoly@transzecao.com.br'
      settings.smtp.password = '2828Leli@'

      app.save(settings)
      console.log('SMTP settings configured successfully.')
    } catch (error) {
      console.log('Could not configure SMTP settings:', error)
    }
  },
  (app) => {
    try {
      if (typeof app.settings !== 'function') return

      const settings = app.settings()
      settings.smtp.enabled = false

      app.save(settings)
    } catch (error) {
      console.log('Could not revert SMTP settings:', error)
    }
  },
)
