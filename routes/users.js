const express = require('express');
const router = express.Router();
const User = require('../models/User');

// const controller = require('../controllers/symptom.controller');

router.get('/', function (req, res, next) {
    // res.send('respond with a resource', {
    //     title: 'Logged In',
    //     user: req.user || 'null',
    // });
    console.log('get users')
    return User.find().exec()
        .then(users => res.send(users))
        .catch((err) => console.error(err))
    // return res.status(200).json({
    //     success: true,
    //     message: '계정이 성공적으로 생성되었습니다.'
    // });
});

// router.get('/', controller.getArticleList);
// router.post('/', controller.createArticle);
// router.get('/:articleid', controller.getSpecificArticle);
// router.patch('/:articleid', controller.updateSpecificArticle);
// router.delete('/:articleid', controller.deleteSpecificArticle);

module.exports = router;