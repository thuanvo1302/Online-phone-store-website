var express = require('express');
var router = express.Router();

const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAllCategory)
router.post('/', categoryController.addCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router