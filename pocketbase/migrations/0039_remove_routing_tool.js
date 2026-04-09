migrate(
  (app) => {
    const collectionsToRemove = ['route_plans', 'routing_config', 'collection_schedules']

    for (const name of collectionsToRemove) {
      try {
        const collection = app.findCollectionByNameOrId(name)
        app.delete(collection)
      } catch (_) {
        // Collection already deleted or does not exist
      }
    }

    // Remove permissions related to routing tool if they exist
    try {
      const permissions = app.findRecordsByFilter(
        'tool_permissions',
        "tool = 'collection_scheduling'",
      )
      for (const record of permissions) {
        app.delete(record)
      }
    } catch (_) {}

    // Remove field configurations related to routing tool if they exist
    try {
      const fields = app.findRecordsByFilter('tool_fields', "tool = 'collection_scheduling'")
      for (const record of fields) {
        app.delete(record)
      }
    } catch (_) {}
  },
  (app) => {
    // Since collections have their data and relations, trying to recreate them here
    // is error-prone. Leaving empty as downward deletion of entire modules is destructive.
  },
)
