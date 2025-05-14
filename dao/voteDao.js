const { run, get } = require('../config/database')

/**
 * Insert or update a user’s vote on a post.
 * If a vote already exists, it updates the is_like flag and timestamp.
 */
const vote = async (userId, postId, isLike) => {
    const sql = `
    INSERT INTO post_votes (user_id, post_id, is_like)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, post_id)
    DO UPDATE SET
      is_like    = excluded.is_like,
      created_at = CURRENT_TIMESTAMP
  `
    return run(sql, [userId, postId, isLike ? 1 : 0])
}

/**
 * Remove a user’s vote from a post.
 */
const unvote = async (userId, postId) => {
    const sql = `
    DELETE FROM post_votes
    WHERE user_id = ? AND post_id = ?
  `
    return run(sql, [userId, postId])
}

/**
 * Count total likes and dislikes for a given post.
 * Returns an object { likes: number, dislikes: number }.
 */
const totals = async postId => {
    const sql = `
    SELECT
      SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
      SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
    FROM post_votes
    WHERE post_id = ?
  `
    const row = await get(sql, [postId])
    return {
        likes:    row.likes    || 0,
        dislikes: row.dislikes || 0
    }
}

/**
 * Get how the given user voted on the given post.
 * Returns true for like, false for dislike, or null for no vote.
 */
const userVote = async (userId, postId) => {
    const sql = `
    SELECT is_like
    FROM post_votes
    WHERE user_id = ? AND post_id = ?
  `
    const row = await get(sql, [userId, postId])
    return row ? Boolean(row.is_like) : null
}

module.exports = {
    vote,
    unvote,
    totals,
    userVote
}