const { rules } = require('./validators');
const { DEFAULT_CONTENT, DEFAULT_SECTIONS, HEADING_FONTS, BODY_FONTS, SCHEDULE_ICONS, PALETTES } = require('./defaults');

const COLOR_KEYS = [
  'colorBackground',
  'colorSurface',
  'colorPrimary',
  'colorSecondary',
  'colorAccent',
  'colorText',
  'colorMuted',
  'colorButton',
  'colorButtonText',
  'colorLine',
  'heroOverlay',
];

const weddingSchema = {
  partnerOne: rules.string(60, { required: true }),
  partnerTwo: rules.string(60, { required: true }),
  eventDate: rules.date(),
  eventTime: rules.time(),
  timezone: rules.timezone(),
  introEnabled: rules.boolean(),
  seoTitle: rules.string(120),
  seoDescription: rules.string(300),
};

const sectionsSchema = Object.fromEntries(Object.keys(DEFAULT_SECTIONS).map((key) => [key, rules.boolean()]));

const contentSchema = Object.fromEntries(Object.keys(DEFAULT_CONTENT).map((key) => [key, rules.text(2000)]));

const themeSchema = {
  palette: rules.oneOf([...Object.keys(PALETTES), 'custom']),
  ...Object.fromEntries(COLOR_KEYS.map((key) => [key, rules.color()])),
  heroOverlayOpacity: rules.number(0, 0.9),
  fontHeading: rules.oneOf(HEADING_FONTS),
  fontBody: rules.oneOf(BODY_FONTS),
};

const scheduleSchema = {
  title: rules.string(80, { required: true }),
  time: rules.time(),
  description: rules.text(400),
  icon: rules.oneOf(SCHEDULE_ICONS),
};

const locationSchema = {
  type: rules.oneOf(['CEREMONY', 'RECEPTION', 'OTHER']),
  label: rules.string(60, { required: true }),
  name: rules.string(120, { required: true }),
  address: rules.text(300),
  date: rules.string(80),
  time: rules.time({ optional: true }),
  description: rules.text(600),
  mapUrl: rules.url(),
  buttonText: rules.string(40),
  isVisible: rules.boolean(),
};

const whatsappSchema = {
  enabled: rules.boolean(),
  countryCode: rules.digits(4),
  phone: rules.digits(15),
  message: rules.text(500),
  buttonText: rules.string(60),
  title: rules.string(120),
  description: rules.text(600),
  deadline: rules.string(120),
};

const giftSchema = {
  enabled: rules.boolean(),
  title: rules.string(120),
  description: rules.text(800),
  url: rules.url(),
  buttonText: rules.string(60),
};

const bankSchema = {
  enabled: rules.boolean(),
  title: rules.string(120),
  description: rules.text(600),
  bankName: rules.string(80),
  beneficiary: rules.string(120),
  accountNumber: rules.string(40),
  clabe: rules.digits(18),
  cardNumber: rules.digits(19),
};

module.exports = {
  weddingSchema,
  sectionsSchema,
  contentSchema,
  themeSchema,
  scheduleSchema,
  locationSchema,
  whatsappSchema,
  giftSchema,
  bankSchema,
};
