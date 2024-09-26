class CartError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'Cart';
        this.statusCode = statusCode;
    }
}
module.exports = CartError;