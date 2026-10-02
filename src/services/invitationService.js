const { getFullWedding, mergeContent, mergeSections, serializeTheme } = require('./weddingService');

const pick = (obj, keys) => (obj ? Object.fromEntries(keys.map((k) => [k, obj[k]])) : null);

function serializeImage(image) {
  return {
    id: image.id,
    url: image.secureUrl,
    publicId: image.publicId,
    width: image.width,
    height: image.height,
    alt: image.alt,
    isMain: image.isMain,
    sortOrder: image.sortOrder,
  };
}

const LOCATION_KEYS = ['id', 'type', 'label', 'name', 'address', 'date', 'time', 'description', 'mapUrl', 'buttonText', 'isVisible', 'sortOrder'];
const SCHEDULE_KEYS = ['id', 'title', 'time', 'description', 'icon', 'sortOrder'];
const GIFT_KEYS = ['enabled', 'title', 'description', 'url', 'buttonText'];
const WHATSAPP_KEYS = ['enabled', 'countryCode', 'phone', 'phoneSecondary', 'message', 'buttonText', 'title', 'description', 'deadline'];
const BANK_KEYS = ['enabled', 'title', 'description', 'bankName', 'beneficiary', 'accountNumber', 'clabe', 'cardNumber'];

/**
 * Construye la invitacion completa en una sola respuesta.
 * admin=true incluye secciones desactivadas y elementos ocultos.
 */
async function buildInvitation({ admin = false } = {}) {
  const w = await getFullWedding();

  const gallery = w.gallery.map(serializeImage);
  const mainImage = gallery.find((img) => img.isMain) || gallery[0] || null;

  const gift = pick(w.giftRegistry, GIFT_KEYS);
  const whatsapp = pick(w.whatsapp, WHATSAPP_KEYS);
  const bank = pick(w.bankInfo, BANK_KEYS);

  return {
    wedding: {
      partnerOne: w.partnerOne,
      partnerTwo: w.partnerTwo,
      eventDate: w.eventDate,
      eventTime: w.eventTime,
      timezone: w.timezone,
      weddingDate: w.weddingDate.toISOString(),
      introEnabled: w.introEnabled,
      seoTitle: w.seoTitle || '',
      seoDescription: w.seoDescription || '',
      sections: mergeSections(w.sections),
      mainImage,
      updatedAt: w.updatedAt.toISOString(),
    },
    content: mergeContent(w.content),
    theme: serializeTheme(w.theme),
    locations: w.locations.filter((l) => admin || l.isVisible).map((l) => pick(l, LOCATION_KEYS)),
    schedule: w.schedule.map((s) => pick(s, SCHEDULE_KEYS)),
    gallery,
    giftRegistry: admin || gift?.enabled ? gift : null,
    whatsapp: admin || whatsapp?.enabled ? whatsapp : null,
    bankInfo: admin || bank?.enabled ? bank : null,
  };
}

module.exports = { buildInvitation, serializeImage };
