onRecordAfterCreateSuccess((e) => {
  const email = e.record.get('email')
  const token = e.record.get('token')

  // Construct the registration link with the dynamic token
  const appUrl = 'https://crm-basico-transzecao-62f0e.goskip.app'
  const registerLink = `${appUrl}/register?token=${token}`

  try {
    // Build the email message using MailerMessage globally available in PB JSVM v0.22+
    const message = new MailerMessage({
      from: {
        address: 'nicoly@transzecao.com.br',
        name: 'Transzecão CRM',
      },
      to: [{ address: email }],
      subject: 'Convite para acessar o CRM da Transzecão',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">Bem-vindo(a) à Transzecão!</h2>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">
            Olá, você foi convidado(a) a criar uma conta no CRM da Transzecão.
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">
            Clique no botão abaixo para se cadastrar e acessar a plataforma:
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${registerLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Aceitar Convite e Cadastrar
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
            Se você não esperava por este convite, pode ignorar este e-mail.
          </p>
        </div>
      `,
    })

    // Send via configured SMTP
    $app.newMailClient().send(message)
    console.log(
      `Successfully sent invitation email to ${email} via Titan SMTP (port 587/STARTTLS).`,
    )
  } catch (err) {
    console.log(`Failed to send invitation email to ${email}:`, err)

    // Log specific SMTP errors to assist debugging
    const errMsg = (err.message || '').toLowerCase()
    if (errMsg.includes('auth') || errMsg.includes('credentials')) {
      console.log(
        `SMTP Error: Authentication failed with Titan server on port 587. Details: ${err.message}`,
      )
    } else if (errMsg.includes('timeout')) {
      console.log(
        `SMTP Error: Connection timed out while trying to reach smtp.titan.email on port 587. Details: ${err.message}`,
      )
    } else {
      console.log(`SMTP Error: Email dispatch failed. Response code/message: ${err.message}`)
    }

    // Decoupled Email Delivery: Do NOT delete the record or throw an error.
    // Allow the record to be saved so the invitation can be tracked or re-sent later.
  }

  e.next()
}, 'invitations')
