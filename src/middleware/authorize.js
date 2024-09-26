const jwt = require('jsonwebtoken')
require('dotenv')

const authorize = (allowedRole) => async (req, res, next) => {
    try {
        // Check if the user's role is in the allowedRoles array
        if (allowedRole && req.user.role !== allowedRole) {
            return res.status(403).json({
                code: 102,
                success: false,
                message: 'Insufficient permissions for the specified role',
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};
module.exports = authorize;

