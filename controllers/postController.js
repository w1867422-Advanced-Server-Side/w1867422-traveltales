const postSvc       = require('../services/postService');
const { catchAsync } = require('../utils/errorHandler');

exports.listPosts = catchAsync(async (req, res) => {
    const limit  = +req.query.limit  || 10;
    const offset = +req.query.offset || 0;
    const sortBy = req.query.sortBy  || 'newest';
    res.json(await postSvc.listPosts(limit, offset, sortBy));
});

exports.getPost = catchAsync(async (req, res) => {
    res.json(await postSvc.getPostById(+req.params.postId));
});

exports.createPost = catchAsync(async (req, res) => {
    const id = await postSvc.createPost(req.user.id, req.body, req.files);
    res.status(201).json({ id });
});

exports.updatePost = catchAsync(async (req, res) => {
    const post = await postSvc.updatePost(
        req.user.id,
        +req.params.postId,
        req.body,
        req.files
    );
    res.json(post);
});

exports.deletePost = catchAsync(async (req, res) => {
    await postSvc.deletePost(req.user.id, +req.params.postId);
    res.sendStatus(204);
});

exports.listFeed = catchAsync(async (req, res) => {
    const limit  = +req.query.limit  || 10;
    const offset = +req.query.offset || 0;
    const sortBy = req.query.sortBy  || 'newest';
    const posts  = await postSvc.listFeed(
        req.user.id, limit, offset, sortBy
    );
    res.json(posts);
});