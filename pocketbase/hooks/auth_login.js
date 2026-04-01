onRecordAuthRequest((e) => {
  const user = e.record
  const ip = e.requestInfo().remoteIp || 'unknown'

  user.set('last_activity', new Date().toISOString().replace('T', ' ').substring(0, 19) + 'Z')
  if (!user.get('status')) {
    user.set('status', 'active')
  }
  $app.saveNoValidate(user)

  const loginHistoryCol = $app.findCollectionByNameOrId('login_history')
  const historyRecord = new Record(loginHistoryCol)
  historyRecord.set('user_id', user.id)
  historyRecord.set('ip_address', ip)
  $app.save(historyRecord)

  console.log(`[Notification] Login notification sent to ${user.email()}`)

  e.next()
}, 'transzecao')
