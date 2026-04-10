migrate(
  (app) => {
    // 1. Delete legacy collections
    const legacyCollections = ['collection_schedules', 'route_plans', 'routing_config']
    for (const name of legacyCollections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }

    // 2. Update transzecao (users) roles
    try {
      const transzecaoCol = app.findCollectionByNameOrId('transzecao')
      const roleField = transzecaoCol.fields.getByName('role')
      if (roleField) {
        roleField.values = [
          'MASTER',
          'DIRETOR',
          'SUPERVISOR_FINANCEIRO',
          'SUPERVISOR_COLETA',
          'SUPERVISOR_COMERCIAL',
          'FUNCIONARIO_FINANCEIRO',
          'FUNCIONARIO_COLETA',
          'FUNCIONARIO_PROSPECCAO',
          'FUNCIONARIO_COMERCIAL',
          'FUNCIONARIO_MARKETING',
          'CLIENTE',
          'SUPORTE_TECNICO',
        ]
        app.save(transzecaoCol)
      }

      const records = app.findRecordsByFilter('transzecao', "id != ''")
      for (const user of records) {
        const oldRole = user.get('role') || ''
        let newRole = 'CLIENTE'
        if (oldRole.match(/master|desenvolvedor/i)) newRole = 'MASTER'
        else if (oldRole.match(/diretor/i)) newRole = 'DIRETOR'
        else if (oldRole.match(/supervisor.*fin/i)) newRole = 'SUPERVISOR_FINANCEIRO'
        else if (oldRole.match(/supervisor.*com/i)) newRole = 'SUPERVISOR_COMERCIAL'
        else if (oldRole.match(/supervisor.*col/i)) newRole = 'SUPERVISOR_COLETA'
        else if (oldRole.match(/func.*fin/i)) newRole = 'FUNCIONARIO_FINANCEIRO'
        else if (oldRole.match(/func.*com/i)) newRole = 'FUNCIONARIO_COMERCIAL'
        else if (oldRole.match(/func.*pro/i)) newRole = 'FUNCIONARIO_PROSPECCAO'
        else if (oldRole.match(/func.*mark/i)) newRole = 'FUNCIONARIO_MARKETING'
        else if (oldRole.match(/func.*col/i)) newRole = 'FUNCIONARIO_COLETA'
        else if (oldRole.match(/suporte/i)) newRole = 'SUPORTE_TECNICO'
        else if (oldRole.match(/cliente/i)) newRole = 'CLIENTE'

        user.set('role', newRole)
        app.saveNoValidate(user)
      }
    } catch (_) {}

    // 3. Update roles in invitations
    try {
      const invCol = app.findCollectionByNameOrId('invitations')
      const invRoleField = invCol.fields.getByName('role')
      if (invRoleField) {
        invRoleField.values = [
          'MASTER',
          'DIRETOR',
          'SUPERVISOR_FINANCEIRO',
          'SUPERVISOR_COLETA',
          'SUPERVISOR_COMERCIAL',
          'FUNCIONARIO_FINANCEIRO',
          'FUNCIONARIO_COLETA',
          'FUNCIONARIO_PROSPECCAO',
          'FUNCIONARIO_COMERCIAL',
          'FUNCIONARIO_MARKETING',
          'CLIENTE',
          'SUPORTE_TECNICO',
        ]
        app.save(invCol)

        const invs = app.findRecordsByFilter('invitations', "id != ''")
        for (const inv of invs) {
          const oldRole = inv.get('role') || ''
          let newRole = 'CLIENTE'
          if (oldRole.match(/master/i)) newRole = 'MASTER'
          else if (oldRole.match(/sup.*fin/i)) newRole = 'SUPERVISOR_FINANCEIRO'
          else if (oldRole.match(/sup.*com/i)) newRole = 'SUPERVISOR_COMERCIAL'
          else if (oldRole.match(/sup.*col/i)) newRole = 'SUPERVISOR_COLETA'
          else if (oldRole.match(/func.*fin/i)) newRole = 'FUNCIONARIO_FINANCEIRO'
          else if (oldRole.match(/func.*com/i)) newRole = 'FUNCIONARIO_COMERCIAL'
          else if (oldRole.match(/func.*pro/i)) newRole = 'FUNCIONARIO_PROSPECCAO'
          else if (oldRole.match(/func.*mark/i)) newRole = 'FUNCIONARIO_MARKETING'
          else if (oldRole.match(/func.*col/i)) newRole = 'FUNCIONARIO_COLETA'
          else if (oldRole.match(/diretor/i)) newRole = 'DIRETOR'
          else if (oldRole.match(/suporte/i)) newRole = 'SUPORTE_TECNICO'

          inv.set('role', newRole)
          app.saveNoValidate(inv)
        }
      }
    } catch (_) {}

    // 4. Global API rules updates
    const allCols = app.findAllCollections()
    for (const c of allCols) {
      let changed = false
      ;['listRule', 'viewRule', 'createRule', 'updateRule', 'deleteRule'].forEach((ruleName) => {
        if (c[ruleName]) {
          const oldRule = c[ruleName]
          let newRule = oldRule.replace(/'cliente'/g, "'CLIENTE'").replace(/'master'/g, "'MASTER'")
          if (newRule !== oldRule) {
            c[ruleName] = newRule
            changed = true
          }
        }
      })
      if (changed) {
        app.save(c)
      }
    }
  },
  (app) => {
    // Empty down migration as dropping and data transformations are destructive
  },
)
