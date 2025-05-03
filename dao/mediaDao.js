const { run, all, get } = require('../config/database');

exports.add = async (postId, url='') => {
    const r = await run(
        `INSERT INTO media (post_id,url) VALUES (?,?)`,
        [postId, url]
    );
    return r.lastID;
};

exports.updateUrl = (id, url) =>
    run(`UPDATE media SET url=? WHERE id=?`, [url, id]);

exports.byPost = postId =>
    all(`SELECT id,url FROM media WHERE post_id=? ORDER BY id`, [postId]);

exports.countByPost = async postId => {
    const row = await get(`SELECT COUNT(*) AS cnt FROM media WHERE post_id=?`, [postId]);
    return row.cnt;
};