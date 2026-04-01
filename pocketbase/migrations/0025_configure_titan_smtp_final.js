migrate(
  (app) => {
    const settings = app.settings()

    settings.smtp.enabled = true
    settings.smtp.host = 'smtp.titan.email'
    settings.smtp.port = 465
    settings.smtp.username = 'nicoly@transzecao.com.br'

    settings.meta.senderName = 'Transzecão CRM'
    settings.meta.senderAddress = 'nicoly@transzecao.com.br'

    app.save(settings)
  },
  (app) => {
    const settings = app.settings()
    settings.smtp.enabled = false
    app.save(settings)
  },
)
