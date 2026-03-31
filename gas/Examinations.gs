const Examinations = {
  list: function (request) {
    const params = request.params || {};
    const criteria = {
      pasien_id: params.pasien_id,
      antrian_id: params.antrian_id,
      tanggal: params.tanggal,
    };
    const rows = Utils.filterRows(Utils.readRows(GAS_CONFIG.SHEETS.EXAMINATIONS), criteria);
    return Response.build(true, 'OK', rows);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['tanggal', 'pasien_id', 'diagnosa', 'analisa']);

    const record = {
      pemeriksaan_id: Utils.generateId('periksa'),
      tanggal: Utils.sanitizeText(payload.tanggal),
      pasien_id: Utils.sanitizeText(payload.pasien_id),
      antrian_id: Utils.sanitizeText(payload.antrian_id || ''),
      dokter_id: Utils.sanitizeText(payload.dokter_id || ''),
      tenaga_medis: Utils.sanitizeText(payload.tenaga_medis || ''),
      diagnosa: Utils.sanitizeText(payload.diagnosa),
      analisa: Utils.sanitizeText(payload.analisa),
      tindakan: Utils.sanitizeText(payload.tindakan || ''),
      catatan: Utils.sanitizeText(payload.catatan || ''),
      tgl_kembali: Utils.sanitizeText(payload.tgl_kembali || ''),
      keperluan_kembali: Utils.sanitizeText(payload.keperluan_kembali || ''),
      created_at: Utils.nowISO(),
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.EXAMINATIONS, record);
    Utils.writeAuditLog('create', 'examinations', 'system', record);
    return Response.build(true, 'Pemeriksaan berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['pemeriksaan_id']);
    Utils.updateById(GAS_CONFIG.SHEETS.EXAMINATIONS, 'pemeriksaan_id', payload.pemeriksaan_id, payload);
    Utils.writeAuditLog('update', 'examinations', 'system', payload);
    return Response.build(true, 'Pemeriksaan berhasil diperbarui', payload);
  },
};
