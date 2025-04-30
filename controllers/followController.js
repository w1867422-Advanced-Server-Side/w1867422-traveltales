const followSvc = require('../services/followService');

async function follow(req, res) {
    await followSvc.followUser(req.userId, +req.params.userId);
    res.sendStatus(204);
}
async function unfollow(req, res) {
    await followSvc.unfollowUser(req.userId, +req.params.userId);
    res.sendStatus(204);
}
async function listFollowing(req, res) {
    const list = await followSvc.getFollowing(req.userId);
    res.json(list);
}
async function listFollowers(req, res) {
    const list = await followSvc.getFollowers(req.params.userId || req.userId);
    res.json(list);
}

module.exports = { follow, unfollow, listFollowing, listFollowers };
