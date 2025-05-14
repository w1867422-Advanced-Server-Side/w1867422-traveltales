const commentService = require('../services/commentService');
const { catchAsync } = require('../utils/errorHandler');

/**
 * Helper to parse & validate a postId path param.
 * Returns the integer ID, or sends 400 and returns null.
 */
const parsePostId = (req, res) => {
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return null;
    }
    return postId;
};

/**
 * Helper to parse & validate a commentId path param.
 * Returns the integer ID, or sends 400 and returns null.
 */
const parseCommentId = (req, res) => {
    const commentId = Number(req.params.commentId ?? req.params.id);
    if (!Number.isInteger(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return null;
    }
    return commentId;
};

/**
 * POST /posts/:postId/comments
 * Create a new comment on a post.
 */
const createComment = catchAsync(async (req, res) => {
    const postId = parsePostId(req, res);
    if (postId === null) return;

    const userId = req.user.id;
    const { content } = req.body;

    const comment = await commentService.addComment(userId, postId, content);
    res.status(201).json(comment);
});

/**
 * GET /posts/:postId/comments
 * List all comments for a given post.
 */
const listComments = catchAsync(async (req, res) => {
    const postId = parsePostId(req, res);
    if (postId === null) return;

    const comments = await commentService.listComments(postId);
    res.json(comments);
});

/**
 * DELETE /posts/:postId/comments/:commentId
 * Delete a comment (only by its author).
 */
const deleteComment = catchAsync(async (req, res) => {
    const commentId = parseCommentId(req, res);
    if (commentId === null) return;

    const userId = req.user.id;
    await commentService.removeComment(userId, commentId);
    res.sendStatus(204);
});

module.exports = {
    createComment,
    listComments,
    deleteComment
};