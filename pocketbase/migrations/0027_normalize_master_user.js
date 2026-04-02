migrate(
  (app) => {
    // 1. Update API rules for transzecao collection to grant proper master access
    const col = app.findCollectionByNameOrId('transzecao')
    col.listRule = "@request.auth.role = 'master' || id = @request.auth.id"
    col.createRule = "@request.auth.role = 'master'"
    col.updateRule = "@request.auth.role = 'master' || id = @request.auth.id"
    col.deleteRule = "@request.auth.role = 'master' || id = @request.auth.id"
    app.save(col)

    // 2. Normalize master user nicoly@transzecao.com.br
    try {
      const user = app.findAuthRecordByEmail('transzecao', 'nicoly@transzecao.com.br')
      user.set('role', 'master')
      user.set('status', 'active')
      user.setVerified(true)
      app.save(user)
    } catch (err) {
      console.log('Master user nicoly@transzecao.com.br not found. Skipping user normalization.')
    }

    // 3. Configure Titan SMTP directly on PocketBase Settings to ensure active mail delivery
    try {
      const settings = app.settings()
      settings.smtp.enabled = true
      settings.smtp.host = 'smtp.titan.email'
      settings.smtp.port = 465
      settings.meta.senderName = 'Transzecão CRM'
      settings.meta.senderAddress = 'no-reply@transzecao.com.br'
      app.save(settings)
    } catch (err) {
      console.log('Could not update SMTP settings automatically:', err)
    }
  },
  (app) => {
    // Revert the API rules
    try {
      const col = app.findCollectionByNameOrId('transzecao')
      col.listRule = '@request.auth.role = "admin" || id = @request.auth.id'
      col.createRule = '@request.auth.role = "admin"'
      col.updateRule = '@request.auth.role = "admin" || id = @request.auth.id'
      col.deleteRule = '@request.auth.role = "admin" || id = @request.auth.id'
      app.save(col)
    } catch (err) {}
  },
)
