migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('invitations')
    col.createRule = null
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('invitations')
    col.createRule = "@request.auth.id != ''"
    app.save(col)
  },
)
