const Utils = {
  getSpreadsheet: function () {
    if (!GAS_CONFIG.SPREADSHEET_ID || GAS_CONFIG.SPREADSHEET_ID === 'REPLACE_WITH_SPREADSHEET_ID') {
      throw new Error('SPREADSHEET_ID belum dikonfigurasi di Config.gs');
    }
    return SpreadsheetApp.openById(GAS_CONFIG.SPREADSHEET_ID);
  },

  getSheet: function (sheetName) {
    const sheet = this.getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet tidak ditemukan: ' + sheetName);
    }
    return sheet;
  },

  sanitizeText: function (value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  },

  nowISO: function () {
    return new Date().toISOString();
  },

  generateId: function (prefix) {
    const token = Utilities.getUuid().replace(/-/g, '').slice(0, 10);
    return prefix + '_' + token;
  },

  readRows: function (sheetName) {
    const sheet = this.getSheet(sheetName);
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return [];

    const headers = values[0].map(function (h) {
      return String(h).trim();
    });

    return values.slice(1).map(function (row) {
      const obj = {};
      headers.forEach(function (header, index) {
        obj[header] = row[index];
      });
      return obj;
    });
  },

  appendRow: function (sheetName, payload) {
    const sheet = this.getSheet(sheetName);
    const headers = sheet.getDataRange().getValues()[0];
    if (!headers || headers.length === 0) {
      throw new Error('Header sheet tidak ditemukan untuk ' + sheetName);
    }

    const row = headers.map(function (header) {
      const key = String(header).trim();
      return payload[key] !== undefined ? payload[key] : '';
    });
    sheet.appendRow(row);
    return payload;
  },

  updateById: function (sheetName, idField, idValue, payload) {
    const sheet = this.getSheet(sheetName);
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      throw new Error('Data kosong pada sheet ' + sheetName);
    }

    const headers = values[0].map(function (h) {
      return String(h).trim();
    });
    const idColumnIndex = headers.indexOf(idField);
    if (idColumnIndex < 0) {
      throw new Error('Kolom id tidak ditemukan: ' + idField);
    }

    const targetRowIndex = values.findIndex(function (row, index) {
      if (index === 0) return false;
      return String(row[idColumnIndex]) === String(idValue);
    });

    if (targetRowIndex < 0) {
      throw new Error(idField + ' tidak ditemukan: ' + idValue);
    }

    headers.forEach(function (header, idx) {
      if (payload[header] !== undefined) {
        sheet.getRange(targetRowIndex + 1, idx + 1).setValue(payload[header]);
      }
    });

    return payload;
  },

  filterRows: function (rows, criteria) {
    if (!criteria) return rows;

    return rows.filter(function (row) {
      return Object.keys(criteria).every(function (key) {
        const expected = criteria[key];
        if (expected === '' || expected === null || expected === undefined) return true;
        return String(row[key]) === String(expected);
      });
    });
  },

  writeAuditLog: function (action, resource, actor, detail) {
    try {
      const payload = {
        log_id: this.generateId('log'),
        action: action,
        resource: resource,
        actor: actor || 'system',
        detail: detail ? JSON.stringify(detail).slice(0, 2000) : '',
        created_at: this.nowISO(),
      };
      this.appendRow(GAS_CONFIG.SHEETS.AUDIT_LOG, payload);
    } catch (error) {
      // Keep API responses resilient even if audit logging fails.
    }
  },
};
