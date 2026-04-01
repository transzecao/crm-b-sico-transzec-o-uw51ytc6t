onRecordUpdate((e) => {
  const original = e.record.originalCopy()
  if (original) {
    const oldRole = original.get('role')
    const newRole = e.record.get('role')

    if (oldRole !== newRole) {
      const auditCol = $app.findCollectionByNameOrId('settings_audit_logs')
      const auditRec = new Record(auditCol)
      auditRec.set('parameter', 'user_role_change')
      auditRec.set('old_value', oldRole || 'none')
      auditRec.set('new_value', newRole || 'none')
      auditRec.set('impact', `Role changed for ${e.record.email()}`)
      if (e.requestInfo && e.requestInfo().auth) {
        auditRec.set('user_id', e.requestInfo().auth.id)
      }
      $app.saveNoValidate(auditRec)
    }
  }
  e.next()
}, 'transzecao')
