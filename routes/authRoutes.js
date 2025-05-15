const router        = require('express').Router();
const authController          = require('../controllers/authController');
const auth          = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login',    authController.login);

router.get ('/profile',  auth, authController.profile);
router.post('/logout',   auth, authController.logout);

module.exports = router;