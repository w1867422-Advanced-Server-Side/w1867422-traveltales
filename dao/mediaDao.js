const { run, all } = require('../config/db');

async function addImage(postId, url) {
    const result = await run(
        `INSERT INTO media (post_id, url) VALUES (?, ?)`,
        [postId, url]
    );
    return result.lastID;
}

async function updateImageUrl(id, url) {
    await run(
        `UPDATE media SET url = ? WHERE id = ?`,
        [url, id]
    );
}

async function getImagesByPost(postId) {
    return all(
        `SELECT id, url FROM media WHERE post_id = ? ORDER BY id`,
        [postId]
    );
}

async function countImagesByPost(postId) {
    const row = await all(
        `SELECT COUNT(*) as cnt FROM media WHERE post_id = ?`,
        [postId]
    );
    return row[0].cnt;
}

module.exports = { addImage, getImagesByPost, countImagesByPost, updateImageUrl };
