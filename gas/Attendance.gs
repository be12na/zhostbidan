const Attendance = {
  list: function (request) {
    const params = request.params || {};
    const rows = Utils.readRows(GAS_CONFIG.SHEETS.ATTENDANCE).filter(function (row) {
      const passKaryawan = params.karyawan_id ? String(row.karyawan_id) === String(params.karyawan_id) : true;
      const passStatus = params.status ? String(row.status) === String(params.status) : true;
      const passMonth = params.month ? String(row.tanggal).slice(0, 7) === String(params.month) : true;
      return passKaryawan && passStatus && passMonth;
    });

    return Response.build(true, 'OK', rows);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['tanggal', 'karyawan_id', 'status', 'input_by']);

    const record = {
      absensi_id: Utils.generateId('abs'),
      tanggal: Utils.sanitizeText(payload.tanggal),
      karyawan_id: Utils.sanitizeText(payload.karyawan_id),
      status: Utils.sanitizeText(payload.status),
      lembur_jam: Number(payload.lembur_jam || 0),
      catatan: Utils.sanitizeText(payload.catatan || ''),
      input_by: Utils.sanitizeText(payload.input_by),
      created_at: Utils.nowISO(),
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.ATTENDANCE, record);
    Utils.writeAuditLog('create', 'attendance', record.input_by, record);
    return Response.build(true, 'Absensi berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['absensi_id']);
    Utils.updateById(GAS_CONFIG.SHEETS.ATTENDANCE, 'absensi_id', payload.absensi_id, payload);
    Utils.writeAuditLog('update', 'attendance', 'system', payload);
    return Response.build(true, 'Absensi berhasil diperbarui', payload);
  },

  delete: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['absensi_id']);
    Utils.deleteById(GAS_CONFIG.SHEETS.ATTENDANCE, 'absensi_id', payload.absensi_id);
    Utils.writeAuditLog('delete', 'attendance', 'system', { absensi_id: payload.absensi_id });
    return Response.build(true, 'Absensi berhasil dihapus', { absensi_id: payload.absensi_id });
  },
};
