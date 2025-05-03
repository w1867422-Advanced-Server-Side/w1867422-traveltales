const voteService   = require('../services/voteService');
const { catchAsync } = require('../utils/errorHandler');

function getPostId(req, res) {
    const id = Number(req.params.postId);
    if (!Number.isInteger(id)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return null;
    }
    return id;
}

exports.likePost = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    await voteService.addLike(req.user.id, postId);
    res.sendStatus(204);
});

exports.dislikePost = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    await voteService.addDislike(req.user.id, postId);
    res.sendStatus(204);
});

exports.unvotePost = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    await voteService.removeVote(req.user.id, postId);
    res.sendStatus(204);
});

exports.getVotes = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    const totals = await voteService.getTotals(postId);   // { likes, dislikes }
    res.json(totals);
});

exports.getUserVote = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    const vote = await voteService.getUserVote(req.user.id, postId); // true|false|null
    res.json({ vote });
});