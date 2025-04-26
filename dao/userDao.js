const { get, run } = require('../config/db');

async function findByEmail(email) {
    return get('SELECT * FROM users WHERE email = ?', [email]);
}

async function findByUsername(username) {
    return get('SELECT * FROM users WHERE username = ?', [username]);
}

async function createUser(email, hash) {
    const result = await run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hash]
    );
    return result.lastID;
}

module.exports = { findByEmail, createUser, findByUsername };