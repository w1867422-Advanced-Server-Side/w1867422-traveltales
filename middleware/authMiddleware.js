const { verifyToken } = require('../utils/jwtHelper');

module.exports = (req, res, next) => {
    const hdr   = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error:'Missing token' });

    try {
        const payload = verifyToken(token);
        req.user   = payload;       // full user info if you ever need email/role
        req.userId = payload.id;
        next();
    } catch {
        res.status(401).json({ error:'Invalid or expired token' });
    }
};