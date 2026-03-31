migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('fleet_settings')
    const record = new Record(col)
    record.set('max_cpk', 4.5)
    record.set('min_margin', 15)
    record.set('yellow_margin', 25)
    record.set('max_das', 20)
    record.set('fuel_consumption', 5)
    record.set('fuel_price', 6.2)
    record.set('working_days', 22)
    app.save(record)
  },
  (app) => {
    const records = app.findRecordsByFilter('fleet_settings', '1=1', '', 10, 0)
    records.forEach((r) => app.delete(r))
  },
)
