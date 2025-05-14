const followDao = require('../dao/followDao')

/**
 * Make followerId follow targetId.
 */
const followUser = async (followerId, targetId) => {
    await followDao.follow(followerId, targetId)
}

/**
 * Make followerId unfollow targetId.
 */
const unfollowUser = async (followerId, targetId) => {
    await followDao.unfollow(followerId, targetId)
}

/**
 * List all users that the given userId is following.
 */
const getFollowing = async userId => {
    return followDao.getFollowing(userId)
}

/**
 * List all users who follow the given userId.
 */
const getFollowers = async userId => {
    return followDao.getFollowers(userId)
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowing,
    getFollowers
}