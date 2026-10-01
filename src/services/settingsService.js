const prisma = require('../config/prisma');
const { getWeddingId, getFullWedding, mergeContent, mergeSections, serializeTheme } = require('./weddingService');
const { zonedTimeToUtc } = require('../utils/timezone');
const { DEFAULT_THEME } = require('../utils/defaults');

/** Actualiza datos centrales. Recalcula weddingDate si cambia fecha, hora o zona horaria. */
async function updateWedding(data, sections) {
  const current = await getFullWedding();
  const next = { ...data };

  if (data.eventDate || data.eventTime || data.timezone) {
    next.weddingDate = zonedTimeToUtc(
      data.eventDate || current.eventDate,
      data.eventTime || current.eventTime,
      data.timezone || current.timezone
    );
  }
  if (sections) next.sections = { ...mergeSections(current.sections), ...sections };

  return prisma.wedding.update({ where: { id: current.id }, data: next });
}

async function updateContent(partial) {
  const current = await getFullWedding();
  const content = { ...mergeContent(current.content), ...partial };
  await prisma.wedding.update({ where: { id: current.id }, data: { content } });
  return content;
}

async function updateTheme(data) {
  const weddingId = await getWeddingId();
  const theme = await prisma.weddingTheme.upsert({
    where: { weddingId },
    update: data,
    create: { ...DEFAULT_THEME, ...data, weddingId },
  });
  return serializeTheme(theme);
}

/** Actualiza (o crea) un registro uno-a-uno de la boda: whatsapp, giftRegistry, bankInfo. */
async function upsertSingleton(modelName, data, defaults) {
  const weddingId = await getWeddingId();
  const { id, weddingId: _w, updatedAt, ...record } = await prisma[modelName].upsert({
    where: { weddingId },
    update: data,
    create: { ...defaults, ...data, weddingId },
  });
  return record;
}

module.exports = { updateWedding, updateContent, updateTheme, upsertSingleton };
