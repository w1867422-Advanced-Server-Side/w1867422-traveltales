const postService   = require('../services/postService');
const { catchAsync } = require('../utils/errorHandler');

const listPosts = catchAsync(async (req, res) => {
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

    const posts = await postService.listPosts(filters);
    res.json(posts);
});

const getPost = catchAsync(async (req, res) => {
    const postId = Number(req.params.postId);
    const post   = await postService.getPostById(postId);
    res.json(post);
});

const createPost = catchAsync(async (req, res) => {
    const postId = await postService.createPost(
        req.user.id,
        req.body,
        req.files
    );
    res.status(201).json({ id: postId });
});

const updatePost = catchAsync(async (req, res) => {
    const postId = Number(req.params.postId);
    const updated = await postService.updatePost(
        req.user.id,
        postId,
        req.body,
        req.files
    );
    res.json(updated);
});

const deletePost = catchAsync(async (req, res) => {
    const postId = Number(req.params.postId);
    await postService.deletePost(req.user.id, postId);
    res.sendStatus(204);
});

const listFeed = catchAsync(async (req, res) => {
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

    const feed = await postService.listFeed(req.user.id, filters);
    res.json(feed);
});

module.exports = {
    listPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    listFeed
};