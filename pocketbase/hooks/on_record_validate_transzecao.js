onRecordValidate((e) => {
  const email = e.record.get('email')
  if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new ValidationError('email', 'O formato do e-mail é inválido.')
  }
  e.next()
}, 'transzecao')
