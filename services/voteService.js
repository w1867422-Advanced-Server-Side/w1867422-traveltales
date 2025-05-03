const voteDao = require('../dao/voteDao');

exports.addLike      = (uid, pid) => voteDao.vote(uid, pid, true);
exports.addDislike   = (uid, pid) => voteDao.vote(uid, pid, false);
exports.removeVote   = (uid, pid) => voteDao.unvote(uid, pid);

exports.getTotals    = pid        => voteDao.totals(pid);
exports.getUserVote  = (uid, pid) => voteDao.userVote(uid, pid);