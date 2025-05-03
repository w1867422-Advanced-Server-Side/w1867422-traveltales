const postDao  = require('../dao/postDao');
const mediaDao = require('../dao/mediaDao');
const fs       = require('fs/promises');
const path     = require('path');

const UPLOAD_DIR  = path.join(__dirname, '../public/uploads');
const MAX_IMAGES  = 5;

/* helper ─ rename tmp file ➜ final img‑<id>.ext */
async function persistImage(postId, file) {
    const mediaId = await mediaDao.add(postId);           // URL blank for now
    const ext     = path.extname(file.originalname);
    const newName = `img-${mediaId}${ext}`;
    await fs.rename(file.path, path.join(UPLOAD_DIR, newName));
    await mediaDao.updateUrl(mediaId, `/uploads/${newName}`);
}

exports.createPost = async (authorId, dto, files = []) => {
    if (files.length > MAX_IMAGES)
        throw new Error(`Maximum ${MAX_IMAGES} images allowed per post.`);

    const postId = await postDao.create(authorId, dto);
    await Promise.all(files.map(f => persistImage(postId, f)));
    return postId;
};

exports.updatePost = async (authorId, postId, dto, files = []) => {
    const post = await postDao.byId(postId);
    if (!post)                 throw new Error('Post not found');
    if (post.author_id !== authorId) throw new Error('Forbidden');

    const current = await mediaDao.countByPost(postId);
    if (current + files.length > MAX_IMAGES)
        throw new Error(`Post already has ${current} images; max ${MAX_IMAGES}.`);

    await postDao.update(postId, dto);
    await Promise.all(files.map(f => persistImage(postId, f)));
    return postDao.byId(postId);
};

exports.deletePost = async (authorId, postId) => {
    const post = await postDao.byId(postId);
    if (!post)                 throw new Error('Post not found');
    if (post.author_id !== authorId) throw new Error('Forbidden');
    await postDao.remove(postId);
};

exports.getPostById = async id => {
    const post = await postDao.byId(id);
    if (!post) throw new Error('Post not found');
    const images = await mediaDao.byPost(id);
    return { ...post, images };
};

exports.listPosts = (limit, offset, sortBy = 'newest') =>
    postDao.list(limit, offset, sortBy);
