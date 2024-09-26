const mongoose = require('mongoose')

const options = {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
}

const connectDb = (url) => {
    return mongoose.connect(url, options)
}

module.exports = connectDb