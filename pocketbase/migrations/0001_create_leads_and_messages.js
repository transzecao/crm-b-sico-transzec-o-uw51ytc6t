migrate(
  (app) => {
    const leads = new Collection({
      name: 'leads',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'segment', type: 'text' },
        { name: 'cnpj_id', type: 'text' },
        { name: 'ai_diagnosis', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'company_id', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_status ON leads (status)',
        'CREATE INDEX idx_leads_segment ON leads (segment)',
        'CREATE INDEX idx_leads_company ON leads (company_id)',
        'CREATE INDEX idx_leads_created ON leads (created DESC)',
      ],
    })
    app.save(leads)

    const messages = new Collection({
      name: 'whatsapp_messages',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'lead_id',
          type: 'relation',
          required: true,
          collectionId: leads.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'content', type: 'text', required: true },
        { name: 'direction', type: 'select', values: ['inbound', 'outbound'], required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_whatsapp_messages_lead_id ON whatsapp_messages (lead_id)'],
    })
    app.save(messages)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('whatsapp_messages'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('leads'))
    } catch (_) {}
  },
)
