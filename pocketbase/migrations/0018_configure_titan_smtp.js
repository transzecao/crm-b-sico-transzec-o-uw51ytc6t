migrate(
  (app) => {
    // Update PB System SMTP Settings for Titan Integration
    let settings = app.settings()
    settings.meta.senderName = 'Transzecão CRM'
    settings.meta.senderAddress = 'nicoly@transzecao.com.br'
    settings.smtp.enabled = true
    settings.smtp.host = 'smtp.titan.email'
    settings.smtp.port = 465
    settings.smtp.username = 'nicoly@transzecao.com.br'
    settings.smtp.password = '2828@Leli'
    app.save(settings)

    // Create a collection for email integration settings (IMAP Reference Setup)
    try {
      app.findCollectionByNameOrId('email_integrations')
    } catch (_) {
      const collection = new Collection({
        name: 'email_integrations',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'service', type: 'text', required: true },
          { name: 'type', type: 'text', required: true },
          { name: 'host', type: 'text', required: true },
          { name: 'port', type: 'number', required: true },
          { name: 'security', type: 'text', required: true },
          { name: 'username', type: 'text', required: true },
          { name: 'password', type: 'text', required: true },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(collection)
    }

    // Seed IMAP Reference configuration
    const col = app.findCollectionByNameOrId('email_integrations')
    try {
      app.findFirstRecordByData('email_integrations', 'type', 'IMAP')
    } catch (_) {
      const imapRecord = new Record(col)
      imapRecord.set('service', 'Titan')
      imapRecord.set('type', 'IMAP')
      imapRecord.set('host', 'imap.titan.email')
      imapRecord.set('port', 993)
      imapRecord.set('security', 'SSL')
      imapRecord.set('username', 'nicoly@transzecao.com.br')
      imapRecord.set('password', '2828@Leli')
      app.save(imapRecord)
    }
  },
  (app) => {
    let settings = app.settings()
    settings.smtp.enabled = false
    app.save(settings)

    try {
      const col = app.findCollectionByNameOrId('email_integrations')
      app.delete(col)
    } catch (_) {}
  },
)
