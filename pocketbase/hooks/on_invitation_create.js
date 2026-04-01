onRecordAfterCreateSuccess((e) => {
  const email = e.record.get('email')
  const token = e.record.get('token')

  // Construct the registration link with the dynamic token
  const appUrl = 'https://crm-basico-transzecao-62f0e.goskip.app'
  const registerLink = `${appUrl}/register?token=${token}`

  try {
    const mailer = require('mailer')

    // Build the email message
    const message = new mailer.Message({
      from: {
        address: 'nicoly@transzecao.com.br',
        name: 'Transzecão CRM',
      },
      to: [{ address: email }],
      subject: 'Convite para acessar o CRM da Transzecão',
      html: `Olá! Você foi convidado a criar uma conta no CRM da Transzecão. Clique no link abaixo para se cadastrar: ${registerLink}`,
    })

    // Send via configured SMTP
    $app.newMailClient().send(message)
    console.log(`Successfully sent invitation email to ${email}`)
    e.next()
  } catch (err) {
    console.log(`Failed to send invitation email to ${email}:`, err)

    // Rollback the creation if email fails to avoid broken invitations
    try {
      $app.delete(e.record)
    } catch (delErr) {
      console.log(`Failed to rollback invitation record:`, delErr)
    }

    throw new BadRequestError(
      `Falha ao enviar e-mail de convite. Verifique as configurações SMTP. Erro: ${err.message}`,
    )
  }
}, 'invitations')
