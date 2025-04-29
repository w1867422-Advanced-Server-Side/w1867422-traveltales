const postService = require('../services/postService');
const { catchAsync } = require('../utils/errorHandler');

exports.create = catchAsync(async (req,res)=>{
    const id = await postService.createPost(
        req.user.id,
        req.body,
        req.files || []
    );
    res.status(201).json({ id });
});

exports.list = catchAsync(async (req,res)=>{
    const { limit,offset,country,author } = req.query;
    const posts = await postService.listPosts({
        limit:+limit||10,
        offset:+offset||0,
        country,
        authorId: author
    });
    res.json(posts);
});

exports.get = catchAsync(async (req,res)=>{
    const post = await postService.fetchPost(+req.params.id);
    res.json(post);
});

exports.update = catchAsync(async (req,res)=>{
    const post = await postService.updatePost(
        req.user.id,
        +req.params.id,
        req.body,
        req.files || []
    );
    res.json(post);
});

exports.remove = catchAsync(async (req,res)=>{
    await postService.deletePost(req.user.id, +req.params.id);
    res.json({ id:+req.params.id });
});