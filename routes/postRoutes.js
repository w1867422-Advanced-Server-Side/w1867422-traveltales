const router   = require('express').Router();
const ctrl     = require('../controllers/postController');
const auth     = require('../middleware/authMiddleware');
const upload   = require('../middleware/uploadImage');

router.get('/',      ctrl.list);
router.get('/:id',   ctrl.get);

router.post('/',
    auth,
    upload.array('images',5),
    ctrl.create);

router.put('/:id',
    auth,
    upload.array('images',5),
    ctrl.update);

router.delete('/:id', auth, ctrl.remove);

module.exports = router;