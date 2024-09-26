var express = require('express');
var router = express.Router();

// errors
const CartError = require('../errors/CartError')

// controller
const cartController = require('../controllers/cartController')

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart)
router.put('/:productId',cartController.updateToCart);
router.delete('/:productId', cartController.deleteProductInCart);

router.use((err, req, res, next) => {
    if (err instanceof CartError) {
        return res.status(e.statusCode || 404).json({
            code: 0,
            success: false,
            message: err.message
        })
    }
    else {
        next(err)
    }
})


module.exports = router