const Finance = {
  list: function (request) {
    const params = request.params || {};
    const allRows = Utils.readRows(GAS_CONFIG.SHEETS.FINANCE);

    const filtered = allRows.filter(function (row) {
      const passJenis = params.jenis ? String(row.jenis) === String(params.jenis) : true;
      const passKategori = params.kategori ? String(row.kategori) === String(params.kategori) : true;
      const passStart = params.start_date ? String(row.tanggal) >= String(params.start_date) : true;
      const passEnd = params.end_date ? String(row.tanggal) <= String(params.end_date) : true;
      return passJenis && passKategori && passStart && passEnd;
    });

    return Response.build(true, 'OK', filtered);
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['tanggal', 'jenis', 'kategori', 'nominal', 'keterangan']);

    const now = Utils.nowISO();
    const record = {
      transaksi_id: Utils.generateId('trx'),
      tanggal: Utils.sanitizeText(payload.tanggal),
      jenis: Utils.sanitizeText(payload.jenis),
      kategori: Utils.sanitizeText(payload.kategori),
      nominal: Number(payload.nominal || 0),
      keterangan: Utils.sanitizeText(payload.keterangan),
      pasien_id: Utils.sanitizeText(payload.pasien_id || ''),
      antrian_id: Utils.sanitizeText(payload.antrian_id || ''),
      created_by: Utils.sanitizeText(payload.created_by || 'system'),
      created_at: now,
      updated_at: now,
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.FINANCE, record);
    Utils.writeAuditLog('create', 'finance', record.created_by, record);
    return Response.build(true, 'Transaksi berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['transaksi_id']);
    payload.updated_at = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.FINANCE, 'transaksi_id', payload.transaksi_id, payload);
    Utils.writeAuditLog('update', 'finance', 'system', payload);
    return Response.build(true, 'Transaksi berhasil diperbarui', payload);
  },
};
