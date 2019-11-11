const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const Order = require('./Order');
const PayPalClient = require('./PayPalClient');

class PayPalSimple {
    constructor(clientId, secret, sandboxEnvironment) {
        this._clientId = clientId;
        this._secret = secret;
        this._apiurl = require('./APIURL')(sandboxEnvironment);
        this.isSandbox = sandboxEnvironment;
        this.paypalClient = new PayPalClient(clientId, secret, sandboxEnvironment)
    }

    async createOrder(options) {
        const order = new Order(options, this.paypalClient);
        await order.create();
        return order;
    }
}
module.exports = PayPalSimple;
