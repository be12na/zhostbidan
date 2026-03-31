const Queue = {
  list: function (request) {
    const params = request.params || {};
    const criteria = {
      status: params.status,
      tanggal: params.tanggal,
      layanan: params.layanan,
    };
    const rows = Utils.filterRows(Utils.readRows(GAS_CONFIG.SHEETS.QUEUE), criteria);
    return Response.build(true, 'OK', rows);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['tanggal', 'pasien_id', 'layanan']);

    const now = Utils.nowISO();
    const patient = Utils.readRows(GAS_CONFIG.SHEETS.PATIENTS).find(function (row) {
      return String(row.pasien_id) === String(payload.pasien_id);
    });

    const record = {
      id_antrian: Utils.generateId('antri'),
      tanggal: Utils.sanitizeText(payload.tanggal),
      pasien_id: Utils.sanitizeText(payload.pasien_id),
      nama_pasien: patient ? String(patient.nama) : '',
      layanan: Utils.sanitizeText(payload.layanan),
      status: Utils.sanitizeText(payload.status || 'Menunggu'),
      diagnosa_ringkas: Utils.sanitizeText(payload.diagnosa_ringkas || ''),
      analisa_ringkas: Utils.sanitizeText(payload.analisa_ringkas || ''),
      created_by: Utils.sanitizeText(payload.created_by || 'system'),
      updated_at: now,
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.QUEUE, record);
    Utils.writeAuditLog('create', 'queue', record.created_by, record);
    return Response.build(true, 'Antrian berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['id_antrian']);
    payload.updated_at = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.QUEUE, 'id_antrian', payload.id_antrian, payload);
    Utils.writeAuditLog('update', 'queue', 'system', payload);
    return Response.build(true, 'Antrian berhasil diperbarui', payload);
  },

  delete: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['id_antrian']);
    Utils.deleteById(GAS_CONFIG.SHEETS.QUEUE, 'id_antrian', payload.id_antrian);
    Utils.writeAuditLog('delete', 'queue', 'system', { id_antrian: payload.id_antrian });
    return Response.build(true, 'Antrian berhasil dihapus', { id_antrian: payload.id_antrian });
  },
};
