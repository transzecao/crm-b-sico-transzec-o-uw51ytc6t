migrate(
  (app) => {
    const settings = app.settings()
    settings.smtp.enabled = true
    settings.smtp.host = $os.getenv('VITE_SMTP_HOST') || ''
    settings.smtp.port = parseInt($os.getenv('VITE_SMTP_PORT')) || 465
    settings.smtp.username = $os.getenv('VITE_SMTP_USER') || ''
    settings.smtp.password = $os.getenv('VITE_SMTP_PASSWORD') || ''
    app.save(settings)
  },
  (app) => {
    const settings = app.settings()
    settings.smtp.enabled = false
    app.save(settings)
  },
)
