const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { invalidateOnMutation } = require('../middleware/invalidateCache');
const { upload, verifyImageSignatures } = require('../middleware/upload');
const settings = require('../controllers/settingsController');
const gallery = require('../controllers/galleryController');
const { createCollectionController } = require('../controllers/collectionController');
const { scheduleSchema, locationSchema } = require('../utils/schemas');

const router = Router();
router.use(requireAuth, invalidateOnMutation);

// Vista completa para el panel (una sola peticion)
router.get('/invitation', settings.getInvitation);

// Datos centrales, textos y diseno
router.put('/wedding', settings.updateWedding);
router.put('/content', settings.updateContent);
router.put('/theme', settings.updateTheme);
router.put('/whatsapp', settings.updateWhatsapp);
router.put('/gifts', settings.updateGifts);
router.put('/bank', settings.updateBank);

// Colecciones ordenables
function mountCollection(path, controller) {
  router.get(path, controller.list);
  router.post(path, controller.create);
  router.put(`${path}/reorder`, controller.reorder);
  router.put(`${path}/:id`, controller.update);
  router.delete(`${path}/:id`, controller.remove);
}

mountCollection(
  '/schedule',
  createCollectionController('scheduleItem', scheduleSchema, { title: 'Nuevo momento', time: '12:00', icon: 'sparkles' })
);
mountCollection(
  '/locations',
  createCollectionController('weddingLocation', locationSchema, { type: 'OTHER', label: 'Evento', name: 'Nuevo lugar' })
);

// Galeria (Cloudinary)
router.get('/gallery', gallery.list);
router.post('/gallery', upload.array('images', 20), verifyImageSignatures, gallery.upload);
router.put('/gallery/reorder', gallery.reorder);
router.put('/gallery/:id', gallery.update);
router.put('/gallery/:id/replace', upload.single('image'), verifyImageSignatures, gallery.replace);
router.put('/gallery/:id/main', gallery.setMain);
router.delete('/gallery/:id', gallery.remove);

module.exports = router;
