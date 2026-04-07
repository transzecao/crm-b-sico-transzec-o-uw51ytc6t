migrate(
  (app) => {
    try {
      app.findFirstRecordByData('routing_config', 'name', 'quote_dynamic_fields')
    } catch (_) {
      const col = app.findCollectionByNameOrId('routing_config')
      const record = new Record(col)
      record.set('name', 'quote_dynamic_fields')
      record.set('settings', {
        fields: [
          {
            id: 'cnpj_remetente',
            label: 'CNPJ Remetente',
            type: 'text',
            required: true,
            mappedParam: '',
          },
          {
            id: 'endereco_remetente',
            label: 'Endereço Remetente',
            type: 'text',
            required: true,
            mappedParam: '',
          },
          {
            id: 'cnpj_destino',
            label: 'CNPJ Destino',
            type: 'text',
            required: true,
            mappedParam: '',
          },
          {
            id: 'endereco_destino',
            label: 'Endereço Destino',
            type: 'text',
            required: true,
            mappedParam: '',
          },
          {
            id: 'peso_total',
            label: 'Peso Total (kg)',
            type: 'number',
            required: true,
            mappedParam: 'weight',
          },
          {
            id: 'quantidade_total',
            label: 'Quantidade Total',
            type: 'number',
            required: true,
            mappedParam: '',
          },
          {
            id: 'volume_total',
            label: 'Volume Total (m³)',
            type: 'number',
            required: true,
            mappedParam: 'volume',
          },
          {
            id: 'valor_nf',
            label: 'Valor da NF (R$)',
            type: 'number',
            required: true,
            mappedParam: 'nfValue',
          },
          { id: 'numero_nf', label: 'Número da NF', type: 'text', required: true, mappedParam: '' },
          {
            id: 'tipo_frete',
            label: 'Tipo de Frete',
            type: 'select',
            required: true,
            values: ['CIF', 'FOB'],
            mappedParam: '',
          },
        ],
      })
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('routing_config', 'name', 'quote_dynamic_fields')
      app.delete(record)
    } catch (_) {}
  },
)
