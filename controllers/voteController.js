const voteService   = require('../services/voteService');
const { catchAsync } = require('../utils/errorHandler');

/**
 * Parse and validate postId path param.
 * If invalid, sends 400 and returns null.
 */
function getPostId(req, res) {
    const id = Number(req.params.postId);
    if (!Number.isInteger(id)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return null;
    }
    return id;
}

/**
 * Like (or update to like) the given post as the current user.
 * Returns 204 No Content on success.
 */
const likePost = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    await voteService.addLike(req.user.id, postId);
    res.sendStatus(204);
});

/**
 * Dislike (or update to dislike) the given post as the current user.
 * Returns 204 No Content on success.
 */
const dislikePost = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    await voteService.addDislike(req.user.id, postId);
    res.sendStatus(204);
});

/**
 * Remove any existing vote (like or dislike) by the current user on the given post.
 * Returns 204 No Content on success.
 */
const unvotePost = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    await voteService.removeVote(req.user.id, postId);
    res.sendStatus(204);
});

/**
 * Get total likes & dislikes for a post.
 * Responds with { likes: number, dislikes: number }.
 */
const getVotes = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    const totals = await voteService.getTotals(postId);
    res.json(totals);
});

/**
 * Get how the current user has voted on the post.
 * Responds with { vote: true|false|null }.
 */
const getUserVote = catchAsync(async (req, res) => {
    const postId = getPostId(req, res);
    if (postId === null) return;
    const vote = await voteService.getUserVote(req.user.id, postId);
    res.json({ vote });
});

module.exports = {
    likePost,
    dislikePost,
    unvotePost,
    getVotes,
    getUserVote
};