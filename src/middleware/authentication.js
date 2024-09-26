const jwt = require('jsonwebtoken')
require('dotenv')

const isAuthenticated = async (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies.token;
        const authorizationHeader = req.headers.authorization;

        // Check if either the Authorization header or the cookie contains a token
        if (!tokenFromCookie && !authorizationHeader) {
            return res.status(401).json({
                code: 1,
                success: false,
                message: 'Please provide the Authorization header or a valid token cookie',
            });
        }

        let token = authorizationHeader ? authorization.split(' ')[1] : tokenFromCookie;
        if (!token) {
            return res.status(401).json({
                code: 1,
                success: false,
                message: 'Please provide a valid token'
            })
        }

        const { JWT_SECRET } = process.env;

        jwt.verify(token, JWT_SECRET, (err, data) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        code: 101,
                        success: false,
                        message: 'Token has expired',
                    });
                }

                return res.status(401).json({
                    code: 101,
                    success: false,
                    message: 'Invalid token',
                });
            }
            req.user = data;
            next()
        })
    } catch (error) {
        next(error)
    }
}

module.exports = isAuthenticated;
