migrate(
  (app) => {
    // 1. Add Performance Indexes
    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.addIndex('idx_leads_status', false, 'status', '')
      leads.addIndex('idx_leads_company', false, 'company_id', '')
      app.save(leads)
    } catch (e) {}

    try {
      const msgs = app.findCollectionByNameOrId('whatsapp_messages')
      msgs.addIndex('idx_whatsapp_messages_created', false, 'created DESC', '')
      app.save(msgs)
    } catch (e) {}

    // 2. Security & Access Control: Principle of Least Privilege
    try {
      const users = app.findCollectionByNameOrId('transzecao')
      users.listRule = "@request.auth.role = 'master' || @request.auth.role = 'supervisor'"
      users.viewRule = "@request.auth.role = 'master' || id = @request.auth.id"
      users.createRule = "@request.auth.role = 'master'"
      users.updateRule =
        "@request.auth.role = 'master' || (id = @request.auth.id && @request.auth.role != 'cliente')"
      users.deleteRule = "@request.auth.role = 'master'"
      app.save(users)
    } catch (e) {}
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.removeIndex('idx_leads_status')
      leads.removeIndex('idx_leads_company')
      app.save(leads)
    } catch (e) {}

    try {
      const msgs = app.findCollectionByNameOrId('whatsapp_messages')
      msgs.removeIndex('idx_whatsapp_messages_created')
      app.save(msgs)
    } catch (e) {}
  },
)
