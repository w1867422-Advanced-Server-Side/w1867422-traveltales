const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/commentController');

// Create a new comment on a post
router.post(
    '/:postId/comments',
    auth,
    ctrl.createComment
);

// List all comments for a post (public)
router.get(
    '/:postId/comments',
    ctrl.listComments
);

// Delete a comment (only the owner)
router.delete(
    '/comments/:id',
    auth,
    ctrl.deleteComment
);

module.exports = router;