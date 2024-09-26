var express = require('express');
var router = express.Router();

const customerController = require('../controllers/customerController');
const CustomerError = require('../errors/CustomerError');

router.get('/', customerController.getAllCustomer);
router.post('/', customerController.addCustomer);
router.get('/:id', customerController.getDetailCustomer);
router.get('/phone/:phoneNumber' , customerController.findCustomerByPhone);

router.get('/history/:phoneNumber', customerController.findOrdersByPhoneNumber);
router.get('/history/detail/:idOrder', customerController.findOrderDetail);

router.use((err, req, res, next) => {
    if (err instanceof CustomerError) {
        return res.status(err.statusCode).json({
            code: 0,
            statusCode: err.statusCode,
            message: err.message
        });
    }
    else {
        next(err);
    }
})

module.exports = router;
