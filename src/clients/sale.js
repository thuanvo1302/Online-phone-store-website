var express = require('express');
var router = express.Router();

const Order = require('../models/Order')
const OrderDetail = require('../models/OrderDetail')

const authentication = require('../middleware/authentication')

router.get('/sale', (req, res) => {
    return res.render('sale/index', { layout: null })
})

router.get('/checkout', (req, res, next) => {
    return res.render('sale/checkout', { layout: null })
})

router.post('/checkout', authentication, (req, res, next) => {
    return res.status(200).json({ success: true })
})

router.get('/order-placed-successfully', (req, res) => {
    return res.render('sale/order-placed-successfully', { layout: null })
})

router.get('/payment', async (req, res) => {
    return res.render('sale/payment', { layout: null })
})

router.get('/order-details', (req, res) => {
    return res.render('sale/order-details', { layout: null })
})

module.exports = router