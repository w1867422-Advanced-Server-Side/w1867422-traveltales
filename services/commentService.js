const commentDao = require('../dao/commentDao')
const createError = require('http-errors')

/**
 * Add a new comment to a post.
 * Throws 400 if content is empty.
 */
const addComment = async (userId, postId, content) => {
    if (!content || !content.trim()) {
        throw createError(400, 'Comment cannot be empty')
    }
    return commentDao.createComment(userId, postId, content.trim())
}

/**
 * List all comments for a given post.
 */
const listComments = postId => {
    return commentDao.getCommentsByPost(postId)
}

/**
 * Remove a comment if the current user is its author.
 * Throws 404 if not found, 403 if not the owner.
 */
const removeComment = async (userId, commentId) => {
    const comment = await commentDao.findCommentById(commentId)
    if (!comment) {
        throw createError(404, 'Comment not found')
    }
    if (comment.user_id !== userId) {
        throw createError(403, 'You can only delete your own comments')
    }
    return commentDao.deleteComment(commentId)
}

module.exports = {
    addComment,
    listComments,
    removeComment
}