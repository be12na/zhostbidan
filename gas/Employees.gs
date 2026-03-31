const Employees = {
  list: function (request) {
    const params = request.params || {};
    const criteria = {
      status_aktif: params.status_aktif,
    };
    const rows = Utils.filterRows(Utils.readRows(GAS_CONFIG.SHEETS.EMPLOYEES), criteria);
    return Response.build(true, 'OK', rows);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['nama', 'posisi', 'kontak', 'jadwal', 'status_aktif']);

    const now = Utils.nowISO();
    const record = {
      karyawan_id: Utils.generateId('kar'),
      nama: Utils.sanitizeText(payload.nama),
      posisi: Utils.sanitizeText(payload.posisi),
      kontak: Utils.sanitizeText(payload.kontak),
      jadwal: Utils.sanitizeText(payload.jadwal),
      status_aktif: Utils.sanitizeText(payload.status_aktif),
      created_at: now,
      updated_at: now,
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.EMPLOYEES, record);
    Utils.writeAuditLog('create', 'employees', 'system', record);
    return Response.build(true, 'Karyawan berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['karyawan_id']);
    payload.updated_at = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.EMPLOYEES, 'karyawan_id', payload.karyawan_id, payload);
    Utils.writeAuditLog('update', 'employees', 'system', payload);
    return Response.build(true, 'Karyawan berhasil diperbarui', payload);
  },
};
