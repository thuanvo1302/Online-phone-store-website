const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const createJwt = (email, pass, time) => {
    return jwt.sign({
        email,
        pass
    }, JWT_SECRET, { expiresIn: time })
}

const createJwtAuth = (email, time, callback) => {
    return jwt.sign({
        email,
    }, JWT_SECRET, { expiresIn: time }, callback)
} 

const verifyJwt = (token) => {
    return jwt.verify(token, JWT_SECRET,)
}

module.exports = { jwt: { createJwt, verifyJwt ,  createJwtAuth } }