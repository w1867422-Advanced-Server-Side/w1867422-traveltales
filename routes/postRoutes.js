const router  = require('express').Router();
const postController = require('../controllers/postController');
const auth    = require('../middleware/authMiddleware');
const upload  = require('../middleware/uploadImage');

router.get('/feed', auth, postController.listFeed);

router.get('/',        postController.listPosts);
router.get('/:postId', postController.getPost);

router.post(
    '/',
    auth,
    upload.array('images', 5),
    postController.createPost
);

router.put(
    '/:postId',
    auth,
    upload.array('images', 5),
    postController.updatePost
);

router.delete(
    '/:postId',
    auth,
    postController.deletePost
);

module.exports = router;
