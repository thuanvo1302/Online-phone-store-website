const mongoose = require("mongoose");
const customerScheme = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        require: true
    },
    fullname: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
})
const Customer = mongoose.model("Customer", customerScheme)
module.exports = Customer