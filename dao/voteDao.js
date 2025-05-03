const { run, get } = require('../config/database');

exports.vote = (uid, pid, like) =>
    run(
        `INSERT INTO post_votes (user_id,post_id,is_like)
       VALUES (?,?,?)
       ON CONFLICT(user_id,post_id)
       DO UPDATE SET is_like=excluded.is_like,
                     created_at=CURRENT_TIMESTAMP`,
        [uid, pid, like ? 1 : 0]
    );

exports.unvote = (uid,pid) =>
    run(`DELETE FROM post_votes WHERE user_id=? AND post_id=?`, [uid,pid]);

exports.totals = async pid => {
    const row = await get(
        `SELECT
       SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
       SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
     FROM post_votes WHERE post_id=?`,
        [pid]
    );
    return { likes: row.likes||0, dislikes: row.dislikes||0 };
};

exports.userVote = async (uid,pid) => {
    const row = await get(
        `SELECT is_like FROM post_votes WHERE user_id=? AND post_id=?`,
        [uid,pid]
    );
    return row ? !!row.is_like : null;   // true | false | null
};