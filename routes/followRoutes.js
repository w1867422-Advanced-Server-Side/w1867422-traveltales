const router = require('express').Router();
const ctrl   = require('../controllers/followController');
const auth   = require('../middleware/authMiddleware');

router.post('/:userId/follow',   auth, ctrl.follow);
router.delete('/:userId/follow', auth, ctrl.unfollow);
router.get('/following',         auth, ctrl.listFollowing);
router.get('/:userId/followers', ctrl.listFollowers);

module.exports = router;
