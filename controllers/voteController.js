const voteSvc = require('../services/voteService');

async function likePost(req, res) {
    await voteSvc.likePost(req.userId, +req.params.postId);
    res.sendStatus(204);
}
async function dislikePost(req, res) {
    await voteSvc.dislikePost(req.userId, +req.params.postId);
    res.sendStatus(204);
}
async function unvotePost(req, res) {
    await voteSvc.unvotePost(req.userId, +req.params.postId);
    res.sendStatus(204);
}
async function getVotes(req, res) {
    const counts = await voteSvc.getPostVotes(+req.params.postId);
    res.json(counts);
}

module.exports = { likePost, dislikePost, unvotePost, getVotes };
