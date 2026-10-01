/** Sanitizacion basica de texto: elimina etiquetas HTML y caracteres de control. */
function sanitizeText(value, { multiline = false } = {}) {
  let text = String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  text = text.replace(/\r\n/g, '\n');
  if (!multiline) text = text.replace(/\n+/g, ' ');
  return text.trim();
}

function isSafeUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

module.exports = { sanitizeText, isSafeUrl };
