const Users = {
  list: function () {
    return Response.build(true, 'OK', Utils.readRows(GAS_CONFIG.SHEETS.USERS));
  },

  create: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['nama', 'email', 'role', 'status']);
    Validators.requireRole(String(payload.role));
    Validators.uniqueEmail(GAS_CONFIG.SHEETS.USERS, payload.email, '', 'user_id');

    const now = Utils.nowISO();
    const record = {
      user_id: Utils.generateId('usr'),
      nama: Utils.sanitizeText(payload.nama),
      email: Utils.sanitizeText(payload.email).toLowerCase(),
      role: Utils.sanitizeText(payload.role),
      status: Utils.sanitizeText(payload.status),
      last_login: '',
      created_at: now,
      updated_at: now,
    };

    Utils.appendRow(GAS_CONFIG.SHEETS.USERS, record);
    Utils.writeAuditLog('create', 'users', record.email, record);
    return Response.build(true, 'User berhasil dibuat', record);
  },

  update: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['user_id']);

    if (payload.role) {
      Validators.requireRole(String(payload.role));
    }

    if (payload.email) {
      Validators.uniqueEmail(GAS_CONFIG.SHEETS.USERS, payload.email, payload.user_id, 'user_id');
    }

    payload.updated_at = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.USERS, 'user_id', payload.user_id, payload);
    Utils.writeAuditLog('update', 'users', 'system', payload);
    return Response.build(true, 'User berhasil diperbarui', payload);
  },
};
