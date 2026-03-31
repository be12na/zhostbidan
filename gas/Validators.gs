const Validators = {
  requireFields: function (payload, fields) {
    fields.forEach(function (field) {
      if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '') {
        throw new Error('Field wajib: ' + field);
      }
    });
  },

  requireRole: function (role) {
    if (GAS_CONFIG.ROLES.indexOf(role) < 0) {
      throw new Error('Role tidak valid: ' + role);
    }
  },

  uniqueEmail: function (sheetName, email, existingId, idField) {
    const rows = Utils.readRows(sheetName);
    const sameEmail = rows.find(function (row) {
      if (existingId && String(row[idField]) === String(existingId)) return false;
      return String(row.email).toLowerCase() === String(email).toLowerCase();
    });

    if (sameEmail) {
      throw new Error('Email sudah digunakan: ' + email);
    }
  },
};
