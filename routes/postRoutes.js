const router  = require('express').Router();
const postCtl = require('../controllers/postController');
const auth    = require('../middleware/authMiddleware');
const upload  = require('../middleware/uploadImage');

/* ─────────────────── PUBLIC ─────────────────── */
/* List or view posts (no login required) */
router.get('/',        postCtl.listPosts);      // GET /posts?limit&offset&sortBy
router.get('/:postId', postCtl.getPost);        // GET /posts/:postId

/* ─────────────────── AUTHENTICATED ──────────── */
/* Create, edit, delete (JWT required) */
router.post(
    '/',
    auth,
    upload.array('images', 5),                    // multipart images[]
    postCtl.createPost                            // POST /posts
);

router.put(
    '/:postId',
    auth,
    upload.array('images', 5),                    // may add more images
    postCtl.updatePost                            // PUT /posts/:postId
);

router.delete(
    '/:postId',
    auth,
    postCtl.deletePost                            // DELETE /posts/:postId
);

module.exports = router;
