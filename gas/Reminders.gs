const Reminders = {
  list: function (request) {
    const params = request.params || {};
    const criteria = {
      status: params.status,
      waktu: params.waktu,
      pasien_id: params.pasien_id,
    };
    const rows = Utils.filterRows(Utils.readRows(GAS_CONFIG.SHEETS.REMINDERS), criteria);
    return Response.build(true, 'OK', rows);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['pasien_id', 'nama', 'no_wa', 'jenis', 'waktu', 'status']);

    const now = Utils.nowISO();
    const record = {
      reminder_id: Utils.generateId('rem'),
      pasien_id: Utils.sanitizeText(payload.pasien_id),
      nama: Utils.sanitizeText(payload.nama),
      no_wa: Utils.sanitizeText(payload.no_wa),
      jenis: Utils.sanitizeText(payload.jenis),
      waktu: Utils.sanitizeText(payload.waktu),
      status: Utils.sanitizeText(payload.status),
      catatan_cs: Utils.sanitizeText(payload.catatan_cs || ''),
      created_at: now,
      updated_at: now,
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.REMINDERS, record);
    Utils.writeAuditLog('create', 'reminders', 'system', record);
    return Response.build(true, 'Reminder berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['reminder_id']);
    payload.updated_at = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.REMINDERS, 'reminder_id', payload.reminder_id, payload);
    Utils.writeAuditLog('update', 'reminders', 'system', payload);
    return Response.build(true, 'Reminder berhasil diperbarui', payload);
  },

  delete: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['reminder_id']);
    Utils.deleteById(GAS_CONFIG.SHEETS.REMINDERS, 'reminder_id', payload.reminder_id);
    Utils.writeAuditLog('delete', 'reminders', 'system', { reminder_id: payload.reminder_id });
    return Response.build(true, 'Reminder berhasil dihapus', { reminder_id: payload.reminder_id });
  },
};
