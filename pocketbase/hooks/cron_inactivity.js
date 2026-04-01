cronAdd('deactivate_inactive_users', '0 0 * * *', () => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const dateStr = thirtyDaysAgo.toISOString().replace('T', ' ').substring(0, 19) + 'Z'

  const records = $app.findRecordsByFilter(
    'transzecao',
    `last_activity < '${dateStr}' && status = 'active'`,
    '',
    0,
    0,
  )

  for (let record of records) {
    record.set('status', 'inactive')
    $app.saveNoValidate(record)
    console.log(`Deactivated user ${record.email()} due to inactivity.`)
  }
})
