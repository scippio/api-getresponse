"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const Restify = require("restify");
class GetResponse {
    constructor(config) {
        this.apiUrl = "https://api.getresponse.com";
        this.apiUrlVersion = "/v3";
        this._debug = false;
        this.config = config;
    }
    debug(dbg) {
        this._debug = dbg;
        return this;
    }
    addContact(data) {
        let req = {
            name: data.name,
            email: data.email,
            dayOfCycle: data.dayOfCycle || 0,
            campaign: {
                campaignId: data.token
            },
            ipAddress: data.ip
        };
        if (data.customFields) {
            req.customFieldValues = [];
            data.customFields.forEach(field => {
                req.customFieldValues.push({
                    customFieldId: field.id,
                    value: field.value
                });
            });
        }
        return this.call({
            method: "POST",
            path: "/contacts",
            data: req
        }).then(response => {
            return (response.res.statusCode === 202);
        });
    }
    call(callData) {
        let client = Restify.createJsonClient({
            url: this.apiUrl,
            requestTimeout: 5000,
            retry: false,
            headers: {
                "X-Auth-Token": `api-key ${this.config.apiKey}`
            }
        });
        return new Promise((resolve, reject) => {
            if (callData.method === "POST") {
                if (this._debug)
                    console.log(`curl -X POST -H 'X-Auth-Token: api-key ${this.config.apiKey}' -H 'Content-Type: application/json' -d '${JSON.stringify(callData.data)}' '${this.apiUrl}${callData.path}'`);
                client.post(`${this.apiUrlVersion}${callData.path}`, callData.data, (err, req, res, obj) => {
                    if (this._debug)
                        console.log(obj);
                    if (err) {
                        if (this._debug)
                            console.error(err);
                        return reject(obj);
                    }
                    resolve({
                        res: res,
                        obj: obj
                    });
                });
            }
        });
    }
}
exports.GetResponse = GetResponse;
