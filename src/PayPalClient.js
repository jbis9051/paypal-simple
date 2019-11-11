const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

class PayPalClient {
    constructor(clientId, secret, sandboxEnvironment) {
        if (sandboxEnvironment) {
            this.environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, secret);
        } else {
            this.environment = new checkoutNodeJssdk.core.LiveEnvironment(clientId, secret);
        }
    }
    client(){
        return new checkoutNodeJssdk.core.PayPalHttpClient(this.environment);
    }

}
module.exports = PayPalClient;
