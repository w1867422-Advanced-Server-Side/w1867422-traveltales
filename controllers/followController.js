const followService = require('../services/followService');
const { catchAsync } = require('../utils/errorHandler');

const follow = catchAsync(async (req, res) => {
    const targetId = Number(req.params.userId);
    if (!Number.isInteger(targetId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    await followService.followUser(req.user.id, targetId);
    res.sendStatus(204);
});

const unfollow = catchAsync(async (req, res) => {
    const targetId = Number(req.params.userId);
    if (!Number.isInteger(targetId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    await followService.unfollowUser(req.user.id, targetId);
    res.sendStatus(204);
});

const listFollowing = catchAsync(async (req, res) => {
    const list = await followService.getFollowing(req.user.id);
    res.json(list);
});

const listFollowers = catchAsync(async (req, res) => {
    const userId = req.params.userId
        ? Number(req.params.userId)
        : req.user.id;
    if (!Number.isInteger(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const list = await followService.getFollowers(userId);
    res.json(list);
});

module.exports = {
    follow,
    unfollow,
    listFollowing,
    listFollowers,
};