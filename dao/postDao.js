const { run, get, all } = require('../config/db');

async function createPost(authorId, title, content, country, visitDate) {
    const result = await run(
        `INSERT INTO posts (author_id, title, content, country, visit_date)
     VALUES (?, ?, ?, ?, ?)`,
        [authorId, title, content, country, visitDate]
    );
    return result.lastID;
}

async function getPostById(id) {
    return get(
        `SELECT p.*, u.username AS author
     FROM posts p
     JOIN users u ON p.author_id = u.id
     WHERE p.id = ?`,
        [id]
    );
}

async function getAllPosts(limit = 10, offset = 0) {
    return all(
        `SELECT p.*, u.username AS author
     FROM posts p
     JOIN users u ON p.author_id = u.id
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
        [limit, offset]
    );
}

async function updatePost(id, title, content, country, visitDate) {
    const result = await run(
        `UPDATE posts
     SET title = ?, content = ?, country = ?, visit_date = ?
     WHERE id = ?`,
        [title, content, country, visitDate, id]
    );
    return result.changes;
}

async function deletePost(id) {
    const result = await run(`DELETE FROM posts WHERE id = ?`, [id]);
    return result.changes;
}

module.exports = {
    createPost,
    getPostById,
    getAllPosts,
    updatePost,
    deletePost
};
