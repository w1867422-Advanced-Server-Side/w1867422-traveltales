const { run, all } = require('../config/database');

async function follow(userId, targetId) {
    await run(
        `INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)`,
        [userId, targetId]
    );
}

async function unfollow(userId, targetId) {
    await run(
        `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
        [userId, targetId]
    );
}

async function getFollowing(userId) {
    return all(
        `SELECT u.id, u.username FROM follows f
     JOIN users u ON f.following_id = u.id
     WHERE f.follower_id = ?`,
        [userId]
    );
}

async function getFollowers(userId) {
    return all(
        `SELECT u.id, u.username FROM follows f
     JOIN users u ON f.follower_id = u.id
     WHERE f.following_id = ?`,
        [userId]
    );
}

module.exports = { follow, unfollow, getFollowing, getFollowers };
