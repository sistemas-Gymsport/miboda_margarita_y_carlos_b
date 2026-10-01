/**
 * Validador declarativo minimo.
 * Cada regla recibe el valor crudo y devuelve el valor limpio o lanza un mensaje.
 */
const { sanitizeText, isSafeUrl } = require('./sanitize');
const { badRequest } = require('./httpError');

class RuleError extends Error {}

const rules = {
  string: (max = 200, { required = false } = {}) => (value) => {
    const text = sanitizeText(value);
    if (required && !text) throw new RuleError('es obligatorio');
    if (text.length > max) throw new RuleError(`admite maximo ${max} caracteres`);
    return text;
  },
  text: (max = 3000) => (value) => {
    const text = sanitizeText(value, { multiline: true });
    if (text.length > max) throw new RuleError(`admite maximo ${max} caracteres`);
    return text;
  },
  url: () => (value) => {
    const text = sanitizeText(value);
    if (!isSafeUrl(text)) throw new RuleError('debe ser un enlace valido que comience con https://');
    return text;
  },
  boolean: () => (value) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new RuleError('debe ser verdadero o falso');
  },
  number: (min, max) => (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) throw new RuleError('debe ser numerico');
    if (num < min || num > max) throw new RuleError(`debe estar entre ${min} y ${max}`);
    return num;
  },
  color: () => (value) => {
    const text = String(value || '').trim();
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text)) throw new RuleError('debe ser un color hexadecimal');
    return text.toUpperCase();
  },
  oneOf: (list) => (value) => {
    if (!list.includes(value)) throw new RuleError('no es una opcion valida');
    return value;
  },
  date: () => (value) => {
    const text = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(`${text}T00:00:00Z`))) {
      throw new RuleError('debe tener formato AAAA-MM-DD');
    }
    return text;
  },
  time: ({ optional = false } = {}) => (value) => {
    const text = String(value || '').trim();
    if (optional && !text) return '';
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) throw new RuleError('debe tener formato HH:mm');
    return text;
  },
  timezone: () => (value) => {
    const text = String(value || '').trim();
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: text });
      return text;
    } catch {
      throw new RuleError('no es una zona horaria valida');
    }
  },
  digits: (maxLength) => (value) => {
    const text = String(value ?? '').replace(/\D/g, '');
    if (text.length > maxLength) throw new RuleError(`admite maximo ${maxLength} digitos`);
    return text;
  },
};

/**
 * Valida el cuerpo contra un esquema y devuelve solo las claves permitidas presentes.
 */
function validate(body, schema, { partial = true } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw badRequest('Datos invalidos');
  }
  const result = {};
  const errors = {};
  for (const [key, rule] of Object.entries(schema)) {
    if (!(key in body)) {
      if (!partial) errors[key] = 'es obligatorio';
      continue;
    }
    try {
      result[key] = rule(body[key]);
    } catch (err) {
      if (err instanceof RuleError) errors[key] = err.message;
      else throw err;
    }
  }
  const keys = Object.keys(errors);
  if (keys.length) {
    throw badRequest(`Revisa el campo "${keys[0]}": ${errors[keys[0]]}`, errors);
  }
  return result;
}

module.exports = { rules, validate };
