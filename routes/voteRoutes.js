const router  = require('express').Router();
const ctrl    = require('../controllers/voteController');
const auth    = require('../middleware/authMiddleware');

router.get('/:postId/votes', ctrl.getVotes);

router.get('/:postId/vote',  auth, ctrl.getUserVote);
router.post('/:postId/like',    auth, ctrl.likePost);
router.post('/:postId/dislike', auth, ctrl.dislikePost);
router.delete('/:postId/vote',  auth, ctrl.unvotePost);

module.exports = router;