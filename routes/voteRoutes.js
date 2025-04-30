const router = require('express').Router();
const ctrl   = require('../controllers/voteController');
const auth   = require('../middleware/authMiddleware');

router.post('/:postId/like',    auth, ctrl.likePost);
router.post('/:postId/dislike', auth, ctrl.dislikePost);
router.delete('/:postId/vote',  auth, ctrl.unvotePost);
router.get('/:postId/votes',    ctrl.getVotes);

module.exports = router;
