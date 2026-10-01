/**
 * Valores por defecto de la invitacion.
 * Se usan en el seed y para completar claves nuevas sin romper datos existentes.
 */

const DEFAULT_CONTENT = {
  // Introduccion
  introEyebrow: 'Te invitamos a celebrar',
  introButton: 'Abrir invitación',

  // Hero
  heroEyebrow: 'Nos casamos',
  heroSubtitle: 'Y queremos que seas parte de este día',
  heroDateText: '',
  heroScrollHint: 'Desliza',

  // Mensaje principal
  storyEyebrow: 'Nuestra historia',
  storyTitle: 'El comienzo de para siempre',
  storyMessage:
    'Hay historias que comienzan sin saber hasta dónde llegarán.\nHoy queremos celebrar contigo el momento en que decidimos caminar juntos para toda la vida.',
  storyQuote: 'Contigo, todo comienza.',

  // Cuenta regresiva
  countdownEyebrow: 'La cuenta regresiva',
  countdownTitle: 'Faltan',
  countdownDays: 'Días',
  countdownHours: 'Horas',
  countdownMinutes: 'Minutos',
  countdownSeconds: 'Segundos',
  countdownFinished: 'Hoy es el gran día',

  // Itinerario
  scheduleEyebrow: 'El gran día',
  scheduleTitle: 'Itinerario',
  scheduleSubtitle: 'Cada momento pensado para compartirlo contigo.',

  // Ubicaciones
  locationsEyebrow: 'Dónde y cuándo',
  locationsTitle: 'Te esperamos',

  // Galeria
  galleryEyebrow: 'Momentos',
  galleryTitle: 'Nuestra historia en imágenes',
  gallerySubtitle: 'Pequeños instantes que nos trajeron hasta aquí.',

  // Codigo de vestimenta
  dressCodeEyebrow: 'Código de vestimenta',
  dressCodeTitle: 'Formal',
  dressCodeDescription:
    'Queremos verte lucir espectacular. Te sugerimos vestimenta formal en tonos neutros y elegantes.',
  dressCodeNote: 'Reservamos el color blanco para la novia.',
  dressCodeWomen: 'Vestido largo o de coctel',
  dressCodeMen: 'Traje y corbata',

  // Footer / mensaje final
  closingEyebrow: 'Con todo nuestro amor',
  closingMessage: 'Gracias por ser parte de nuestra historia.',
  closingSignature: 'Te esperamos',
  footerNote: 'Hecho con cariño para nuestros invitados',

  // Estados
  errorTitle: 'Estamos preparando cada detalle',
  errorMessage: 'No pudimos cargar la invitación en este momento. Inténtalo nuevamente en unos segundos.',
  errorButton: 'Intentar nuevamente',
};

const DEFAULT_SECTIONS = {
  story: true,
  countdown: true,
  schedule: true,
  locations: true,
  gallery: true,
  dressCode: true,
  gifts: true,
  rsvp: true,
  bank: true,
  closing: true,
};

const PALETTES = {
  olivo: {
    colorBackground: '#F7F5EF',
    colorSurface: '#EEEBE1',
    colorPrimary: '#5B6342',
    colorSecondary: '#8C9270',
    colorAccent: '#B59B6A',
    colorText: '#2C2E24',
    colorMuted: '#6E705F',
    colorButton: '#5B6342',
    colorButtonText: '#F7F5EF',
    colorLine: '#C9B892',
    heroOverlay: '#1E2117',
  },
  champagne: {
    colorBackground: '#FBF8F3',
    colorSurface: '#F3ECE1',
    colorPrimary: '#8A6F4D',
    colorSecondary: '#B89C78',
    colorAccent: '#C8A96E',
    colorText: '#2F2A24',
    colorMuted: '#7A6F63',
    colorButton: '#8A6F4D',
    colorButtonText: '#FFFDF9',
    colorLine: '#D9C4A0',
    heroOverlay: '#2A2118',
  },
  terracota: {
    colorBackground: '#FAF5F0',
    colorSurface: '#F1E6DC',
    colorPrimary: '#A0583C',
    colorSecondary: '#C58B6C',
    colorAccent: '#C99A5B',
    colorText: '#33241D',
    colorMuted: '#7D6559',
    colorButton: '#A0583C',
    colorButtonText: '#FFF9F4',
    colorLine: '#DDB79C',
    heroOverlay: '#2B1A13',
  },
  rosa: {
    colorBackground: '#FBF6F5',
    colorSurface: '#F3E7E5',
    colorPrimary: '#9A6B6E',
    colorSecondary: '#C29A9B',
    colorAccent: '#B8956A',
    colorText: '#33282A',
    colorMuted: '#7E6C6E',
    colorButton: '#9A6B6E',
    colorButtonText: '#FFFAF9',
    colorLine: '#DEC2BF',
    heroOverlay: '#2A1D1F',
  },
  noche: {
    colorBackground: '#F4F5F8',
    colorSurface: '#E6E9F0',
    colorPrimary: '#1F2A44',
    colorSecondary: '#53607E',
    colorAccent: '#B4975A',
    colorText: '#1A2033',
    colorMuted: '#5F667A',
    colorButton: '#1F2A44',
    colorButtonText: '#F4F5F8',
    colorLine: '#C7B489',
    heroOverlay: '#0D1322',
  },
  marfil: {
    colorBackground: '#FFFDF8',
    colorSurface: '#F6F1E7',
    colorPrimary: '#3A3631',
    colorSecondary: '#8E867A',
    colorAccent: '#B9A27A',
    colorText: '#26231F',
    colorMuted: '#77716A',
    colorButton: '#3A3631',
    colorButtonText: '#FFFDF8',
    colorLine: '#D8CCB6',
    heroOverlay: '#1B1916',
  },
};

const DEFAULT_THEME = {
  palette: 'olivo',
  ...PALETTES.olivo,
  heroOverlayOpacity: 0.45,
  fontHeading: 'Cormorant Garamond',
  fontBody: 'Manrope',
};

const HEADING_FONTS = ['Cormorant Garamond', 'Playfair Display', 'Bodoni Moda', 'Cinzel', 'DM Serif Display'];
const BODY_FONTS = ['Inter', 'Montserrat', 'Lato', 'Manrope'];

const SCHEDULE_ICONS = ['rings', 'glass', 'utensils', 'music', 'camera', 'sparkles', 'moon', 'flower', 'clock', 'car'];

module.exports = {
  DEFAULT_CONTENT,
  DEFAULT_SECTIONS,
  DEFAULT_THEME,
  PALETTES,
  HEADING_FONTS,
  BODY_FONTS,
  SCHEDULE_ICONS,
};
