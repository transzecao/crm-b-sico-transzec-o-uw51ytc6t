migrate(
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')

    if (!transzecao.fields.getByName('requires_password_setup')) {
      transzecao.fields.add(new BoolField({ name: 'requires_password_setup' }))
      app.save(transzecao)
    }

    const usersToSeed = [
      {
        email: 'master@transzecao.com',
        name: 'Admin Master',
        role: 'DIRETOR',
        status: 'active',
        position: 'Diretor',
      },
      {
        email: 'financeiro@transzecao.com',
        name: 'João Financeiro',
        role: 'SUPERVISOR_FINANCEIRO',
        status: 'active',
        position: 'Gerente Financeiro',
      },
      {
        email: 'comercial@transzecao.com',
        name: 'Maria Comercial',
        role: 'SUPERVISOR_COMERCIAL',
        status: 'active',
        position: 'Gerente Comercial',
      },
      {
        email: 'coleta@transzecao.com',
        name: 'Carlos Coleta',
        role: 'SUPERVISOR_COLETA',
        status: 'inactive',
        position: 'Coordenador',
      },
    ]

    for (let u of usersToSeed) {
      try {
        app.findAuthRecordByEmail('transzecao', u.email)
      } catch (_) {
        let record = new Record(transzecao)
        record.setEmail(u.email)
        record.setPassword($security.randomString(16))
        record.setVerified(true)
        record.set('name', u.name)
        record.set('role', u.role)
        record.set('status', u.status)
        record.set('position', u.position)
        record.set('requires_password_setup', true)
        record.set(
          'last_activity',
          new Date().toISOString().replace('T', ' ').substring(0, 19) + 'Z',
        )
        app.save(record)
      }
    }

    try {
      const masterUser = app.findAuthRecordByEmail('transzecao', 'master@transzecao.com')
      const historyCol = app.findCollectionByNameOrId('login_history')
      let hRec = new Record(historyCol)
      hRec.set('user_id', masterUser.id)
      hRec.set('ip_address', '192.168.1.100')
      app.save(hRec)
    } catch (e) {}

    const invCol = app.findCollectionByNameOrId('invitations')
    try {
      app.findFirstRecordByData('invitations', 'email', 'novo@cliente.com')
    } catch (_) {
      let iRec = new Record(invCol)
      iRec.set('email', 'novo@cliente.com')
      iRec.set('role', 'CLIENTE')
      iRec.set('token', 'xyz123')
      iRec.set('status', 'sent')
      app.save(iRec)
    }
  },
  (app) => {},
)
