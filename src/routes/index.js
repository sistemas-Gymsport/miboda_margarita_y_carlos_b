const { Router } = require('express');
const publicController = require('../controllers/publicController');
const auth = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');
const adminRoutes = require('./adminRoutes');

const router = Router();

// Salud: no consulta la base de datos y responde de inmediato.
router.get('/health', publicController.health);

// Publico
router.get('/public/invitation', publicController.getInvitation);

// Autenticacion
router.post('/auth/login', loginLimiter, auth.login);
router.post('/auth/logout', auth.logout);
router.get('/auth/me', requireAuth, auth.me);
router.put('/auth/password', requireAuth, loginLimiter, auth.changePassword);

// Administracion
router.use('/admin', adminRoutes);

module.exports = router;
