const { run, all } = require('../config/database')

/**
 * Follow a user: insert a (follower → following) link, ignore if already exists.
 */
const follow = async (userId, targetId) => {
    const sql = `
    INSERT OR IGNORE INTO follows (follower_id, following_id)
    VALUES (?, ?)
  `
    await run(sql, [userId, targetId])
}

/**
 * Unfollow a user: remove the (follower → following) link.
 */
const unfollow = async (userId, targetId) => {
    const sql = `
    DELETE FROM follows
    WHERE follower_id = ? AND following_id = ?
  `
    await run(sql, [userId, targetId])
}

/**
 * Get all users that the given user is following.
 * Returns an array of { id, username }.
 */
const getFollowing = async userId => {
    const sql = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u
      ON f.following_id = u.id
    WHERE f.follower_id = ?
  `
    return all(sql, [userId])
}

/**
 * Get all users who are following the given user.
 * Returns an array of { id, username }.
 */
const getFollowers = async userId => {
    const sql = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u
      ON f.follower_id = u.id
    WHERE f.following_id = ?
  `
    return all(sql, [userId])
}

module.exports = {
    follow,
    unfollow,
    getFollowing,
    getFollowers,
}