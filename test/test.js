const config = require('./config.json');
const {PayPalSimple} = require('../index.js');

async function main() {
    const payPalSimple = new PayPalSimple(config.clientId, config.secret, true);
    console.log("Creating Order...");
    const order = await payPalSimple.createOrder({
        type: "min",
        amount: "5.00",
        return_url: "http://example.com/return",
        cancel_url: "http://example.com/cancel",
    });
    const approve_url = order.approve_url;
    console.log("ID: " + order.id);
    console.log("Approve URL: " + approve_url);
    console.log("\nCopy approve link and paste it in browser. Login with buyer account and follow the instructions.\nOnce approved hit enter...");
    await prompt();
    console.log('Capturing Order...');
    const captureOrder = payPalSimple.getPreviousOrder(order.id); // could just use the existing object but in most cases you will need to use the id as you wont have the previous object
    captureOrder.capture().then(async _ => {
        console.log("We got the cash! Refunding...");
        await captureOrder.refund(5.00);
        console.log("Done");
    }).catch(e => {
        console.error(e);
        console.log("They didn't pay.")
    });
}

function prompt(question = '') {
    return new Promise((resolve, reject) => {
        const stdin = process.stdin;
        const stdout = process.stdout;
        stdin.resume();
        stdout.write(question);

        stdin.on('data', data => resolve(data.toString().trim()));
        stdin.on('error', err => reject(err));
    });
}

main();
