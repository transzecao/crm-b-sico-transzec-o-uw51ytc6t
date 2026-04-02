migrate(
  (app) => {
    const configCol = app.findCollectionByNameOrId('routing_config')
    try {
      app.findFirstRecordByData('routing_config', 'name', 'default_rules')
    } catch (_) {
      const record = new Record(configCol)
      record.set('name', 'default_rules')
      record.set('settings', {
        max_weight_per_route: 5000,
        auto_assign: false,
        require_dimensions: true,
        clusters: [
          'Campinas',
          'Diadema',
          'Guarulhos',
          'Hortolandia',
          'Louveira',
          'Osasco',
          'São Paulo',
          'São Bernardo do Campo',
          'São Caetano do Sul',
          'Sumaré',
          'Valinhos',
          'Vinhedo',
          'Itupeva',
        ],
      })
      app.save(record)
    }

    const vehiclesCol = app.findCollectionByNameOrId('vehicles')
    let vehicleId
    try {
      const v = app.findFirstRecordByData('vehicles', 'plate', 'ABC-1234')
      vehicleId = v.id
    } catch (_) {
      const v = new Record(vehiclesCol)
      v.set('plate', 'ABC-1234')
      v.set('status', 'active')
      app.save(v)
      vehicleId = v.id
    }

    const schedulesCol = app.findCollectionByNameOrId('collection_schedules')
    try {
      app.findFirstRecordByData('collection_schedules', 'invoice_id', 'INV-001')
    } catch (_) {
      try {
        const admin = app.findAuthRecordByEmail('transzecao', 'nikytafurchi@outlook.com')
        const s = new Record(schedulesCol)
        s.set('creator_id', admin.id)
        s.set('freight_type', 'CIF')
        s.set('sender_cnpj', '11111111111111')
        s.set('sender_name', 'Sender Corp')
        s.set('sender_address', 'Rua A, 123 - SP')
        s.set('dest_cnpj', '22222222222222')
        s.set('dest_name', 'Dest Corp')
        s.set('dest_address', 'Rua B, 456 - SP')
        s.set('invoice_id', 'INV-001')
        s.set('quantity', 10)
        s.set('total_volume', '2x2x2')
        s.set('total_weight', 100)
        s.set('invoice_value', 5000)
        s.set('status', 'pending')
        app.save(s)
      } catch (_) {}
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('routing_config', 'name', 'default_rules')
      app.delete(record)
    } catch (_) {}
  },
)
