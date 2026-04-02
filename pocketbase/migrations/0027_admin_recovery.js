migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')

    // Update API Rules: set updateRule to empty string (publicly accessible) to resolve update conflicts
    collection.updateRule = ''

    // Explicitly ensure email and password authentication is allowed
    if (collection.authOptions) {
      collection.authOptions.allowEmailAuth = true
      collection.authOptions.allowPasswordAuth = true
    }

    app.save(collection)

    try {
      // Attempt to update existing admin record
      const record = app.findFirstRecordByData('transzecao', 'id', 'rnw4xx77v05fpck')
      record.setPassword('SenhaMaster123') // setPassword handles both password and passwordConfirm
      record.setVerified(true)
      record.set('role', 'master')
      app.saveNoValidate(record) // Bypass other constraints just in case
    } catch (err) {
      // If record doesn't exist, create it to ensure emergency access
      try {
        const record = new Record(collection)
        record.set('id', 'rnw4xx77v05fpck')
        record.setEmail('master.recovery@transzecao.local')
        record.setPassword('SenhaMaster123')
        record.setVerified(true)
        record.set('role', 'master')
        app.saveNoValidate(record)
      } catch (createErr) {
        console.log('Could not create recovery admin:', createErr)
      }
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('transzecao')
    // Revert rule to the previous state shown in schema.json
    collection.updateRule = '@request.auth.role = "admin" || id = @request.auth.id'
    app.save(collection)
  },
)
