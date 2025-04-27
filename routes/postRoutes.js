const express= require('express');
const auth  = require('../middleware/authMiddleware');
const uploadImage  = require('../middleware/uploadImage');
const {
    createPost,
    getPost,
    listPosts,
    updatePost,
    deletePost
} = require('../controllers/postController');

const router = express.Router();

router.get('/',     listPosts);
router.get('/:id',  getPost);

router.post(
    '/',
    auth,
    uploadImage.array('images', 5),
    createPost
);
router.put(
    '/:id',
    auth,
    uploadImage.array('images', 5),
    updatePost
);
router.delete('/:id', auth, deletePost);

module.exports = router;