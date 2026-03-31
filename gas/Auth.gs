const Auth = {
  login: function (request) {
    const payload = request.payload || {};
    const emailRaw = payload.email || (request.params && request.params.email);
    const email = Utils.sanitizeText(emailRaw).toLowerCase();

    Validators.requireFields({ email: email }, ['email']);

    const users = Utils.readRows(GAS_CONFIG.SHEETS.USERS);
    const user = users.find(function (item) {
      return String(item.email).toLowerCase() === email;
    });

    if (!user) {
      throw new Error('Email tidak terdaftar');
    }

    if (String(user.status).toLowerCase() !== 'aktif') {
      throw new Error('Akun tidak aktif');
    }

    const now = Utils.nowISO();
    Utils.updateById(GAS_CONFIG.SHEETS.USERS, 'user_id', user.user_id, { last_login: now, updated_at: now });

    Utils.writeAuditLog('login', 'auth', user.email, { user_id: user.user_id });

    return Response.build(true, 'Login berhasil', {
      user_id: String(user.user_id),
      nama: String(user.nama),
      email: String(user.email),
      role: String(user.role),
      status: String(user.status),
      last_login: now,
    });
  },
};
