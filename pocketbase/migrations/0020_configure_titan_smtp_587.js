migrate(
  (app) => {
    const settings = app.settings()
    // Explicitly set port 587 and disable implicit TLS to utilize STARTTLS
    settings.meta.smtpPort = 587
    settings.meta.smtpTls = false // Tls: false / StartTLS: true configuration
    app.save(settings)
  },
  (app) => {
    const settings = app.settings()
    settings.meta.smtpPort = 465
    settings.meta.smtpTls = true
    app.save(settings)
  },
)
