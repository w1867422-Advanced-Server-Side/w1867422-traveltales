const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const commentController   = require('../controllers/commentController');

// Create a new comment on a post
router.post(
    '/:postId/comments',
    auth,
    commentController.createComment
);

// List all comments for a post (public)
router.get(
    '/:postId/comments',
    commentController.listComments
);

// Delete a comment (only the owner)
router.delete(
    '/comments/:id',
    auth,
    commentController.deleteComment
);

module.exports = router;