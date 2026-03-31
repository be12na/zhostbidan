/**
 * Standardized JSON response helpers shared by GAS entrypoints.
 */
const Response = {
  build(success, message, data, meta) {
    return {
      success: Boolean(success),
      message: typeof message === 'string' ? message : '',
      data: data === undefined ? null : data,
      meta: meta || {}
    };
  },
  toTextOutput(payload) {
    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
      ContentService.MimeType.JSON
    );
  },
  success(data, message, meta) {
    return this.toTextOutput(this.build(true, message || 'Operation completed', data, meta));
  },
  failure(message, data, meta) {
    return this.toTextOutput(this.build(false, message || 'Something went wrong', data, meta));
  },
  wrapResult(result) {
    if (result && result.success !== undefined) {
      return this.toTextOutput(result);
    }
    return this.toTextOutput(this.build(true, '', result));
  }
};
