migrate(
  (app) => {
    try {
      const transzecao = app.findCollectionByNameOrId('transzecao')
      const roleField = transzecao.fields.getByName('role')
      if (roleField && roleField.type === 'select') {
        if (!roleField.values.includes('Cliente')) {
          roleField.values.push('Cliente')
          app.save(transzecao)
        }
      }
    } catch (e) {
      console.log('Error updating transzecao role field:', e)
    }

    try {
      const invitations = app.findCollectionByNameOrId('invitations')
      const invRoleField = invitations.fields.getByName('role')
      if (invRoleField && invRoleField.type === 'select') {
        if (!invRoleField.values.includes('Cliente')) {
          invRoleField.values.push('Cliente')
          app.save(invitations)
        }
      }
    } catch (e) {
      console.log('Error updating invitations role field:', e)
    }
  },
  (app) => {
    try {
      const transzecao = app.findCollectionByNameOrId('transzecao')
      const roleField = transzecao.fields.getByName('role')
      if (roleField && roleField.type === 'select') {
        if (roleField.values.includes('Cliente')) {
          roleField.values = roleField.values.filter((v) => v !== 'Cliente')
          app.save(transzecao)
        }
      }
    } catch (e) {}

    try {
      const invitations = app.findCollectionByNameOrId('invitations')
      const invRoleField = invitations.fields.getByName('role')
      if (invRoleField && invRoleField.type === 'select') {
        if (invRoleField.values.includes('Cliente')) {
          invRoleField.values = invRoleField.values.filter((v) => v !== 'Cliente')
          app.save(invitations)
        }
      }
    } catch (e) {}
  },
)
