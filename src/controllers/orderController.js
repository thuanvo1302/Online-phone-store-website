const Order = require('../models/Order')
const Customer = require('../models/Customer')
const OrderDetail = require('../models/OrderDetail')

// helpers
const { timer } = require('../helpers/timer')
const OrderController = {

    getOrdersByTimePeriod: async (req, res, next) => {
        const time = req.query.time
        const typeTimePeriod = req.query.typeTimePeriod
        var [gt, lt] = [null, null]
        var timeRank = null
        if(typeTimePeriod === 'Hour'){
            timeRank = timer.getHourRangeForDate(time)
        }
        else if(typeTimePeriod === 'Date'){
            timeRank = timer.getDay(time)
        }
        else if (typeTimePeriod === 'Today') {
            timeRank = timer.getToday()
        }
        else if (typeTimePeriod === 'Yesterday') {
            timeRank = timer.getYesterday()
        }
        else if (typeTimePeriod === 'Within the last 7 days') {
            timeRank = timer.getLast7Days(new Date(time))
        }
        else if (typeTimePeriod === 'This month') {
            timeRank = timer.getMonth(new Date(time))
        }
        else if(typeTimePeriod === 'From-To'){
            timeRank = [new Date(req.query.startDate), new Date(req.query.endDate)]
        }
        gt = timeRank[0]
        lt = timeRank[1]

        Order.find({ dateOfPurchase: { $gte: gt, $lte: lt } })
        .sort({ dateOfPurchase: 'asc' })
        .populate('customerId')
        .populate({
            path: 'orderDetails',
            populate: {
                path: 'productId'
            }
        })
        .lean()
            .then((orders) => {
                orders.map(order => {
                    order.totalPrice = 0
                    order.noPro = 0
                    order.orderDetails.map(orderDetail => {
                        order.totalPrice += orderDetail.totalPrice
                        order.noPro += orderDetail.quantity
                    })
                })
                res.status(200).json({orders, startDate: gt, endDate: lt})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: "There aren't any orders in this period" })
            })
    },
}
module.exports = OrderController