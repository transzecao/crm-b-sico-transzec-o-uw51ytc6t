onRecordAfterCreateSuccess((e) => {
  const leadId = e.record.get('lead_id')
  const lead = $app.findRecordById('leads', leadId)

  const messages = $app.findRecordsByFilter(
    'whatsapp_messages',
    `lead_id = '${leadId}'`,
    '-created',
    10,
    0,
  )

  let text = '🧠 Análise Inteligente da Conversa:\n\n'
  const inboundCount = messages.filter((m) => m.get('direction') === 'inbound').length
  const outboundCount = messages.filter((m) => m.get('direction') === 'outbound').length

  const lastMsg = messages[0]?.get('content') || ''
  const lowerMsg = lastMsg.toLowerCase()

  if (
    lowerMsg.includes('preço') ||
    lowerMsg.includes('valor') ||
    lowerMsg.includes('custo') ||
    lowerMsg.includes('frete')
  ) {
    text +=
      '⚠️ **Alerta de Sensibilidade a Preço:** O cliente demonstrou interesse focado nos custos e tarifas logísticas.\n'
    text +=
      '💡 *Ação Sugerida:* Enviar tabela atualizada e destacar o custo-benefício e a redução de avarias de nossas rotas.\n'
  } else if (
    lowerMsg.includes('parceiro') ||
    lowerMsg.includes('concorrente') ||
    lowerMsg.includes('já temos')
  ) {
    text +=
      '🛡️ **Objeção Identificada (Concorrência):** O cliente mencionou um parceiro atual ou bloqueio para troca imediata.\n'
    text +=
      '💡 *Ação Sugerida:* Apresentar um case de sucesso ou oferecer uma cotação pontual para comparar a eficiência da entrega.\n'
  } else {
    text +=
      '✅ **Engajamento Positivo:** O cliente está engajado na conversa e buscando informações operacionais e de rotas.\n'
    text +=
      '💡 *Ação Sugerida:* Tentar agendar uma ligação rápida (3-5 mins) para detalhar nossa malha logística.\n'
  }

  text += `\n📊 Resumo da Interação: ${inboundCount} mensagens recebidas, ${outboundCount} enviadas.\n`

  lead.set('ai_diagnosis', text)
  $app.save(lead)

  e.next()
}, 'whatsapp_messages')
