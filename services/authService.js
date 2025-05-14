const bcrypt    = require('bcrypt')
const userDao   = require('../dao/userDao')
const { signToken } = require('../utils/jwtHelper')

/**
 * Register a new user.
 * - First user becomes admin; others are regular users.
 * - Returns an object with JWT token and the created user (without password).
 */
const register = async ({ username, email, password }) => {
    if (await userDao.findByEmail(email)) {
        const err = new Error('User already exists')
        err.status = 409
        throw err
    }

    const hash = await bcrypt.hash(password, 12)
    const role = (await userDao.countUsers()) === 0 ? 'admin' : 'user'
    const user = await userDao.createUser({ username, email, password: hash, role })
    const token = signToken({ id: user.id, email: user.email, role: user.role })

    return { token, user }
}

/**
 * Authenticate an existing user.
 * - Verifies email & password.
 * - Returns an object with JWT token and safe user info (no password).
 */
const login = async ({ email, password }) => {
    const user = await userDao.findByEmail(email)
    if (!user) {
        const err = new Error('User not found')
        err.status = 401
        throw err
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
        const err = new Error('Invalid credentials')
        err.status = 401
        throw err
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role })
    const safeUser = {
        id:       user.id,
        username: user.username,
        email:    user.email,
        role:     user.role
    }

    return { token, user: safeUser }
}

/**
 * Retrieve profile information for the given user ID.
 * Returns id, username, email, role, and creation timestamp.
 */
const getProfile = async userId => {
    return userDao.findById(userId)
}

module.exports = {
    register,
    login,
    getProfile
}