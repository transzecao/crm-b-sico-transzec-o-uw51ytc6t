onRecordCreateRequest((e) => {
  const body = e.requestInfo().body
  const email = body.email

  if (email) {
    try {
      const existing = $app.findRecordsByFilter('invitations', `email = {:email}`, '', 100, 0, {
        email: email,
      })
      for (let i = 0; i < existing.length; i++) {
        $app.delete(existing[i])
      }
    } catch (err) {
      // Ignore if no previous invitations exist
    }
  }

  e.next()
}, 'invitations')
