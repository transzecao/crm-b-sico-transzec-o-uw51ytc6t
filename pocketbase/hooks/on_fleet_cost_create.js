onRecordAfterCreateSuccess((e) => {
  const vehicleId = e.record.get('vehicle_id')
  if (!vehicleId) {
    e.next()
    return
  }

  const vehicle = $app.findRecordById('vehicles', vehicleId)
  const kmFinal = e.record.get('km_final')
  const kmLimit = vehicle.get('km_critical_limit')

  if (kmLimit > 0 && kmFinal >= kmLimit) {
    const msg = `Olá, Supervisor! O veículo ${vehicle.get('plate')} atingiu ${kmFinal} km. Recomendamos agendar revisão preventiva para evitar paradas inesperadas. Data sugerida: ${vehicle.get('next_maintenance_date') || 'Imediato'}.`

    const logsCol = $app.findCollectionByNameOrId('maintenance_logs')
    const log = new Record(logsCol)
    log.set('vehicle_id', vehicleId)
    log.set('alert_type', 'KM_LIMIT')
    log.set('message_sent', msg)
    $app.save(log)
  }
  e.next()
}, 'fleet_costs')
