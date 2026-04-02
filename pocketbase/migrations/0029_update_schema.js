migrate(
  (app) => {
    // 1. Update transzecao (Auth) Collection
    const transzecao = app.findCollectionByNameOrId('transzecao')

    const roleField = transzecao.fields.getByName('role')
    if (roleField) {
      roleField.selectValues = [
        'Master',
        'Supervisor_Financeiro',
        'Supervisor_Comercial',
        'Supervisor_Coleta',
        'Funcionário_Comercial',
        'Funcionário_Marketing',
        'Funcionário_Coleta',
        'Cliente',
      ]
    }

    const statusField = transzecao.fields.getByName('status')
    if (statusField) {
      statusField.selectValues = ['Ativo', 'Inativo', 'Pendente']
    }

    transzecao.listRule = "@request.auth.role = 'Master' || id = @request.auth.id"
    transzecao.viewRule = "@request.auth.role = 'Master' || id = @request.auth.id"
    transzecao.createRule = "@request.auth.role = 'Master'"
    transzecao.updateRule = "@request.auth.role = 'Master' || id = @request.auth.id"
    transzecao.deleteRule = "@request.auth.role = 'Master' || id = @request.auth.id"

    app.save(transzecao)

    // 2. Create companies Collection
    const companies = new Collection({
      name: 'companies',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.role = 'Master'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'cnpj', type: 'text', required: true, pattern: '^\\d{14}$' },
        { name: 'address', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'status', type: 'select', selectValues: ['Ativo', 'Inativo'] },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_companies_cnpj ON companies (cnpj)'],
    })
    app.save(companies)

    // Create a default company to satisfy existing leads relations
    const defaultCompany = new Record(companies)
    defaultCompany.set('name', 'Empresa Padrão (Migração)')
    defaultCompany.set('cnpj', '00000000000000')
    defaultCompany.set('status', 'Ativo')
    app.save(defaultCompany)

    // 3. Update leads Collection
    const leads = app.findCollectionByNameOrId('leads')
    leads.listRule = "@request.auth.id != ''"
    leads.viewRule = "@request.auth.id != ''"
    leads.createRule = "@request.auth.id != ''"
    leads.updateRule = "@request.auth.id != ''"
    leads.deleteRule = "@request.auth.role = 'Master'"

    leads.fields.removeByName('status')
    leads.fields.add(
      new SelectField({
        name: 'status',
        selectValues: ['Prospect', 'Qualificado', 'Negociando', 'Ganho', 'Perda'],
      }),
    )

    leads.fields.add(
      new RelationField({
        name: 'company_id',
        required: false, // Set false initially to allow updating existing records
        collectionId: companies.id,
        maxSelect: 1,
      }),
    )
    leads.fields.add(new TextField({ name: 'contact_name' }))
    leads.fields.add(new EmailField({ name: 'email' }))
    leads.fields.add(new TextField({ name: 'phone' }))
    leads.fields.add(new TextField({ name: 'pipeline_stage' }))

    app.save(leads)

    // Update existing leads to relate to the default company
    app
      .db()
      .newQuery('UPDATE leads SET company_id = {:compId}')
      .bind({ compId: defaultCompany.id })
      .execute()

    // Now make the relation required as requested
    const compIdField = leads.fields.getByName('company_id')
    compIdField.required = true
    app.save(leads)

    // 4. Create pipelines Collection
    const pipelines = new Collection({
      name: 'pipelines',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.role = 'Master'",
      updateRule: "@request.auth.role = 'Master'",
      deleteRule: "@request.auth.role = 'Master'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'stages', type: 'json' },
        { name: 'rules', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pipelines)

    // 5. Create finance Collection
    const finance = new Collection({
      name: 'finance',
      type: 'base',
      listRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Financeiro'",
      viewRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Financeiro'",
      createRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Financeiro'",
      updateRule: "@request.auth.role = 'Master' || @request.auth.role = 'Supervisor_Financeiro'",
      deleteRule: "@request.auth.role = 'Master'",
      fields: [
        { name: 'cluster', type: 'select', selectValues: ['Campinas', 'Sumaré'] },
        { name: 'item', type: 'text' },
        { name: 'value', type: 'number' },
        { name: 'currency', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(finance)

    // 6. Create reports Collection
    const reports = new Collection({
      name: 'reports',
      type: 'base',
      listRule: "@request.auth.role = 'Master' || user_id = @request.auth.id",
      viewRule: "@request.auth.role = 'Master' || user_id = @request.auth.id",
      createRule: "@request.auth.role = 'Master' || user_id = @request.auth.id",
      updateRule: "@request.auth.role = 'Master' || user_id = @request.auth.id",
      deleteRule: "@request.auth.role = 'Master' || user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: transzecao.id,
          maxSelect: 1,
        },
        { name: 'type', type: 'select', selectValues: ['CPK', 'Gastos', 'Manutenção'] },
        { name: 'data', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(reports)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('reports'))
    app.delete(app.findCollectionByNameOrId('finance'))
    app.delete(app.findCollectionByNameOrId('pipelines'))

    const leads = app.findCollectionByNameOrId('leads')
    leads.fields.removeByName('company_id')
    leads.fields.removeByName('contact_name')
    leads.fields.removeByName('email')
    leads.fields.removeByName('phone')
    leads.fields.removeByName('pipeline_stage')
    app.save(leads)

    app.delete(app.findCollectionByNameOrId('companies'))
  },
)
