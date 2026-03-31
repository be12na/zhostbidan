const Reports = {
  list: function (request) {
    const type = Utils.sanitizeText((request.params && request.params.type) || (request.payload && request.payload.type)).toLowerCase();
    Validators.requireFields({ type: type }, ['type']);

    const sheetName = REPORT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis laporan tidak didukung: ' + type);
    }

    return Response.build(true, 'OK', Utils.readRows(sheetName));
  },

  create: function (request) {
    const payload = request.payload || {};
    const type = Utils.sanitizeText(payload.type).toLowerCase();
    Validators.requireFields({ type: type, tanggal: payload.tanggal }, ['type', 'tanggal']);

    const sheetName = REPORT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis laporan tidak didukung: ' + type);
    }

    const record = Object.assign({}, payload, {
      id: payload.id || Utils.generateId('lap'),
      created_at: Utils.nowISO(),
    });

    Utils.appendRow(sheetName, record);
    Utils.writeAuditLog('create', 'reports', 'system', { type: type, id: record.id });
    return Response.build(true, 'Laporan berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    const type = Utils.sanitizeText(payload.type).toLowerCase();
    Validators.requireFields({ type: type, id: payload.id }, ['type', 'id']);

    const sheetName = REPORT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis laporan tidak didukung: ' + type);
    }

    Utils.updateById(sheetName, 'id', payload.id, payload);
    Utils.writeAuditLog('update', 'reports', 'system', { type: type, id: payload.id });
    return Response.build(true, 'Laporan berhasil diperbarui', payload);
  },

  delete: function (request) {
    const payload = request.payload || {};
    const type = Utils.sanitizeText(payload.type).toLowerCase();
    Validators.requireFields({ type: type, id: payload.id }, ['type', 'id']);

    const sheetName = REPORT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis laporan tidak didukung: ' + type);
    }

    Utils.deleteById(sheetName, 'id', payload.id);
    Utils.writeAuditLog('delete', 'reports', 'system', { type: type, id: payload.id });
    return Response.build(true, 'Laporan berhasil dihapus', { type: type, id: payload.id });
  },
};
