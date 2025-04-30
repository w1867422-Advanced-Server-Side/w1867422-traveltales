const { run, get } = require('../config/database');

async function votePost(userId, postId, isLike) {
    await run(
        `INSERT INTO post_votes (user_id, post_id, is_like)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, post_id) DO UPDATE SET is_like = excluded.is_like, created_at = CURRENT_TIMESTAMP`,
        [userId, postId, isLike ? 1 : 0]
    );
}

async function unvotePost(userId, postId) {
    await run(
        `DELETE FROM post_votes WHERE user_id = ? AND post_id = ?`,
        [userId, postId]
    );
}

async function countLikes(postId) {
    const row = await get(
        `SELECT SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
     FROM post_votes WHERE post_id = ?`,
        [postId]
    );
    return { likes: row.likes||0, dislikes: row.dislikes||0 };
}

async function getUserVote(userId, postId) {
    const row = await get(
        `SELECT is_like FROM post_votes WHERE user_id = ? AND post_id = ?`,
        [userId, postId]
    );
    return row ? !!row.is_like : null;  // true, false, or null
}

module.exports = { votePost, unvotePost, countLikes, getUserVote };
