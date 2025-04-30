const followDao = require('../dao/followDao');

exports.followUser = (followerId, targetId) =>
    followDao.follow(followerId, targetId);

exports.unfollowUser = (followerId, targetId) =>
    followDao.unfollow(followerId, targetId);

exports.getFollowing   = userId => followDao.getFollowing(userId);
exports.getFollowers   = userId => followDao.getFollowers(userId);