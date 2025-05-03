const { run, get, all } = require('../config/database');

exports.create = async (authorId, { title, content, country, visitDate }) => {
    const r = await run(
        `INSERT INTO posts (author_id,title,content,country,visit_date)
       VALUES (?,?,?,?,?)`,
        [authorId, title, content, country, visitDate]
    );
    return r.lastID;
};

exports.update = (id, dto) =>
    run(
        `UPDATE posts
       SET title=?, content=?, country=?, visit_date=?
     WHERE id=?`,
        [dto.title, dto.content, dto.country, dto.visitDate, id]
    );

exports.remove = id => run(`DELETE FROM posts WHERE id=?`, [id]);

exports.byId = id =>
    get(
        `SELECT p.*, u.username AS author
       FROM posts p JOIN users u ON u.id = p.author_id
     WHERE p.id=?`,
        [id]
    );

exports.list = (limit, offset, sortBy) => {
    let order = 'p.created_at DESC';
    if (sortBy === 'likes')    order = 'likes DESC';
    if (sortBy === 'comments') order = 'comments DESC';

    return all(
        `SELECT
        p.*,
        u.username AS author,
        COALESCE(v.likes,0)    AS likes,
        COALESCE(v.dislikes,0) AS dislikes
     FROM posts p
     JOIN users u ON u.id = p.author_id
     LEFT JOIN (
        SELECT post_id,
          SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
        FROM post_votes GROUP BY post_id
     ) v ON v.post_id = p.id
     ORDER BY ${order}
     LIMIT ? OFFSET ?`,
        [limit, offset]
    );
};