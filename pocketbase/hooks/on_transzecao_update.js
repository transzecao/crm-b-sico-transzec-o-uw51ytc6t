onRecordUpdateRequest((e) => {
  const oldRecord = $app.findRecordById('transzecao', e.record.id)
  e.next()

  try {
    const actionLogs = $app.findCollectionByNameOrId('action_logs')
    const record = new Record(actionLogs)

    let action = 'data_edit'
    let desc = 'Usuário atualizado'

    if (oldRecord.get('passwordHash') !== e.record.get('passwordHash')) {
      action = 'password_change'
      desc = 'Senha alterada'
    } else if (oldRecord.get('role') !== e.record.get('role')) {
      action = 'role_change'
      desc = `Role alterada de ${oldRecord.get('role')} para ${e.record.get('role')}`
    }

    record.set('user_id', e.auth?.id || e.record.id)
    record.set('action_type', action)
    record.set('description', desc)
    $app.save(record)
  } catch (err) {
    console.log('Error logging action', err)
  }
}, 'transzecao')
