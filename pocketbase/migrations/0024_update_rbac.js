migrate(
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')

    if (!transzecao.fields.getByName('setor')) {
      transzecao.fields.add(new TextField({ name: 'setor' }))
    }

    const roleField = transzecao.fields.getByName('role')
    if (roleField) {
      roleField.values = ['admin', 'supervisor', 'employee']
    }

    app.save(transzecao)

    const invitations = app.findCollectionByNameOrId('invitations')

    if (!invitations.fields.getByName('setor')) {
      invitations.fields.add(new TextField({ name: 'setor' }))
    }

    const invRoleField = invitations.fields.getByName('role')
    if (invRoleField) {
      invRoleField.values = ['admin', 'supervisor', 'employee']
    }

    app.save(invitations)
  },
  (app) => {
    const transzecao = app.findCollectionByNameOrId('transzecao')
    const tSetor = transzecao.fields.getByName('setor')
    if (tSetor) {
      transzecao.fields.removeByName('setor')
      app.save(transzecao)
    }

    const invitations = app.findCollectionByNameOrId('invitations')
    const iSetor = invitations.fields.getByName('setor')
    if (iSetor) {
      invitations.fields.removeByName('setor')
      app.save(invitations)
    }
  },
)
