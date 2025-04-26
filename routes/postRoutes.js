const express         = require('express');
const authMiddleware  = require('../middleware/authMiddleware');
const {
    createPost,
    getPost,
    listPosts,
    updatePost,
    deletePost
} = require('../controllers/postController');

const router = express.Router();

// Public endpoints
router.get('/', listPosts);
router.get('/:id', getPost);

// Protected endpoints
router.post('/',    authMiddleware, createPost);
router.put('/:id',  authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;