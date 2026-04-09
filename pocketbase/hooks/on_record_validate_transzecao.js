onRecordValidate((e) => {
  try {
    const email = e.record.get('email')
    if (email) {
      const sanitized = email.trim().toLowerCase()
      e.record.set('email', sanitized)

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!regex.test(sanitized)) {
        throw new ValidationError('email', 'O formato do e-mail é inválido.')
      }

      const blockedDomains = ['example.com', 'test.com', 'mailinator.com']
      const domain = sanitized.split('@')[1]
      if (domain && blockedDomains.includes(domain)) {
        throw new ValidationError('email', 'Domínio de e-mail não permitido.')
      }
    }
    e.next()
  } catch (error) {
    console.error(
      JSON.stringify({
        type: 'Validation Error',
        timestamp: new Date().toISOString(),
      }),
    )
    throw error
  }
}, 'transzecao')
