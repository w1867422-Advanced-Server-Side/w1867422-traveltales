const csurf = require('csurf');

// Use cookie-based CSRF tokens
const csrfProtection = csurf({
    cookie: {
        httpOnly: true,    // JS can’t read the cookie
        secure:   true,    // only over HTTPS in production
        sameSite: 'strict' // mitigate CSRF by requiring same-site requests
    }
});

function csrfErrorHandler(err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // CSRF token missing or invalid
    res.status(403).json({ error: 'Invalid CSRF token' });
}

module.exports = { csrfProtection, csrfErrorHandler };