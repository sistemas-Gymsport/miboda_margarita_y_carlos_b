const prisma = require('../config/prisma');
const { getWeddingId } = require('./weddingService');
const { uploadImage, deleteImage } = require('./cloudinaryService');
const { serializeImage } = require('./invitationService');
const { createCollectionService } = require('./collectionService');
const { notFound } = require('../utils/httpError');
const logger = require('../utils/logger');

const collection = createCollectionService('galleryImage');

async function list() {
  return (await collection.list()).map(serializeImage);
}

async function findOwned(id) {
  const weddingId = await getWeddingId();
  const image = await prisma.galleryImage.findFirst({ where: { id, weddingId } });
  if (!image) throw notFound('Fotografia no encontrada');
  return image;
}

/** Sube varias imagenes en serie para no saturar memoria ni Cloudinary. */
async function uploadMany(files) {
  const weddingId = await getWeddingId();
  const hasMain = await prisma.galleryImage.count({ where: { weddingId, isMain: true } });
  const created = [];
  for (const file of files) {
    const uploaded = await uploadImage(file.buffer);
    try {
      const image = await collection.create({
        publicId: uploaded.publicId,
        secureUrl: uploaded.secureUrl,
        width: uploaded.width,
        height: uploaded.height,
        alt: '',
        isMain: !hasMain && created.length === 0,
      });
      created.push(image);
    } catch (error) {
      // Si falla la base de datos, evitamos dejar archivos huerfanos en Cloudinary.
      await deleteImage(uploaded.publicId);
      throw error;
    }
  }
  return created.map(serializeImage);
}

async function updateAlt(id, alt) {
  await findOwned(id);
  return serializeImage(await prisma.galleryImage.update({ where: { id }, data: { alt } }));
}

/** Reemplaza el archivo conservando posicion y datos; elimina la imagen anterior de Cloudinary. */
async function replace(id, file) {
  const current = await findOwned(id);
  const uploaded = await uploadImage(file.buffer);
  let updated;
  try {
    updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        publicId: uploaded.publicId,
        secureUrl: uploaded.secureUrl,
        width: uploaded.width,
        height: uploaded.height,
      },
    });
  } catch (error) {
    await deleteImage(uploaded.publicId);
    throw error;
  }
  await deleteImage(current.publicId);
  return serializeImage(updated);
}

async function remove(id) {
  const image = await findOwned(id);
  await prisma.galleryImage.delete({ where: { id } });
  await deleteImage(image.publicId);

  // Si se elimino la principal, la siguiente pasa a ser principal.
  if (image.isMain) {
    const next = await prisma.galleryImage.findFirst({
      where: { weddingId: image.weddingId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    if (next) await prisma.galleryImage.update({ where: { id: next.id }, data: { isMain: true } });
  }
  logger.info('Galeria', `Fotografia eliminada ${id}`);
}

async function setMain(id) {
  const image = await findOwned(id);
  await prisma.$transaction([
    prisma.galleryImage.updateMany({ where: { weddingId: image.weddingId }, data: { isMain: false } }),
    prisma.galleryImage.update({ where: { id }, data: { isMain: true } }),
  ]);
  return list();
}

async function reorder(ids) {
  return (await collection.reorder(ids)).map(serializeImage);
}

module.exports = { list, uploadMany, updateAlt, replace, remove, setMain, reorder };
