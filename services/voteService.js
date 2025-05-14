const voteDao = require('../dao/voteDao')

/**
 * Register a “like” (is_like = true) by this user on the given post.
 */
const addLike = (userId, postId) =>
    voteDao.vote(userId, postId, true)

/**
 * Register a “dislike” (is_like = false) by this user on the given post.
 */
const addDislike = (userId, postId) =>
    voteDao.vote(userId, postId, false)

/**
 * Remove any existing vote (like or dislike) by this user on the post.
 */
const removeVote = (userId, postId) =>
    voteDao.unvote(userId, postId)

/**
 * Get the total likes & dislikes for the given post.
 */
const getTotals = postId =>
    voteDao.totals(postId)

/**
 * Get how the given user has voted on the post.
 * Resolves to true (liked), false (disliked), or null (no vote).
 */
const getUserVote = (userId, postId) =>
    voteDao.userVote(userId, postId)

module.exports = {
    addLike,
    addDislike,
    removeVote,
    getTotals,
    getUserVote
}