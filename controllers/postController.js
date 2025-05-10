const postSvc       = require('../services/postService');
const { catchAsync } = require('../utils/errorHandler');

/** GET /posts?limit=&offset=&sortBy=&search=&type= */
exports.listPosts = catchAsync(async (req, res) => {
    const {
        limit   = '10',
        offset  = '0',
        sortBy  = 'newest',
        search  = '',
        type    = 'title'     // 'title' | 'author' | 'country'
    } = req.query;

    const filters = {
        limit:  Number(limit),
        offset: Number(offset),
        sortBy,
        search,
        type
    };

    const posts = await postSvc.listPosts(filters);
    res.json(posts);
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

/** GET /posts/feed?limit=&offset=&sortBy=&search=&type= */
exports.listFeed = catchAsync(async (req, res) => {
    const {
        limit   = '10',
        offset  = '0',
        sortBy  = 'newest',
        search  = '',
        type    = 'title'
    } = req.query;

    const filters = {
        limit:  Number(limit),
        offset: Number(offset),
        sortBy,
        search,
        type
    };

    const posts = await postSvc.listFeed(req.user.id, filters);
    res.json(posts);
});