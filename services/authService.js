const bcrypt  = require('bcrypt');
const userDao = require('../dao/userDao');
const { signToken } = require('../utils/jwtHelper');

exports.register = async ({ username,email,password }) => {
    if (await userDao.findByEmail(email))
        throw Object.assign(new Error('User already exists'),{status:409});

    const hash  = await bcrypt.hash(password, 12);
    const role  = (await userDao.countUsers()) === 0 ? 'admin':'user';
    const user  = await userDao.createUser({ username,email,password:hash,role });
    const token = signToken({ id:user.id, email:user.email, role:user.role });
    return { token, user };
};

exports.login = async ({ email,password }) => {
    const user = await userDao.findByEmail(email);
    if (!user) throw Object.assign(new Error('User not found'),{status:401});

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  throw Object.assign(new Error('Invalid credentials'),{status:401});

    const token = signToken({ id:user.id, email:user.email, role:user.role });
    return { token,
        user:{ id:user.id, username:user.username, email:user.email, role:user.role } };
};

exports.getProfile = userId => userDao.findById(userId);