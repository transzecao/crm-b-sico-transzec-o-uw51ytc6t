migrate(
  (app) => {
    const vehicles = app.findCollectionByNameOrId('vehicles')

    const v1 = new Record(vehicles)
    v1.set('plate', 'ABC-1234')
    v1.set('model', 'Volkswagen Saveiro')
    v1.set('km_critical_limit', 10000)
    v1.set('maintenance_frequency_months', 12)
    v1.set('last_maintenance_date', '2025-01-10 10:00:00.000Z')
    v1.set('next_maintenance_date', '2026-01-10 10:00:00.000Z')
    v1.set('status', 'active')
    app.save(v1)

    const v2 = new Record(vehicles)
    v2.set('plate', 'XYZ-9876')
    v2.set('model', 'Volvo Delivery')
    v2.set('km_critical_limit', 20000)
    v2.set('maintenance_frequency_months', 6)
    v2.set('last_maintenance_date', '2025-06-15 10:00:00.000Z')
    v2.set('next_maintenance_date', '2025-12-15 10:00:00.000Z')
    v2.set('status', 'active')
    app.save(v2)
  },
  (app) => {
    const records = app.findRecordsByFilter(
      'vehicles',
      "plate = 'ABC-1234' || plate = 'XYZ-9876'",
      '',
      10,
      0,
    )
    records.forEach((r) => app.delete(r))
  },
)
