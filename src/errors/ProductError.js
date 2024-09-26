class ProductError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ProductError';
        this.statusCode = statusCode;
    }
}
module.exports = ProductError;