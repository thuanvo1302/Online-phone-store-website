var express = require('express');
var router = express.Router();

//midlleware
const authentication = require('../middleware/authentication')
const authorize = require('../middleware/authorize')

router.get('/', (req, res) => {
    return res.render('product/page-list-product')
})

router.get('/edit', (req, res) => {
    return res.render('product/page-edit-product', { title: 'Page Edit Product' })
})

router.get('/add', (req, res) => {
    return res.render('product/page-add-product', { title: 'Page Add Product' });
})

module.exports = router