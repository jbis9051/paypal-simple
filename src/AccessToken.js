const request = require("request-promise");

const EXPIRES_CUSHION = 30;

class AccessToken {
    constructor(client_id, secret, sandboxEnvironment) {
        this.client_id = client_id;
        this.secret = secret;
        this._tokenPromise = this._newTokenRequest();
        this._apiurl = require('./APIURL')(sandboxEnvironment);
    }

    _newTokenRequest() {
        return request({
            method: "POST",
            uri: this._apiurl + "/v1/oauth2/token",
            headers: {
                "Accept": "application/x-www-form-urlencoded",
                "Accept-Language": "en_US",
            },
            auth: {
                user: this.client_id,
                password: this.secret
            },
            body: {
                grant_type: "client_credentials",
            }
        }).then(resp => {
            /*
                {
                  "scope": "scope",
                  "access_token": "Access-Token",
                  "token_type": "Bearer",
                  "app_id": "APP-80W284485P519543T",
                  "expires_in": 31349,
                  "nonce": "nonce"
                }
             */
            const json = JSON.parse(resp);
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() + json.expires_in - EXPIRES_CUSHION);
            this._expires = expires;
            this._token = json.access_token;
        }).catch(error => {
            throw new Error("Error with request to get token: " + error.toString())
        });
    }

    async getToken() {
        if (this.isExpired()) {
            return this._token
        }
        await this._newTokenRequest();
        return this._token;
    }
    isExpired(){
        return new Date() <= this._expires;
    }
}
module.exports = AccessToken;
