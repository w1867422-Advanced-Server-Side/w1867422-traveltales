const router = require('express').Router();
const followController   = require('../controllers/followController');
const auth   = require('../middleware/authMiddleware');

router.post('/:userId/follow',   auth, followController.follow);
router.delete('/:userId/follow', auth, followController.unfollow);
router.get('/following',         auth, followController.listFollowing);
router.get('/:userId/followers', followController.listFollowers);

module.exports = router;
