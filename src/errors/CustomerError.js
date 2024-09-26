class CustomerError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'Customer';
        this.statusCode = statusCode;
    }
}
module.exports = CustomerError;