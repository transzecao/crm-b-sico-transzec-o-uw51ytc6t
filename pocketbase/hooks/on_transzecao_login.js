onRecordAuthRequest((e) => {
  e.next()

  if (e.record) {
    try {
      const loginHistory = $app.findCollectionByNameOrId('login_history')
      const record = new Record(loginHistory)
      record.set('user_id', e.record.id)

      const ip = e.requestInfo().clientIp || e.request.remoteAddr || 'unknown'
      record.set('ip_address', ip)

      $app.save(record)
    } catch (err) {
      console.log('Error logging login history', err)
    }
  }
}, 'transzecao')
