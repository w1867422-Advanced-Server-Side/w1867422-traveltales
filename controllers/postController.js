const postService = require('../services/postService');

async function createPost(req, res) {
    try {
        const { title, content, country, visitDate } = req.body;
        const files = req.files || [];
        const postId = await postService.createPost(
            req.userId, title, content, country, visitDate, files
        );
        res.status(201).json({ id: postId });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

async function getPost(req, res) {
    try {
        const post = await postService.fetchPost(+req.params.id);
        res.json(post);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

async function listPosts(req, res) {
    try {
        const limit  = parseInt(req.query.limit)  || 10;
        const offset = parseInt(req.query.offset) || 0;
        const posts = await postService.listPosts(limit, offset);
        res.json(posts);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

async function updatePost(req, res) {
    try {
        const { title, content, country, visitDate } = req.body;
        const post = await postService.updatePost(
            req.userId,
            +req.params.id,
            title,
            content,
            country,
            visitDate
        );
        res.json(post);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

async function deletePost(req, res) {
    try {
        await postService.deletePost(req.userId, +req.params.id);
        res.json({ id: +req.params.id });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}

module.exports = {
    createPost,
    getPost,
    listPosts,
    updatePost,
    deletePost
};