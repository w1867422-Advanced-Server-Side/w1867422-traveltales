const postDao   = require('../dao/postDao')
const mediaDao  = require('../dao/mediaDao')
const followDao = require('../dao/followDao')
const fs        = require('fs/promises')
const path      = require('path')

const UPLOAD_DIR = path.join(__dirname, '../public/uploads')
const MAX_IMAGES = 5

/**
 * Internal helper: move a freshly-uploaded file
 * into the uploads directory and record its URL.
 */
async function persistImage(postId, file) {
    const mediaId = await mediaDao.add(postId)
    const ext     = path.extname(file.originalname)
    const newName = `img-${mediaId}${ext}`
    await fs.rename(file.path, path.join(UPLOAD_DIR, newName))
    await mediaDao.updateUrl(mediaId, `/uploads/${newName}`)
}

/**
 * Create a new post (with up to MAX_IMAGES attached).
 * Returns the new post's ID.
 */
async function createPost(authorId, dto, files = []) {
    if (files.length > MAX_IMAGES) {
        throw new Error(`Maximum ${MAX_IMAGES} images allowed per post.`)
    }
    const postId = await postDao.create(authorId, dto)
    await Promise.all(files.map(f => persistImage(postId, f)))
    return postId
}

/**
 * Update an existing post (and attach any new files).
 * Returns the updated post record.
 */
async function updatePost(authorId, postId, dto, files = []) {
    const post = await postDao.byId(postId)
    if (!post) {
        throw new Error('Post not found')
    }
    if (post.author_id !== authorId) {
        throw new Error('Forbidden')
    }
    const currentCount = await mediaDao.countByPost(postId)
    if (currentCount + files.length > MAX_IMAGES) {
        throw new Error(`Post already has ${currentCount} images; max ${MAX_IMAGES}.`)
    }
    await postDao.update(postId, dto)
    await Promise.all(files.map(f => persistImage(postId, f)))
    return postDao.byId(postId)
}

/**
 * Delete a post (cascades images via DB).
 */
async function deletePost(authorId, postId) {
    const post = await postDao.byId(postId)
    if (!post) {
        throw new Error('Post not found')
    }
    if (post.author_id !== authorId) {
        throw new Error('Forbidden')
    }
    await postDao.remove(postId)
}

/**
 * Fetch full details of a post (including images).
 */
async function getPostById(id) {
    const post = await postDao.byId(id)
    if (!post) {
        throw new Error('Post not found')
    }
    const images = await mediaDao.byPost(id)
    return { ...post, images }
}

/**
 * List all posts with filters: { limit, offset, sortBy, search, type }.
 */
async function listPosts(filters = {}) {
    return postDao.list(filters)
}

/**
 * List *feed* posts (only from authors this user follows).
 * Accepts the same filter object plus userId.
 */
async function listFeed(userId, filters = {}) {
    const rows      = await followDao.getFollowing(userId)
    const authorIds = rows.map(r => r.id)
    if (authorIds.length === 0) {
        return []
    }
    return postDao.listByAuthors({ authorIds, ...filters })
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPostById,
    listPosts,
    listFeed
}