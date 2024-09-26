const OrderDetail = require('../models/OrderDetail')
const Order = require('../models/Order')
const Customer = require('../models/Customer')

// error 
const CustomerError = require('../errors/CustomerError')

const CustomerController = {

    // Post add customer 
    addCustomer: async (req, res, next) => {
        const createCustomer = (req) => {
            return new Promise((resolve, reject) => {
                const newCustomer = new Customer(req.body)
                newCustomer.save()
                    .then((arg) => {
                        resolve(arg)
                    })
                    .catch((err) => {
                        console.log('Customer creation failed:', err)
                        resolve(undefined)
                    });
            })
        }
        try {
            let customer = await createCustomer(req)
            if (customer !== undefined) {
                res.status(201).json({ code: 1, message: "Customer created successfully", data: customer });
            } else {
                res.status(400).json({ code: 0, message: "Customer created fail" });
            }
        } catch (error) {
            next(error)
        }
    },

    // GET all customer
    getAllCustomer: async (req, res, next) => {
        const { phoneNumber } = req.query
        try {
            let queryObject = {}
            if (phoneNumber) {
                queryObject.phoneNumber = phoneNumber
            }
            let result = await Customer.find(queryObject);
            result = result.map(r => {
                let name = r.fullname
                let fullname = r.fullname.split(' ')
                if (fullname.length > 0) {
                    name = fullname[fullname.length - 1]
                }
                return {
                    _id: r._id,
                    phoneNumber: r.phoneNumber,
                    name: name,
                    address: r.address,
                    fullname: r.fullname
                }
            })
            res.status(200).json({ code: 1, message: 'Get customer successfully', data: result });
        } catch (error) {
            console.log(error)
            res.status(400).json({ code: 0, message: 'Get customer fail' });
        }
    },

    // PUT  customer
    updateCustomer: async (req, res) => {
        try {
            const customer = await Customer.findById(req.params.id);
            await customer.updateOne({ $set: req.body })
            res.status(200).json({ code: 1, message: 'Update customer successfully' });
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // DELETE customer
    deleteCustomer: async (req, res) => {
        try {
            const customer = await Customer.findByIdAndDelete(req.params.id);
            res.status(200).json({ code: 1, message: 'Delete customer successfully' });
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // GET CUSTOMER BY ID  
    getDetailCustomer: async (req, res, next) => {
        try {
            const customer = await Customer.findOne({ _id: req.params.id })
            if (!customer) {
                throw new CustomerError("Not found customer", 404)
            }
            return res.status(200).json({ code: 1, data: customer });

        } catch (error) {
            next(error)
        }
    },

    // Get find customer by phone number
    findCustomerByPhone: async (req, res, next) => {
        try {
            const { phoneNumber } = req.params;
            const customer = await Customer.findOne({ phoneNumber: phoneNumber }).lean();
            if (!customer) {
                return res.status(404).json({
                    code: 0,
                    message: "Not found customer"
                })
            }
            res.status(200).json({ code: 1, message: 'Successfully', data: customer })
        } catch (error) {
            next(new CustomerError(error))
        }
    },

    // Get orders of customer by phoneNumber
    findOrdersByPhoneNumber: async (req, res, next) => {
        // const { phoneNumber } = req.params;
        // let name = ''
        // Customer.findOne({ phoneNumber: phoneNumber })
        //     .then(customer => {
        //         if (!customer) {
        //             throw new Error('Customer not found');
        //         }
        //         name = customer.fullname
        //         return Order.find({ customerId: customer._id })
        //     })
        //     .then((orders) => {
        //         const ordersDTO = orders.map(order => {
        //             const orderDetails = order.orderDetails
        //             return {
        //                 _id: order._id,
        //                 totalAmount: order.totalAmount,
        //                 dateOfPurchase: order.dateOfPurchase,
        //                 orderStatus: order.orderStatus,
        //                 amountGivenByCustomer: order.amountGivenByCustomer,
        //                 excessAmountPaidBack: order.excessAmountPaidBack,
        //                 quantity: orderDetails.length,
        //                 fullname: name
        //             }
        //         })
        //         res.status(200).json({ code: 1, message: 'get order history succcess', data: ordersDTO })
        //     })
        //     .catch(error => {
        //         console.log(error)
        //         res.status(404).json({ code: 0, message: error.message })
        //     });
        try {
            const { phoneNumber } = req.params;

            const customer = await Customer.findOne({ phoneNumber: phoneNumber }).lean();

            if (!customer) {
                throw new Error('Customer not found');
            }

            const name = customer.fullname;

            const orders = await Order
            .find({ customerId: customer._id })
            .select('_id totalAmount dateOfPurchase orderStatus amountGivenByCustomer excessAmountPaidBack orderDetails')
            .sort({ dateOfPurchase: -1 });

            const ordersDTO = orders.map(order => {
                return {
                    _id: order._id,
                    totalAmount: order.totalAmount,
                    dateOfPurchase: order.dateOfPurchase,
                    orderStatus: order.orderStatus,
                    amountGivenByCustomer: order.amountGivenByCustomer,
                    excessAmountPaidBack: order.excessAmountPaidBack,
                    quantity: order.orderDetails.length,
                    fullname: name
                };
            });

            res.status(200).json({ code: 1, message: 'get order history success', data: ordersDTO });
        } catch (error) {
            console.error(error);
            res.status(404).json({ code: 0, message: error.message });
        }
    },

    // Get orderdetails of customer 
    findOrderDetail: async (req, res, next) => {

        const { idOrder } = req.params;

        new Promise((resolve, reject) => {
            OrderDetail.find({ orderId: idOrder }).populate("productId").lean()
                .then(orderDetail => {
                    if (!orderDetail) {
                        reject(new Error('Not found'))
                    }
                    resolve(orderDetail)
                })
                .catch(error => reject(error))
        })
            .then(arg => {
                res.status(200).json({ code: 1, message: 'successfully', data: arg });
            })
            .catch(error => {
                next(error)
            });
    }
}
module.exports = CustomerController