const commentService = require('../services/commentService');
const { catchAsync } = require('../utils/errorHandler');

exports.createComment = catchAsync(async (req, res) => {
    const userId   = req.user.id;
    const postId   = parseInt(req.params.postId, 10);
    const { content } = req.body;

    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    const comment = await commentService.addComment(userId, postId, content);
    res.status(201).json(comment);
});

exports.listComments = catchAsync(async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }
    const comments = await commentService.listComments(postId);
    res.json(comments);
});

exports.deleteComment = catchAsync(async (req, res) => {
    const userId    = req.user.id;
    const commentId = parseInt(req.params.id, 10);
    if (isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    await commentService.removeComment(userId, commentId);
    res.sendStatus(204);
});