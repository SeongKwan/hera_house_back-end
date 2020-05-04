const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const { verifyToken } = require('./middleware');

router.get('/', controller.getCategories);
router.post('/', verifyToken, controller.createCategory);
router.get('/:categoryId', controller.getCategory);
router.patch('/order', verifyToken, controller.updateCategoryOrder);
router.delete('/:categoryId', verifyToken, controller.deleteCategory);

module.exports = router;