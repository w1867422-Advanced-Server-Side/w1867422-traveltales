const authService = require('../services/authService');
const { catchAsync } = require('../utils/errorHandler');

exports.register = catchAsync(async (req,res)=>{
    const { username,email,password } = req.body;
    const data = await authService.register({ username,email,password });
    res.status(201).json(data);
});

exports.login = catchAsync(async (req,res)=>{
    const { email,password } = req.body;
    const data = await authService.login({ email,password });
    res.json(data);
});

exports.profile = catchAsync(async (req,res)=>{
    const user = await authService.getProfile(req.user.id);
    res.json(user);
});

exports.logout = catchAsync(async (_req,res)=>{
    res.json({ message:'Logged out' });
});