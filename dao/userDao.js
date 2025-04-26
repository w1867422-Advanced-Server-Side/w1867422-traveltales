const { get, run } = require('../config/db');

async function findByEmail(email) {
    return get('SELECT * FROM users WHERE email = ?', [email]);
}

async function findByUsername(username) {
    return get('SELECT * FROM users WHERE username = ?', [username]);
}

async function createUser(email, passwordHash, username) {
    const result = await run(
        'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
        [email, passwordHash, username]
    );
    return result.lastID;
}

module.exports = {
    findByEmail,
    findByUsername,
    createUser
};