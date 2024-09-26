const mongoose = require("mongoose");
const orderScheme = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    totalAmount: {
        type: Number,
        default: 0,
        require: true,
    },
    dateOfPurchase: {
        type: Date,
        default: Date.now,
    },
    amountGivenByCustomer: {
        type: Number,
        require: true,
    },
    excessAmountPaidBack: {
        type: Number,
        require: true,
    },
    orderDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderDetail',
            require: true,
        }
    ],
    payment: {
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank', 'qrcode'],
            default: 'cash',
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
            default: 'completed',
        },
    }
}, { timestamps: true })

// index
orderScheme.index({ customerId: 1, orderDetails: 1 });

const Order = mongoose.model("Order", orderScheme)
module.exports = Order