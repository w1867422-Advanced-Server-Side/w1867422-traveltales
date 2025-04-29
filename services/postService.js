const fs        = require('fs/promises');
const path      = require('path');
const postDao   = require('../dao/postDao');
const mediaDao  = require('../dao/mediaDao');

const uploadDir  = path.join(__dirname,'../public/uploads');
const MAX_IMAGES = 5;

async function saveFile(postId, file){
    const mediaId = await mediaDao.addImage(postId);
    const ext     = path.extname(file.originalname);
    const final   = `img-${mediaId}${ext}`;
    await fs.rename(file.path, path.join(uploadDir, final));
    const url     = `/uploads/${final}`;
    await mediaDao.updateImageUrl(mediaId, url);
    return url;
}

exports.createPost = async (userId, data, files=[]) => {
    if (files.length > MAX_IMAGES)
        throw Object.assign(new Error('Too many images'),{status:400});

    const postId = await postDao.createPost(userId, data);

    for (const f of files) await saveFile(postId,f);

    return postId;
};

exports.fetchPost = async id => {
    const post = await postDao.getPostById(id);
    if (!post) throw Object.assign(new Error('Post not found'),{status:404});
    const images = await mediaDao.getImagesByPost(id);
    return { ...post, images };
};

exports.listPosts = query => postDao.listPosts(query);

exports.updatePost = async (userId, postId, data, files=[]) => {
    const existing = await postDao.getPostById(postId);
    if (!existing) throw Object.assign(new Error('Post not found'),{status:404});
    if (existing.author_id !== userId)
        throw Object.assign(new Error('Forbidden'),{status:403});

    const current = await mediaDao.countImagesByPost(postId);
    if (current + files.length > MAX_IMAGES)
        throw Object.assign(new Error('Image limit exceeded'),{status:400});

    await postDao.updatePost(postId,data);
    for (const f of files) await saveFile(postId,f);

    return exports.fetchPost(postId);
};

exports.deletePost = async (userId, postId) => {
    const existing = await postDao.getPostById(postId);
    if (!existing) throw Object.assign(new Error('Not found'),{status:404});
    if (existing.author_id !== userId)
        throw Object.assign(new Error('Forbidden'),{status:403});
    await postDao.deletePost(postId);
};