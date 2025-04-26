const authService = require('../services/authService');

async function register(req, res) {
    try {
        const { userId, token } = await authService.register(
            req.body.email,
            req.body.password
        );
        res.status(201).json({ userId, token });
    } catch (err) {
        res
            .status(err.status || 500)
            .json({ error: err.message || 'Server error' });
    }
}

async function login(req, res) {
    try {
        const { userId, token } = await authService.login(
            req.body.email,
            req.body.password
        );
        res.json({ userId, token });
    } catch (err) {
        res
            .status(err.status || 500)
            .json({ error: err.message || 'Server error' });
    }
}

module.exports = {
    register,
    login
};