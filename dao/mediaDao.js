const { run, all, get } = require('../config/database');

exports.addImage = async (postId,url='') =>
    (await run(`INSERT INTO media(post_id,url) VALUES(?,?)`,[postId,url])).lastID;

exports.updateImageUrl = (id,url) =>
    run(`UPDATE media SET url=? WHERE id=?`,[url,id]);

exports.getImagesByPost = postId =>
    all(`SELECT id,url FROM media WHERE post_id=? ORDER BY id`,[postId]);

exports.countImagesByPost = postId =>
    get(`SELECT COUNT(*) AS cnt FROM media WHERE post_id=?`,[postId])
        .then(r=>r.cnt);