migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('invitations')

    // 1. Update API rules to allow authenticated users to create records
    col.createRule = "@request.auth.id != ''"

    // 2. Ensure "sent" (lowercase) is a valid option in the status field
    const statusField = col.fields.getByName('status')
    if (statusField) {
      const currentValues = statusField.values || []
      if (!currentValues.includes('sent')) {
        statusField.values = [...currentValues, 'sent']
      }
    }

    // 3. Remove any unique index on the email field to allow re-invites
    if (col.indexes && Array.isArray(col.indexes)) {
      col.indexes = col.indexes.filter((idx) => {
        const upperIdx = idx.toUpperCase()
        return !(upperIdx.includes('UNIQUE') && upperIdx.includes('EMAIL'))
      })
    }

    app.save(col)
  },
  (app) => {
    // Best effort revert is not necessary for this permissive constraint update
  },
)
