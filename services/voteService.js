const voteDao = require('../dao/voteDao');

exports.likePost    = (userId, postId) => voteDao.votePost(userId, postId, true);
exports.dislikePost = (userId, postId) => voteDao.votePost(userId, postId, false);
exports.unvotePost  = (userId, postId) => voteDao.unvotePost(userId, postId);

exports.getPostVotes   = postId => voteDao.countLikes(postId);
exports.getUserVote    = (userId, postId) => voteDao.getUserVote(userId, postId);