const { run, get, all } = require('../config/database')

/**
 * Create a new media record for a post.
 * Returns the new media.id.
 */
const add = async (postId, url = '') => {
    const sql = `
    INSERT INTO media (post_id, url)
    VALUES (?, ?)
  `
    const result = await run(sql, [postId, url])
    return result.lastID
}

/**
 * Update the URL of an existing media record.
 */
const updateUrl = (id, url) => {
    const sql = `
    UPDATE media
    SET url = ?
    WHERE id = ?
  `
    return run(sql, [url, id])
}

/**
 * Fetch all media items for a given post, ordered by id.
 * Returns an array of { id, url }.
 */
const byPost = postId => {
    const sql = `
    SELECT id, url
    FROM media
    WHERE post_id = ?
    ORDER BY id
  `
    return all(sql, [postId])
}

/**
 * Count how many media items are attached to a given post.
 */
const countByPost = async postId => {
    const sql = `
    SELECT COUNT(*) AS cnt
    FROM media
    WHERE post_id = ?
  `
    const row = await get(sql, [postId])
    return row.cnt
}

module.exports = {
    add,
    updateUrl,
    byPost,
    countByPost
}