module.exports = (sandboxEnvironment) => {
    if(sandboxEnvironment){
        return "https://api.sandbox.paypal.com";
    } else {
        return "https://api.paypal.com";
    }
};
