const Patients = {
  list: function (request) {
    const params = request.params || {};
    const search = Utils.sanitizeText(params.search || '').toLowerCase();
    let rows = Utils.readRows(GAS_CONFIG.SHEETS.PATIENTS);

    if (search) {
      rows = rows.filter(function (row) {
        return [row.nama, row.no_rm, row.nik, row.hp].some(function (item) {
          return String(item || '').toLowerCase().indexOf(search) >= 0;
        });
      });
    }

    return Response.build(true, 'OK', rows);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['nama', 'nik', 'tanggal_lahir', 'jenis_kelamin', 'hp']);

    const now = Utils.nowISO();
    const id = Utils.generateId('pas');
    const noRm = 'RM-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + id.slice(-4);

    const record = {
      pasien_id: id,
      no_rm: noRm,
      nama: Utils.sanitizeText(payload.nama),
      nik: Utils.sanitizeText(payload.nik),
      tanggal_lahir: Utils.sanitizeText(payload.tanggal_lahir),
      umur: Utils.sanitizeText(payload.umur || ''),
      jenis_kelamin: Utils.sanitizeText(payload.jenis_kelamin),
      alamat: Utils.sanitizeText(payload.alamat || ''),
      hp: Utils.sanitizeText(payload.hp),
      no_bpjs: Utils.sanitizeText(payload.no_bpjs || ''),
      status_bpjs: Utils.sanitizeText(payload.status_bpjs || 'Tidak Aktif'),
      satu_sehat_flag: Utils.sanitizeText(payload.satu_sehat_flag || 'Tidak'),
      last_visit: Utils.sanitizeText(payload.last_visit || ''),
      created_at: now,
      updated_at: now,
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.PATIENTS, record);
    Utils.writeAuditLog('create', 'patients', 'system', record);
    return Response.build(true, 'Pasien berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['pasien_id']);
    payload.updated_at = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.PATIENTS, 'pasien_id', payload.pasien_id, payload);
    Utils.writeAuditLog('update', 'patients', 'system', payload);
    return Response.build(true, 'Pasien berhasil diperbarui', payload);
  },

  delete: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['pasien_id']);
    Utils.deleteById(GAS_CONFIG.SHEETS.PATIENTS, 'pasien_id', payload.pasien_id);
    Utils.writeAuditLog('delete', 'patients', 'system', { pasien_id: payload.pasien_id });
    return Response.build(true, 'Pasien berhasil dihapus', { pasien_id: payload.pasien_id });
  },
};
