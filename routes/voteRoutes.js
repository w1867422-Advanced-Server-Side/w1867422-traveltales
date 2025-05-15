const router  = require('express').Router();
const voteController    = require('../controllers/voteController');
const auth    = require('../middleware/authMiddleware');

router.get('/:postId/votes', voteController.getVotes);

router.get('/:postId/vote',  auth, voteController.getUserVote);
router.post('/:postId/like',    auth, voteController.likePost);
router.post('/:postId/dislike', auth, voteController.dislikePost);
router.delete('/:postId/vote',  auth, voteController.unvotePost);

module.exports = router;