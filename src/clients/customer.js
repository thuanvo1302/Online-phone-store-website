var express = require('express');
var router = express.Router();

//  render customer list
router.get('/', (req, res) => {
    res.render('customer/page-list-customers', { title: 'Page list customer' })
})

router.get('/add', (req, res) => {
    res.render('customer/page-add-customer')
})

// render form add customer
router.get('/add', (req, res) => {
    res.render('customer/page-add-customer')
})

//  render page history orders of customer
router.get('/history', (req, res) => {
    res.render('customer/page-list-purchase-history');
})

//  render orderdetail customer
router.get('/history/detail', (req, res) => {
    res.render('customer/page-order-detail')
})

module.exports = router