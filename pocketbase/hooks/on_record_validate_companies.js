onRecordValidate((e) => {
  const cnpj = e.record.get('cnpj')
  if (cnpj && !/^\d{14}$/.test(cnpj)) {
    throw new ValidationError('cnpj', 'O CNPJ deve conter exatamente 14 dígitos.')
  }
  e.next()
}, 'companies')
