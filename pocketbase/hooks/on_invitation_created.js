onRecordAfterCreateSuccess((e) => {
  const record = e.record
  if (record.get('status') === 'sent') {
    const email = record.get('email')
    const token = record.get('token')
    const role = record.get('role')

    try {
      const link = `https://goskip.app/register?token=${token}`
      const message = new MailerMessage({
        from: {
          address: 'no-reply@transzecao.com.br',
          name: 'Transzecão CRM',
        },
        to: [{ address: email }],
        subject: 'Convite para Transzecão CRM',
        html: `<p>Você foi convidado para acessar o sistema com o perfil de <b>${role}</b>.</p>
               <p>Clique no link abaixo para criar sua senha e acessar:</p>
               <p><a href="${link}">${link}</a></p>`,
      })
      $app.newMailClient().send(message)
    } catch (err) {
      console.log('Failed to send email', err)
    }
  }
  e.next()
}, 'invitations')
