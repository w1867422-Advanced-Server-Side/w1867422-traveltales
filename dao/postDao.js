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

/* Post List */
exports.list = ({
                    limit   = 10,
                    offset  = 0,
                    sortBy  = 'newest',
                    search  = '',
                    type    = 'title'
                } = {}) => {
    // ORDER BY
    let orderClause = 'p.created_at DESC';
    if (sortBy === 'likes')    orderClause = 'v.likes DESC';
    if (sortBy === 'comments') orderClause = 'c.cnt DESC';

    // For searching, variable WHERE clause
    let whereClause = '';
    const params     = [];
    if (search) {
        const pattern = `%${search}%`;
        if (type === 'title') {
            whereClause = 'WHERE p.title LIKE ?';
        } else if (type === 'author') {
            whereClause = 'WHERE u.username LIKE ?';
        } else if (type === 'country') {
            whereClause = 'WHERE p.country LIKE ?';
        }
        params.push(pattern);
    }

    // Join votes/comments, apply WHERE, ORDER, LIMIT/OFFSET
    const sql = `
    SELECT
      p.*,
      u.username          AS author,
      COALESCE(v.likes,0)    AS likes,
      COALESCE(v.dislikes,0) AS dislikes,
      COALESCE(c.cnt,0)      AS comments
    FROM posts p
    JOIN users u
      ON u.id = p.author_id

    /* vote aggregates */
    LEFT JOIN (
      SELECT 
        post_id,
        SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
        SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
      FROM post_votes
      GROUP BY post_id
    ) v ON v.post_id = p.id

    /* comment count */
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS cnt
      FROM post_comments
      GROUP BY post_id
    ) c ON c.post_id = p.id

    ${whereClause}
    ORDER BY ${orderClause}
    LIMIT ? OFFSET ?
  `;

    params.push(limit, offset);
    return all(sql, params);
};

/* Personal Feed */
exports.listByAuthors = async function({
                                           authorIds = [],
                                           limit   = 10,
                                           offset  = 0,
                                           sortBy  = 'newest',
                                           search  = '',
                                           type    = 'title'
                                       } = {}) {
    if (authorIds.length === 0) return [];

    // placeholders for the IN(...) list
    const authorPlaceholders = authorIds.map(() => '?').join(',');

    let orderClause = 'p.created_at DESC';
    if (sortBy === 'likes')    orderClause = 'v.likes DESC';
    if (sortBy === 'comments') orderClause = 'c.cnt DESC';

    // WHERE on search/type
    let whereClause = `WHERE p.author_id IN (${authorPlaceholders})`;
    const params     = [...authorIds];

    if (search) {
        const pattern = `%${search}%`;
        if (type === 'title') {
            whereClause += ' AND p.title   LIKE ?';
        } else if (type === 'author') {
            whereClause += ' AND u.username LIKE ?';
        } else if (type === 'country') {
            whereClause += ' AND p.country LIKE ?';
        }
        params.push(pattern);
    }

    // JOIN votes/comments subqueries
    const sql = `
    SELECT
      p.*,
      u.username           AS author,
      COALESCE(v.likes,0)    AS likes,
      COALESCE(v.dislikes,0) AS dislikes,
      COALESCE(c.cnt,0)      AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id

    /* vote aggregates */
    LEFT JOIN (
      SELECT post_id,
             SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
             SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
      FROM post_votes
      GROUP BY post_id
    ) v ON v.post_id = p.id

    /* comment count */
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS cnt
      FROM post_comments
      GROUP BY post_id
    ) c ON c.post_id = p.id

    ${whereClause}
    ORDER BY ${orderClause}
    LIMIT ? OFFSET ?
  `;

    // push paging params
    params.push(limit, offset);

    return all(sql, params);
};