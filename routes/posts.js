const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('./middleware');
const controller = require('../controllers/post.controller');
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext));
            // cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 } //  5MB
});
const router = express.Router();

router.get('/', controller.getPosts);
router.post('/', verifyToken, controller.createPost);
router.get('/:postId', controller.getPost);
router.patch('/:postId', verifyToken, controller.updatePost);
router.delete('/:postId', verifyToken, controller.deletePost);

router.post('/upload/image', verifyToken, upload.array('file'), controller.uploadImages);

module.exports = router;