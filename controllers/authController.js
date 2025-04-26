const authService = require('../services/authService');

async function register(req, res) {
    try {
        const { email, password, username } = req.body;
        const { userId, token } = await authService.register(
            email,
            password,
            username
        );
        res.status(201).json({ userId, token });
    } catch (err) {
        res
            .status(err.status || 500).json({ error: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const { userId, token } = await authService.login(email, password);
        res.json({ userId, token });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login
};