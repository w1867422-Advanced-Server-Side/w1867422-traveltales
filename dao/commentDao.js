const { run, all, get } = require('../config/database')

/**
 * Insert a new comment.
 * Returns the created comment (with its new ID).
 */
const createComment = async (userId, postId, content) => {
    const sql = `
    INSERT INTO post_comments (user_id, post_id, content)
    VALUES (?, ?, ?)
  `
    const result = await run(sql, [userId, postId, content])
    return { id: result.lastID, user_id: userId, post_id: postId, content }
}

/**
 * Fetch all comments for a given post, newest first,
 * along with author username and timestamp.
 */
const getCommentsByPost = async postId => {
    const sql = `
    SELECT
      c.id,
      c.content,
      c.created_at,
      u.id       AS user_id,
      u.username
    FROM post_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
  `
    return all(sql, [postId])
}

/**
 * Find a single comment by its ID.
 * Returns null if not found.
 */
const findCommentById = async commentId => {
    const sql = `SELECT * FROM post_comments WHERE id = ?`
    return get(sql, [commentId])
}

/**
 * Delete a comment by its ID.
 * Returns the deleted comment’s ID.
 */
const deleteComment = async commentId => {
    const sql = `DELETE FROM post_comments WHERE id = ?`
    await run(sql, [commentId])
    return { id: commentId }
}

module.exports = {
    createComment,
    getCommentsByPost,
    findCommentById,
    deleteComment,
}