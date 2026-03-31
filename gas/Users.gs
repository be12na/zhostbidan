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

  delete: function (request) {
    const payload = request.payload || {};
    Validators.requireFields(payload, ['user_id']);

    const users = Utils.readRows(GAS_CONFIG.SHEETS.USERS);
    const existing = users.find(function (item) {
      return String(item.user_id) === String(payload.user_id);
    });

    if (!existing) {
      throw new Error('User tidak ditemukan');
    }

    if (String(existing.role) === 'pemilik') {
      throw new Error('Akun pemilik tidak dapat dihapus');
    }

    Utils.deleteById(GAS_CONFIG.SHEETS.USERS, 'user_id', payload.user_id);
    Utils.writeAuditLog('delete', 'users', 'system', { user_id: payload.user_id });
    return Response.build(true, 'User berhasil dihapus', { user_id: payload.user_id });
  },
};
