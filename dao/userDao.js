const { run, get } = require('../config/database');

exports.createUser = async ({ username,email,password,role }) => {
    const r = await run(
        `INSERT INTO users (username,email,password,role) VALUES(?,?,?,?)`,
        [username,email,password,role]
    );
    return { id:r.lastID, username, email, role };
};

exports.findByEmail = email =>
    get(`SELECT * FROM users WHERE email = ?`, [email]);

exports.findById = id =>
    get(`SELECT id,username,email,role,created_at FROM users WHERE id = ?`,[id]);

exports.countUsers = () =>
    get(`SELECT COUNT(*) AS cnt FROM users`).then(r=>r.cnt);