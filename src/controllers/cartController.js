const CartError = require('../errors/CartError')

module.exports = {
    getCart: (req, res, next) => {
        try {
            const sessionId = req.sessionID;
            const cartData = req.session.cart || {};
            return res.status(200).json({
                code: 1,
                statusCode: 200,
                message: 'Get cart successfully',
                data: {
                    sessionId,
                    cartData
                }
            })
        } catch (err) {
            next(err)
        }
    },
    addToCart: (req, res, next) => {
        try {
            const productId = req.body.productId;
            const quantity = req.body.quantity;

            if (!productId || isNaN(quantity) || quantity <= 0) {
                throw new CartError("Invalid product information.", 400)
            }

            let cartData = req.session.cart || {};
            cartData[productId] = parseInt(cartData[productId] || 0) + parseInt(quantity);

            // save cart to session
            req.session.cart = cartData;

            //console.log(req.sessionID)

            // save cart to cookie Key sessionId
            res.cookie(req.sessionID, cartData, { maxAge: 1000 * 60 * 60 * 24 * 7 });

            return res.status(200).json({
                code: 1,
                success: true,
                message: 'Product added to cart successfully'
            })
        } catch (error) {
            next(error)
        }
    },
    updateToCart: (req, res, next) => {
        try {
            const productId = req.params.productId;
            const quantity = req.body.quantity;

            if (!productId || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({
                    code: -1,
                    success: false,
                    message: 'Invalid product information.'
                });
            }

            let cartData = req.session.cart || {};
            if (cartData[productId] !== undefined) {
                cartData[productId] = parseInt(quantity);

                // save cart to sesssion 
                req.session.cart = cartData;

                // save cart to cookie
                res.cookie(req.sessionID, cartData, { maxAge: 1000 * 60 * 60 * 24 * 7 });
                return res.status(200).json({
                    code: 1,
                    success: true,
                    message: "Cart updated successfully"
                })
            }
            return res.status(404).json({
                code: 0,
                success: false,
                message: "Product not found in cart"
            })
        } catch (error) {
            next(new CartError(`Error:${error.message}`, 404))
        }
    },
    deleteProductInCart: (req, res, next) => {
        try {
            const productId = req.params.productId;

            //console.log(productId);

            if (!productId) {
                throw new CartError("Invalid product information.", 400)
            }

            let cartData = req.session.cart || {};
            if (cartData[productId] !== undefined) {
                delete cartData[productId];

                // save cart to sesssion 
                req.session.cart = cartData;

                //res.clearCookie(req.sessionID);

                return res.json({ success: true, message: 'Product removed from cart successfully' });
            }
            return res.status(404).json({
                code: 0,
                success: false,
                message: 'Product not found'
            })
        }
        catch (error) {
            next(error)
        }
    },
}; 