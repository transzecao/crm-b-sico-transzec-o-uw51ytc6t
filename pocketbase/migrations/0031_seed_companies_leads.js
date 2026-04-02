migrate(
  (app) => {
    const companies = app.findCollectionByNameOrId('companies')
    const leads = app.findCollectionByNameOrId('leads')

    // Seed companies
    let comp1
    try {
      comp1 = app.findFirstRecordByData('companies', 'cnpj', '12345678000199')
    } catch (_) {
      comp1 = new Record(companies)
      comp1.set('name', 'Logística Avançada LTDA')
      comp1.set('cnpj', '12345678000199')
      comp1.set('status', 'Ativo')
      app.save(comp1)
    }

    let comp2
    try {
      comp2 = app.findFirstRecordByData('companies', 'cnpj', '98765432000188')
    } catch (_) {
      comp2 = new Record(companies)
      comp2.set('name', 'Transportes Rápidos S.A.')
      comp2.set('cnpj', '98765432000188')
      comp2.set('status', 'Ativo')
      app.save(comp2)
    }

    // Seed leads
    try {
      app.findFirstRecordByData('leads', 'name', 'Projeto Alpha')
    } catch (_) {
      const lead1 = new Record(leads)
      lead1.set('name', 'Projeto Alpha')
      lead1.set('company_id', comp1.id)
      lead1.set('status', 'Prospect')
      lead1.set('contact_name', 'João Silva')
      lead1.set('email', 'joao.silva@logavancada.com')
      app.save(lead1)
    }

    try {
      app.findFirstRecordByData('leads', 'name', 'Expansão Frota 2026')
    } catch (_) {
      const lead2 = new Record(leads)
      lead2.set('name', 'Expansão Frota 2026')
      lead2.set('company_id', comp1.id)
      lead2.set('status', 'Qualificado')
      lead2.set('contact_name', 'Maria Santos')
      app.save(lead2)
    }

    try {
      app.findFirstRecordByData('leads', 'name', 'Renovação Contrato TR')
    } catch (_) {
      const lead3 = new Record(leads)
      lead3.set('name', 'Renovação Contrato TR')
      lead3.set('company_id', comp2.id)
      lead3.set('status', 'Negociando')
      lead3.set('contact_name', 'Carlos Oliveira')
      app.save(lead3)
    }
  },
  (app) => {
    // Optionally revert the seeding if needed
  },
)
