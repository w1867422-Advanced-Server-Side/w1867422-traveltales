const { verifyToken } = require('../utils/jwtHelper');

module.exports = (req, res, next) => {
    const hdr   = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error:'Missing token' });

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).json({ error:'Invalid or expired token' });
    }
};