const postDao = require('../dao/postDao');
const mediaDao = require('../dao/mediaDao');

async function createPost(userId, title, content, country, visitDate, files = []) {
    const postId = await postDao.createPost(userId, title, content, country, visitDate);
    // for each uploaded file, store its public URL
    for (const file of files) {
        const url = `/uploads/${file.filename}`;
        await mediaDao.addImage(postId, url);
    }
    return postId;
}

async function fetchPost(id) {
    const post = await postDao.getPostById(id);
    if (!post) {
        const err = new Error('Post not found');
        err.status = 404;
        throw err;
    }
    const images = await mediaDao.getImagesByPost(id);
    return { ...post, images };
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
