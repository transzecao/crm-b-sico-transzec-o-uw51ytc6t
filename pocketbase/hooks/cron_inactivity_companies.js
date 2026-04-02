cronAdd('deactivate_inactive_companies', '0 0 * * *', () => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const dateStr = thirtyDaysAgo.toISOString().replace('T', ' ').substring(0, 19) + 'Z'

  const companies = $app.findRecordsByFilter('companies', `status = 'Ativo'`, '', 0, 0)

  for (let comp of companies) {
    try {
      // Find the most recently updated lead for this company
      const latestLead = $app.findFirstRecordByFilter(
        'leads',
        `company_id = '${comp.id}'`,
        '-updated',
      )

      if (latestLead.get('updated') < dateStr) {
        comp.set('status', 'Inativo')
        $app.saveNoValidate(comp)
        console.log(`Deactivated company ${comp.get('name')} due to inactivity.`)
      }
    } catch (_) {
      // No leads found. Check if the company itself is older than 30 days.
      if (comp.get('created') < dateStr) {
        comp.set('status', 'Inativo')
        $app.saveNoValidate(comp)
        console.log(`Deactivated company ${comp.get('name')} due to inactivity (no leads).`)
      }
    }
  }
})
