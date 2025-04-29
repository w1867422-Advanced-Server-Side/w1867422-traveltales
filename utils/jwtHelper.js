require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES;

exports.signToken   = payload => jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
exports.verifyToken = token   => jwt.verify(token,  SECRET);