const postDao = require('../dao/postDao');

async function createPost(userId, title, content, country, visitDate) {
    return postDao.createPost(userId, title, content, country, visitDate);
}

async function fetchPost(id) {
    const post = await postDao.getPostById(id);
    if (!post) {
        const err = new Error('Post not found');
        err.status = 404;
        throw err;
    }
    return post;
}

async function listPosts(limit, offset) {
    return postDao.getAllPosts(limit, offset);
}

async function updatePost(userId, postId, title, content, country, visitDate) {
    const post = await postDao.getPostById(postId);
    if (!post) {
        const err = new Error('Post not found');
        err.status = 404;
        throw err;
    }
    if (post.author_id !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }
    await postDao.updatePost(postId, title, content, country, visitDate);
    return postDao.getPostById(postId);
}

async function deletePost(userId, postId) {
    const post = await postDao.getPostById(postId);
    if (!post) {
        const err = new Error('Post not found');
        err.status = 404;
        throw err;
    }
    if (post.author_id !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }
    await postDao.deletePost(postId);
}

module.exports = {
    createPost,
    fetchPost,
    listPosts,
    updatePost,
    deletePost
};
