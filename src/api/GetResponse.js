"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const Restify = require("restify");
const Qs = require("qs");
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
            email: data.email,
            dayOfCycle: data.dayOfCycle || 0
        };
        if (!this.isEmpty(data.name))
            req.name = data.name;
        if (!this.isEmpty(data.token))
            req.campaign = { campaignId: data.token };
        if (!this.isEmpty(data.ip))
            req.ipAddress = data.ip;
        if (!this.isEmpty(data.customFields)) {
            req.customFieldValues = [];
            data.customFields.forEach(field => {
                if (!this.isEmpty(field.id) && !this.isEmpty(field.value)) {
                    req.customFieldValues.push({
                        customFieldId: field.id,
                        value: field.value
                    });
                }
            });
        }
        return this.call({
            method: "POST",
            path: "/contacts",
            data: req
        }).then(response => {
            return (response.res.statusCode === 202);
        }).catch(err => {
            if (err.res.statusCode === 409 ||
                (err.res.statusCode === 400 && err.obj.message === "Cannot add contact that is blacklisted"))
                return false;
            throw err;
        });
    }
    findContactByEmail(email) {
        return this.call({
            method: "GET",
            path: "/contacts",
            data: {
                query: {
                    email: email
                }
            }
        }).then(response => {
            if (response.obj !== undefined && response.obj.length > 0)
                return response.obj[0];
            return null;
        });
    }
    updateContact(contactId, data) {
        let req = {};
        if (!this.isEmpty(data.name))
            req.name = data.name;
        if (!this.isEmpty(data.note))
            req.note = data.note;
        if (!this.isEmpty(data.dayOfCycle))
            req.dayOfCycle = data.dayOfCycle;
        if (!this.isEmpty(data.token))
            req.compaign = { campaignId: data.token };
        if (!this.isEmpty(data.scoring))
            req.scoring = data.scoring;
        if (!this.isEmpty(data.tags))
            req.tags = data.tags;
        if (!this.isEmpty(data.customFields)) {
            req.customFieldValues = [];
            data.customFields.forEach(field => {
                if (!this.isEmpty(field.id) && !this.isEmpty(field.value)) {
                    req.customFieldValues.push({
                        customFieldId: field.id,
                        value: field.value
                    });
                }
            });
        }
        return this.call({
            method: "POST",
            path: `/contacts/${contactId}`,
            data: req
        }).then(response => {
            return response.obj;
        });
    }
    deleteContact(contactId) {
        return this.call({
            method: "DELETE",
            path: `/contacts/${contactId}`
        }).then(response => {
            return (response.res.statusCode === 204);
        });
    }
    isEmpty(data) {
        if (Array.isArray(data)) {
            let e = true;
            data.forEach((d) => {
                if (!this.isEmpty(d))
                    e = false;
            });
            return e;
        }
        if (data === undefined || data === null || data === "")
            return true;
        return false;
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
            if (callData.method === "GET") {
                /* istanbul ignore if  */
                if (this._debug)
                    console.log(`curl -H 'X-Auth-Token: api-key ${this.config.apiKey}' -H 'Content-Type: application/json' '${this.apiUrl}${this.apiUrlVersion}${callData.path}?${Qs.stringify(callData.data)}'`);
                client.get(`${this.apiUrlVersion}${callData.path}?${Qs.stringify(callData.data)}`, (err, req, res, obj) => {
                    /* istanbul ignore if  */
                    if (this._debug)
                        console.log(obj);
                    if (err) {
                        /* istanbul ignore if  */
                        if (this._debug)
                            console.error(err);
                        return reject({
                            res: res,
                            obj: obj
                        });
                    }
                    resolve({
                        res: res,
                        obj: obj
                    });
                });
            }
            if (callData.method === "POST") {
                /* istanbul ignore if  */
                if (this._debug)
                    console.log(`curl -X POST -H 'X-Auth-Token: api-key ${this.config.apiKey}' -H 'Content-Type: application/json' -d '${JSON.stringify(callData.data)}' '${this.apiUrl}${this.apiUrlVersion}${callData.path}'`);
                client.post(`${this.apiUrlVersion}${callData.path}`, callData.data, (err, req, res, obj) => {
                    /* istanbul ignore if  */
                    if (this._debug)
                        console.log(obj);
                    if (err) {
                        /* istanbul ignore if  */
                        if (this._debug)
                            console.error(err);
                        return reject({
                            res: res,
                            obj: obj
                        });
                    }
                    resolve({
                        res: res,
                        obj: obj
                    });
                });
            }
            if (callData.method === "DELETE") {
                /* istanbul ignore if  */
                if (this._debug)
                    console.log(`curl -X DELETE -H 'X-Auth-Token: api-key ${this.config.apiKey}' '${this.apiUrl}${this.apiUrlVersion}${callData.path}'`);
                client.del(`${this.apiUrlVersion}${callData.path}`, (err, req, res) => {
                    /* istanbul ignore if  */
                    if (this._debug)
                        console.log(res);
                    if (err) {
                        /* istanbul ignore if  */
                        if (this._debug)
                            console.error(err);
                        return reject({
                            res: res
                        });
                    }
                    resolve({
                        res: res
                    });
                });
            }
        });
    }
}
exports.GetResponse = GetResponse;
