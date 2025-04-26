require('dotenv').config();
const csurf = require('csurf');

// const isProduction = process.env.NODE_ENV === 'production';

const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        secure:   false,  // allow over HTTP in dev
        sameSite: 'lax'   // still block cross-site write requests
    }
});

function csrfErrorHandler(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // CSRF token missing or invalid
    res.status(403).json({ error: 'Invalid CSRF token' });
}

module.exports = { csrfProtection, csrfErrorHandler };