const paypal = require('@paypal/checkout-server-sdk');

class Order {
    constructor(options, payPalClient) {
        this.body = Order.buildRequestBody(options);
        this.payPalClient = payPalClient;
        this.responses = {
            create: null,
            capture: null,
            refund: null
        };
        this.amount = options.amount || options.body.amount;
    }

    async create() {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(this.body);
        this.responses.create = await this.payPalClient.client().execute(request);
        this.id = this.responses.create.result.id;
        if(this.responses.create.result.status !== "CREATED"){
          //  console.error(this.responses.create);
            throw new Error("Error creating order");
        }
    }

    async capture(){
        if(!this.id){
            throw new Error('No ID found. Please create this Order first by calling `order.create()`.')
        }
        const request = new paypal.orders.OrdersCaptureRequest(this.id);
        request.requestBody({});
        this.responses.capture = await this.payPalClient.client().execute(request);
        if(this.responses.capture.result.status !== "COMPLETED"){
          //  console.error(this.responses.capture);
            throw new Error("Error could not not capture funds");
        }
    }

    async refund(amount){
        if(typeof amount !== "number"){
            throw new Error("Argument `amount` must be a valid number");
        }
        const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(this.id);
        request.requestBody({
            "amount": {
                "value": amount.toString(),
                "currency_code": "USD"
            }
        });
        this.responses.refund =  await this.payPalClient.client().execute(request);
        if(this.responses.refund.result.status !== "COMPLETED"){
            throw new Error("Error could not not refund funds");
        }
    }



    static buildRequestBody(options) {
        if(options.type === "custom"){
            return options.body;
        }
        if (options.type === "min") {
            return {
                "intent": "CAPTURE",
                "application_context": {
                    "return_url": options.return_url,
                    "cancel_url": options.cancel_url,
                },
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "USD",
                            "value": options.amount
                        }
                    }
                ]
            };
        }
        return {
            "intent": "CAPTURE",
            "application_context": {
                "return_url": options.return_url,
                "cancel_url": options.cancel_url,
                "brand_name": options.brand_name,
                "locale": "en-US",
                "landing_page": "BILLING",
                "user_action": "CONTINUE"
            },
            "purchase_units": [
                {
                    "description": options.description,

                    "custom_id": options.custom_id,
                    "amount": {
                        "currency_code": "USD",
                        "value": options.amount
                    }
                }
            ]
        };
    }
}
module.exports = Order;
