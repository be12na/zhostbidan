const Content = {
  list: function (request) {
    const type = Utils.sanitizeText((request.params && request.params.type) || (request.payload && request.payload.type)).toLowerCase();
    Validators.requireFields({ type: type }, ['type']);

    const sheetName = CONTENT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis konten tidak didukung: ' + type);
    }

    return Response.build(true, 'OK', Utils.readRows(sheetName));
  },

  create: function (request) {
    const payload = request.payload || {};
    const type = Utils.sanitizeText(payload.type).toLowerCase();
    Validators.requireFields({ type: type, title: payload.title }, ['type', 'title']);

    const sheetName = CONTENT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis konten tidak didukung: ' + type);
    }

    const record = {
      id: payload.id || Utils.generateId('cnt'),
      title: Utils.sanitizeText(payload.title),
      subtitle: Utils.sanitizeText(payload.subtitle || ''),
      description: Utils.sanitizeText(payload.description || ''),
      cta_text: Utils.sanitizeText(payload.cta_text || ''),
      cta_link: Utils.sanitizeText(payload.cta_link || ''),
      is_active: Utils.sanitizeText(payload.is_active || 'true'),
      sort_order: Number(payload.sort_order || 0),
    };

    Utils.appendRow(sheetName, record);
    Utils.writeAuditLog('create', 'content', 'system', { type: type, id: record.id });
    return Response.build(true, 'Konten berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    const type = Utils.sanitizeText(payload.type).toLowerCase();
    Validators.requireFields({ type: type, id: payload.id }, ['type', 'id']);

    const sheetName = CONTENT_SHEET_BY_TYPE[type];
    if (!sheetName) {
      throw new Error('Jenis konten tidak didukung: ' + type);
    }

    Utils.updateById(sheetName, 'id', payload.id, payload);
    Utils.writeAuditLog('update', 'content', 'system', { type: type, id: payload.id });
    return Response.build(true, 'Konten berhasil diperbarui', payload);
  },
};
