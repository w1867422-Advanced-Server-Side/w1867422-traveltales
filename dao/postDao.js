const { run, get, all } = require('../config/database');

exports.createPost = async (authorId, {title,content,country,visitDate}) => {
    const r = await run(
        `INSERT INTO posts (author_id,title,content,country,visit_date)
     VALUES (?,?,?,?,?)`,
        [authorId,title,content,country,visitDate]
    );
    return r.lastID;
};

exports.getPostById = id =>
    get(
        `SELECT p.*, u.username AS author
       FROM posts p JOIN users u ON p.author_id = u.id
      WHERE p.id = ?`, [id]
    );

exports.listPosts = ({ limit=10, offset=0, authorId, country }) => {
    let sql = `SELECT p.*, u.username AS author
               FROM posts p JOIN users u ON p.author_id = u.id`;
    const params=[];
    const where=[];
    if (authorId){ where.push('author_id = ?'); params.push(authorId); }
    if (country ){ where.push('country = ?');   params.push(country ); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    return all(sql, params);
};

exports.updatePost = (id,{title,content,country,visitDate}) =>
    run(
        `UPDATE posts
        SET title=?,content=?,country=?,visit_date=?
      WHERE id=?`,
        [title,content,country,visitDate,id]
    );

exports.deletePost = id =>
    run(`DELETE FROM posts WHERE id=?`,[id]);
