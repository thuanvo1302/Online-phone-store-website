var express = require('express');
var router = express.Router();

const pdf = require('pdf-creator-node');
const fs = require('fs');
var path = require('path');
const handlebars = require('handlebars');


// controller
let orderController = require('../controllers/orderController')

// middleware
const authentication = require('../middleware/authentication')

// errors 
const CartError = require('../errors/CartError');
const ProductError = require('../errors/ProductError')

// Model 
const Product = require('../models/Product')
const OrderDetail = require('../models/OrderDetail');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET get orders by time
router.get('/time', orderController.getOrdersByTimePeriod)

// create orders
router.post('/payment', async (req, res, next) => {
    try {
        const { customerId, amountGivenByCustomer } = req.body

        if (!amountGivenByCustomer || isNaN(amountGivenByCustomer) || amountGivenByCustomer < 0) {
            throw new Error("Amount not valid");
        }

        const customer = await Customer.findById(customerId).lean();
        if (!customer) {
            throw new Error("Not found customer");
        }

        const orderDetails = [];

        const cart = req.session.cart || {};
        if (!cart) {
            throw new CartError('Not product in cart!');
        }

        for (const productId in cart) {

            let productData = await Product.findById(productId);
            let quantity = cart[productId];

            console.log(quantity, productData.retailPrice)

            if (!productData) {
                throw new ProductError("Not found product", 404);
            }

            const orderDetail = new OrderDetail({
                orderId: null,
                productId: productId,
                quantity: cart[productId],
                unitPrice: productData.retailPrice,
                totalPrice: quantity * productData.retailPrice,
            })

            orderDetails.push(orderDetail);
        }

        OrderDetail.insertMany(orderDetails)
            .then(savedOrderDetails => {

                const totalAmount = savedOrderDetails.reduce((total, orderDetail) => total + orderDetail.totalPrice, 0);

                if (Number(amountGivenByCustomer) < totalAmount) {
                    throw new Error(`Vui lòng nhập số tiền lớn hơn`)
                }

                const order = new Order({
                    customerId: customer._id,
                    totalAmount,
                    amountGivenByCustomer,
                    excessAmountPaidBack: Number(amountGivenByCustomer) - Number(totalAmount),
                    orderDetails: orderDetails.map(o => o._id),
                    payment: {
                        paymentMethod: 'cash',
                        paymentStatus: 'completed',
                    },
                })

                savedOrderDetails.forEach(savedOrderDetail => {
                    savedOrderDetail.orderId = order._id;
                });

                return Promise.all([order.save(), ...savedOrderDetails.map(orderDetail => orderDetail.save())])
            })
            .then(([savedOrder, ...savedOrderDetails]) => {
                req.session.idOrder = savedOrder._id;
                return res.status(200).json({
                    code: 1,
                    status: true,
                    message: 'Order and OrderDetails saved successfully',
                    data: {
                        savedOrder,
                        savedOrderDetails
                    }
                })
            })
            .catch(err => {
                next(err)
            })
    }
    catch (error) {
        if (error.message.includes('Cast to ObjectId failed')) {
            console.log(error.message)
            return res.status(404).json({
                code: 1,
                message: 'Tham số truyền vào không hợp lệ'
            })
        }
        else {
            next(error)
        }
    }
})

// get order by idorder
router.get('/:idOrder', async (req, res, next) => {

    let idOrder = req.params.idOrder;

    const order = await Order.findById(idOrder)
        .populate('orderDetails')
        .populate('customerId')
        .lean();

    return res.status(200).json({
        code: 1,
        status: true,
        data: order
    })
})

const Directory = path.join(__dirname, "../", "helpers", "invoice.html");
const html = fs.readFileSync(Directory, 'utf8');

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Invoice</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page',
            last: 'Last Page'
        }
    }
};

router.get('/file/generate-pdf/:idOrder', async (req, res, next) => {

    const { idOrder } = req.params;

    const order = await Order.findById(idOrder)
        .populate({
            path: 'orderDetails',
            populate: {
                path: 'productId',
                model: 'Product',
            },
        })
        .populate('customerId')
        .lean();

    // console.log(order)

    var document = {
        html: html,
        data: {
            order: order,
        },
        path: "./output.pdf",
        type: "buffer",
    };

    pdf
        .create(document, options)
        .then((response) => {
            // Send the PDF as a response
            res.contentType('application/pdf');
            res.send(response);
        })
        .catch((error) => {
            console.error(error);
        });
});

router.use((err, req, res, next) => {
    if (err instanceof CartError) {
        if (err.contains("Not product in cart!")) {
            // return res.redirect('/sale')
            return res.status(404).json({
                code: 0,
                status: false,
                message: 'Cart empty'
            })
        }
    }
    else if (err instanceof ProductError) {
        return res.status(404).json({
            code: 0,
            status: false,
            message: 'Not found product'
        })
    }
    else {
        next(err);
    }
})

module.exports = router;