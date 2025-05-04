const commentDao = require('../dao/commentDao');
const createError = require('http-errors');

async function addComment(userId, postId, content) {
    if (!content || !content.trim()) {
        throw createError(400, 'Comment cannot be empty');
    }
    return commentDao.createComment(userId, postId, content.trim());
}

async function listComments(postId) {
    return commentDao.getCommentsByPost(postId);
}

async function removeComment(userId, commentId) {
    const comment = await commentDao.findCommentById(commentId);
    if (!comment) {
        throw createError(404, 'Comment not found');
    }
    if (comment.user_id !== userId) {
        throw createError(403, 'You can only delete your own comments');
    }
    return commentDao.deleteComment(commentId);
}

module.exports = {
    addComment,
    listComments,
    removeComment
};