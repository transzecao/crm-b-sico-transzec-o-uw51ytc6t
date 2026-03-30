migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    const lead = new Record(leads)
    lead.set('name', 'Industrial SP Metalurgia')
    lead.set('segment', 'Metalúrgico')
    lead.set('cnpj_id', '08.237.002/0042-89')
    lead.set('status', 'Prospection')
    lead.set('ai_diagnosis', 'Aguardando histórico de mensagens para gerar diagnóstico.')
    app.save(lead)

    const messages = app.findCollectionByNameOrId('whatsapp_messages')
    const msg1 = new Record(messages)
    msg1.set('lead_id', lead.id)
    msg1.set('content', 'Olá, gostaria de saber mais sobre as rotas de entrega para Campinas.')
    msg1.set('direction', 'inbound')
    app.save(msg1)

    const msg2 = new Record(messages)
    msg2.set('lead_id', lead.id)
    msg2.set(
      'content',
      'Claro! Nós temos saídas diárias para Campinas. Qual o volume médio da sua carga?',
    )
    msg2.set('direction', 'outbound')
    app.save(msg2)
  },
  (app) => {
    const records = app.findRecordsByFilter('leads', "cnpj_id = '08.237.002/0042-89'", '', 1, 0)
    if (records.length > 0) {
      app.delete(records[0])
    }
  },
)
