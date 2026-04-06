migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('collection_schedules')
    col.fields.add(
      new RelationField({
        name: 'funcionario_coleta_id',
        collectionId: '_pb_users_auth_',
        maxSelect: 1,
      }),
    )
    col.fields.add(
      new RelationField({
        name: 'supervisor_coleta_id',
        collectionId: '_pb_users_auth_',
        maxSelect: 1,
      }),
    )
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('collection_schedules')
    col.fields.removeByName('funcionario_coleta_id')
    col.fields.removeByName('supervisor_coleta_id')
    app.save(col)
  },
)
