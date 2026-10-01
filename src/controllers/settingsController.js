const settingsService = require('../services/settingsService');
const { buildInvitation } = require('../services/invitationService');
const { validate } = require('../utils/validators');
const { badRequest } = require('../utils/httpError');
const schemas = require('../utils/schemas');

const ok = (res, data) => res.json({ success: true, data });

async function getInvitation(req, res) {
  ok(res, await buildInvitation({ admin: true }));
}

async function updateWedding(req, res) {
  const { sections, ...rest } = req.body || {};
  const data = validate(rest, schemas.weddingSchema);
  const validSections = sections === undefined ? undefined : validate(sections, schemas.sectionsSchema);
  await settingsService.updateWedding(data, validSections);
  ok(res, (await buildInvitation({ admin: true })).wedding);
}

async function updateContent(req, res) {
  const data = validate(req.body, schemas.contentSchema);
  if (!Object.keys(data).length) throw badRequest('No hay cambios para guardar');
  ok(res, await settingsService.updateContent(data));
}

async function updateTheme(req, res) {
  ok(res, await settingsService.updateTheme(validate(req.body, schemas.themeSchema)));
}

const singletonHandler = (modelName, schema, defaults) => async (req, res) => {
  ok(res, await settingsService.upsertSingleton(modelName, validate(req.body, schema), defaults));
};

const updateWhatsapp = singletonHandler('whatsappConfig', schemas.whatsappSchema, {
  title: 'Confirma tu asistencia',
  message: 'Confirmo asistencia a nombre de: ',
});
const updateGifts = singletonHandler('giftRegistry', schemas.giftSchema, { title: 'Mesa de regalos' });
const updateBank = singletonHandler('bankInfo', schemas.bankSchema, { title: 'Datos bancarios' });

module.exports = {
  getInvitation,
  updateWedding,
  updateContent,
  updateTheme,
  updateWhatsapp,
  updateGifts,
  updateBank,
};
