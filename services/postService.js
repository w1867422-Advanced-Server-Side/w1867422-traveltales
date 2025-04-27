const postDao = require('../dao/postDao');
const mediaDao = require('../dao/mediaDao');

const MAX_IMAGES = 5;

async function saveFileAndGetUrl(postId, file) {
    // 1) Insert a media row with a blank URL to get its ID
    const mediaId = await mediaDao.addImage(postId, '');

    // 2) Decide on a final filename (using the mediaId to guarantee uniqueness)
    const ext = path.extname(file.originalname);                // e.g. ".png"
    const finalName = `img-${mediaId}${ext}`;                   // e.g. "img-42.png"
    const tempPath   = file.path;                               // where Multer put it
    const finalPath  = path.join(uploadDir, finalName);

    // 3) Move/rename the file on disk
    await fs.promises.rename(tempPath, finalPath);

    // 4) Construct the public URL and update the DB row
    const url = `/uploads/${finalName}`;
    await mediaDao.updateImageUrl(mediaId, url);

    // 5) Return the URL so the caller can include it in the response
    return url;
}

async function createPost(userId, title, content, country, visitDate, files = []) {
    if (files.length > MAX_IMAGES) {
        const err = new Error(`You can upload at most ${MAX_IMAGES} images per post.`);
        err.status = 400;
        throw err;
    }
    const postId = await postDao.createPost(userId, title, content, country, visitDate);

    for (const file of files) {
        const url = await saveFileAndGetUrl(postId, file);
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

async function updatePost(userId, postId, title, content, country, visitDate, files = []) {
    // Ownership check...
    const existingCount = await mediaDao.countImagesByPost(postId);
    if (existingCount + files.length > MAX_IMAGES) {
        const err = new Error(
            `This post already has ${existingCount} image(s).`
        );
        err.status = 400;
        throw err;
    }

    await postDao.updatePost(postId, title, content, country, visitDate);
    for (const file of files) {
        const url = await saveFileAndGetUrl(postId, file);
        await mediaDao.addImage(postId, url);
    }
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
