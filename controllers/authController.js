const authService = require('../services/authService');
const { catchAsync } = require('../utils/errorHandler');

/**
 * POST /auth/register
 */
const register = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const data = await authService.register({ username, email, password });
    res.status(201).json(data);
});

/**
 * POST /auth/login
 */
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.json(data);
});

/**
 * GET /auth/profile
 */
const profile = catchAsync(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
});

/**
 * POST /auth/logout
 */
const logout = catchAsync(async (_req, res) => {
    res.sendStatus(204);
});

module.exports = {
    register,
    login,
    profile,
    logout,
};