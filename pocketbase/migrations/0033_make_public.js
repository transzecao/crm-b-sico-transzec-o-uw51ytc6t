migrate(
  (app) => {
    const colNames = [
      'transzecao',
      'leads',
      'whatsapp_messages',
      'fleet_costs',
      'vehicles',
      'maintenance_logs',
      'fleet_settings',
      'settings_audit_logs',
      'drivers',
      'vinculos',
      'invitations',
      'login_history',
      'email_integrations',
      'action_logs',
      'companies',
      'pipelines',
      'finance',
      'reports',
      'collection_schedules',
      'route_plans',
      'routing_config',
    ]

    for (const name of colNames) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        col.createRule = ''
        col.updateRule = ''
        col.deleteRule = ''

        const fieldsToOptional = ['user_id', 'creator_id', 'created_by']
        for (const f of fieldsToOptional) {
          const field = col.fields.getByName(f)
          if (field) {
            field.required = false
          }
        }

        app.save(col)
      } catch (e) {
        console.log('Could not update collection: ' + name)
      }
    }

    const users = app.findCollectionByNameOrId('transzecao')
    let publicUser
    try {
      publicUser = app.findAuthRecordByEmail('transzecao', 'public@transzecao.com')
    } catch (_) {
      publicUser = new Record(users)
      publicUser.set('id', 'public000000000')
      publicUser.setEmail('public@transzecao.com')
      publicUser.setPassword('Skip@Pass123!')
      publicUser.setVerified(true)
      publicUser.set('name', 'Usuário Público')
      publicUser.set('role', 'Master')
      app.save(publicUser)
    }
  },
  (app) => {
    // Can be manually reverted by resetting rules and making fields required again
  },
)
