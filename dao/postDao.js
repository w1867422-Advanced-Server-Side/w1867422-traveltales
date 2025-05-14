const { run, get, all } = require('../config/database')

/** Insert a new post, returning its new ID. */
const create = async (authorId, { title, content, country, visitDate }) => {
    const sql = `
    INSERT INTO posts (author_id, title, content, country, visit_date)
    VALUES (?, ?, ?, ?, ?)
  `
    const { lastID } = await run(sql, [authorId, title, content, country, visitDate])
    return lastID
}

/** Update an existing post. */
const update = (id, { title, content, country, visitDate }) => {
    const sql = `
    UPDATE posts
    SET title      = ?,
        content    = ?,
        country    = ?,
        visit_date = ?
    WHERE id = ?
  `
    return run(sql, [title, content, country, visitDate, id])
}

/** Delete a post by its ID. */
const remove = id =>
    run(`DELETE FROM posts WHERE id = ?`, [id])

/** Fetch a single post joined to its author's username. */
const byId = id => {
    const sql = `
    SELECT p.*, u.username AS author
    FROM posts p
    JOIN users u ON u.id = p.author_id
    WHERE p.id = ?
  `
    return get(sql, [id])
}

/** Core post listing with search / sort / pagination. */
const list = ({
                  limit  = 10,
                  offset = 0,
                  sortBy = 'newest',   // 'newest' | 'likes' | 'comments'
                  search = '',
                  type   = 'title'     // 'title' | 'author' | 'country'
              } = {}) => {
    /* build ORDER BY */
    let order = 'p.created_at DESC'
    if (sortBy === 'likes')    order = 'v.likes DESC'
    if (sortBy === 'comments') order = 'c.cnt  DESC'

    /* build WHERE when searching */
    let where = ''
    const params = []
    if (search) {
        const pat = `%${search}%`
        if (type === 'title')      where = 'WHERE p.title   LIKE ?'
        else if (type === 'author')   where = 'WHERE u.username LIKE ?'
        else if (type === 'country')  where = 'WHERE p.country LIKE ?'
        params.push(pat)
    }

    const sql = `
    SELECT
      p.*,
      u.username                     AS author,
      COALESCE(v.likes,0)            AS likes,
      COALESCE(v.dislikes,0)         AS dislikes,
      COALESCE(c.cnt,0)              AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id
    /* votes aggregate */
    LEFT JOIN (
      SELECT post_id,
             SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
             SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
      FROM post_votes
      GROUP BY post_id
    ) v ON v.post_id = p.id
    /* comments aggregate */
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS cnt
      FROM post_comments
      GROUP BY post_id
    ) c ON c.post_id = p.id
    ${where}
    ORDER BY ${order}
    LIMIT ? OFFSET ?
  `
    params.push(limit, offset)
    return all(sql, params)
}

/**
 * Same as `list` but restricted to a set of author IDs
 * (used for the “My Feed” feature).
 */
const listByAuthors = async ({
                                 authorIds = [],           // array<number>
                                 limit     = 10,
                                 offset    = 0,
                                 sortBy    = 'newest',
                                 search    = '',
                                 type      = 'title'
                             } = {}) => {
    if (authorIds.length === 0) return []

    const placeholders = authorIds.map(() => '?').join(',')
    const params       = [...authorIds]

    /* ORDER BY */
    let order = 'p.created_at DESC'
    if (sortBy === 'likes')    order = 'v.likes DESC'
    if (sortBy === 'comments') order = 'c.cnt  DESC'

    /* base WHERE (authors) + optional search */
    let where = `WHERE p.author_id IN (${placeholders})`
    if (search) {
        const pat = `%${search}%`
        if (type === 'title')      where += ' AND p.title   LIKE ?'
        else if (type === 'author')   where += ' AND u.username LIKE ?'
        else if (type === 'country')  where += ' AND p.country LIKE ?'
        params.push(pat)
    }

    const sql = `
    SELECT
      p.*,
      u.username                     AS author,
      COALESCE(v.likes,0)            AS likes,
      COALESCE(v.dislikes,0)         AS dislikes,
      COALESCE(c.cnt,0)              AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN (
      SELECT post_id,
             SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
             SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
      FROM post_votes
      GROUP BY post_id
    ) v ON v.post_id = p.id
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS cnt
      FROM post_comments
      GROUP BY post_id
    ) c ON c.post_id = p.id
    ${where}
    ORDER BY ${order}
    LIMIT ? OFFSET ?
  `
    params.push(limit, offset)
    return all(sql, params)
}

module.exports = {
    create,
    update,
    remove,
    byId,
    list,
    listByAuthors
}