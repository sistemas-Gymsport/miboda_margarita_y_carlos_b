const prisma = require('../config/prisma');
const { getWeddingId } = require('./weddingService');
const { badRequest, notFound } = require('../utils/httpError');

/**
 * Servicio generico para colecciones ordenables de la boda (itinerario, ubicaciones).
 */
function createCollectionService(modelName) {
  const model = prisma[modelName];
  const orderBy = [{ sortOrder: 'asc' }, { createdAt: 'asc' }];

  async function list() {
    const weddingId = await getWeddingId();
    return model.findMany({ where: { weddingId }, orderBy });
  }

  async function create(data) {
    const weddingId = await getWeddingId();
    const last = await model.findFirst({ where: { weddingId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } });
    return model.create({ data: { ...data, weddingId, sortOrder: (last?.sortOrder ?? -1) + 1 } });
  }

  async function ensureOwned(id) {
    const weddingId = await getWeddingId();
    const item = await model.findFirst({ where: { id, weddingId }, select: { id: true } });
    if (!item) throw notFound();
  }

  async function update(id, data) {
    await ensureOwned(id);
    return model.update({ where: { id }, data });
  }

  async function remove(id) {
    await ensureOwned(id);
    await model.delete({ where: { id } });
  }

  async function reorder(ids) {
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'string')) {
      throw badRequest('Orden invalido');
    }
    const weddingId = await getWeddingId();
    const existing = await model.findMany({ where: { weddingId }, select: { id: true } });
    const known = new Set(existing.map((item) => item.id));
    if (ids.length !== known.size || !ids.every((id) => known.has(id))) {
      throw badRequest('El orden enviado no coincide con los elementos actuales');
    }
    await prisma.$transaction(ids.map((id, index) => model.update({ where: { id }, data: { sortOrder: index } })));
    return list();
  }

  return { list, create, update, remove, reorder };
}

module.exports = { createCollectionService };
