const prisma = require('../config/prisma');
const { notFound } = require('../utils/httpError');
const { DEFAULT_CONTENT, DEFAULT_SECTIONS, DEFAULT_THEME } = require('../utils/defaults');

const ordered = { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] };

const fullInclude = {
  theme: true,
  locations: ordered,
  schedule: ordered,
  gallery: ordered,
  giftRegistry: true,
  whatsapp: true,
  bankInfo: true,
};

const NOT_CONFIGURED = 'La invitacion aun no ha sido configurada. Ejecuta el seed.';

/** La aplicacion administra una sola boda: se toma el primer registro. */
async function getWeddingId() {
  const wedding = await prisma.wedding.findFirst({ select: { id: true }, orderBy: { createdAt: 'asc' } });
  if (!wedding) throw notFound(NOT_CONFIGURED);
  return wedding.id;
}

async function getFullWedding() {
  const wedding = await prisma.wedding.findFirst({ include: fullInclude, orderBy: { createdAt: 'asc' } });
  if (!wedding) throw notFound(NOT_CONFIGURED);
  return wedding;
}

const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

function mergeContent(content) {
  return { ...DEFAULT_CONTENT, ...asObject(content) };
}

function mergeSections(sections) {
  return { ...DEFAULT_SECTIONS, ...asObject(sections) };
}

const THEME_KEYS = Object.keys(DEFAULT_THEME);

function serializeTheme(theme) {
  const source = theme || DEFAULT_THEME;
  return Object.fromEntries(THEME_KEYS.map((key) => [key, source[key] ?? DEFAULT_THEME[key]]));
}

module.exports = { getWeddingId, getFullWedding, mergeContent, mergeSections, serializeTheme };
