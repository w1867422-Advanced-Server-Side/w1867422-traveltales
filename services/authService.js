const bcrypt  = require('bcrypt');
const userDao = require('../dao/userDao');
const { generateAccessToken } = require('../utils/tokenUtils');

async function register(email, password, username) {
    if (await userDao.findByEmail(email)) {
        const err = new Error('Email already in use');
        err.status = 409;
        throw err;
    }
    if (await userDao.findByUsername(username)) {
        const err = new Error('Username already taken');
        err.status = 409;
        throw err;
    }
    const hash   = await bcrypt.hash(password, 12);
    const userId = await userDao.createUser(email, hash, username);
    const { token } = generateAccessToken(userId);
    return { userId, token };
}

async function login(email, password) {
    const user = await userDao.findByEmail(email);
    if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }
    const { token } = generateAccessToken(user.id);
    return { userId: user.id, token };
}

module.exports = {
    register,
    login
};