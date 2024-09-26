const mongoose = require('mongoose')
const userScheme = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    fullName: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    inactivateStatus: {
        type: Boolean,
        default: false,
    },
    lockedStatus: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['admin', 'saleperson'],
        default: 'saleperson',
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })
module.exports = mongoose.model('User', userScheme)
