const { run, get } = require('../config/database')

/**
 * Insert a new user and return the created record (without password).
 */
async function createUser({ username, email, password, role }) {
    const sql = `
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `
    const result = await run(sql, [username, email, password, role])
    return {
        id:       result.lastID,
        username,
        email,
        role
    }
}

/**
 * Look up a user by their email address.
 * Returns the full row (including hashed password).
 */
function findByEmail(email) {
    const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `
    return get(sql, [email])
}

/**
 * Look up a user by their ID.
 * Returns id, username, email, role, created_at.
 */
function findById(id) {
    const sql = `
    SELECT id, username, email, role, created_at
    FROM users
    WHERE id = ?
  `
    return get(sql, [id])
}

/**
 * Count how many users exist.
 * Resolves to a number.
 */
function countUsers() {
    const sql = `
    SELECT COUNT(*) AS cnt
    FROM users
  `
    return get(sql).then(row => row.cnt)
}

module.exports = {
    createUser,
    findByEmail,
    findById,
    countUsers
}