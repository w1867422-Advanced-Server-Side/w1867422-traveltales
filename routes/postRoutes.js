const router  = require('express').Router();
const postCtl = require('../controllers/postController');
const auth    = require('../middleware/authMiddleware');
const upload  = require('../middleware/uploadImage');

router.get('/feed', auth, postCtl.listFeed);

router.get('/',        postCtl.listPosts);
router.get('/:postId', postCtl.getPost);

router.post(
    '/',
    auth,
    upload.array('images', 5),
    postCtl.createPost
);

router.put(
    '/:postId',
    auth,
    upload.array('images', 5),
    postCtl.updatePost
);

router.delete(
    '/:postId',
    auth,
    postCtl.deletePost
);

module.exports = router;
