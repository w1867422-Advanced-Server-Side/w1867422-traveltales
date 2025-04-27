const { run, all } = require('../config/db');

async function addImage(postId, url) {
    const result = await run(
        `INSERT INTO media (post_id, url) VALUES (?, ?)`,
        [postId, url]
    );
    return result.lastID;
}

async function getImagesByPost(postId) {
    return all(
        `SELECT id, url FROM media WHERE post_id = ? ORDER BY id`,
        [postId]
    );
}

module.exports = { addImage, getImagesByPost };
