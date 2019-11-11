const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const config = require('../../config/config.json');
const Order = require('./Order');
const AccessToken = require('./AccessToken');
const PayPalClient = require('./PayPalClient');

class PayPalSimple {
    constructor(clientId, secret, sandboxEnvironment) {
        this._clientId = clientId;
        this._secret = secret;
        this._apiurl = require('./APIURL')(sandboxEnvironment);
        this.isSandbox = sandboxEnvironment;
        this.paypalClient = new PayPalClient(clientId, secret, sandboxEnvironment)
        //this._accessToken = new AccessToken(this._clientId, this, this._secret, this.isSandbox);
    }

    async createOrder(options) {
        const order = new Order(options, this.paypalClient);
        await order.create();
        return order;
    }
}
module.exports = PayPalSimple;
