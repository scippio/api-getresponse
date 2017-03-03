import * as Promise from "bluebird"
import * as Restify from "restify"
import * as Qs from "querystring"

export interface GetResponseConfig {
    apiKey: string
}

export interface customField {
    id: string
    value: Array<string | number | boolean>
}

export interface addContactOptions {
    name: string
    email: string
    token: string
    dayOfCycle?: number
    ip?: string
    customFields?: Array<customField>
}

export interface callOptions {
    method: Method
    path: string
    data: any
}

export type Method = "GET" | "POST" | "DELETE"

export class GetResponse {

    private readonly apiUrl: string = "https://api.getresponse.com"
    private readonly apiUrlVersion: string = "/v3"
    private config: GetResponseConfig
    private client: Restify.Client
    private _debug: boolean = false

    constructor(config: GetResponseConfig){
        this.config = config
    }

    debug(dbg: boolean): this {
        this._debug = dbg
        return this
    }

    addContact(data: addContactOptions): Promise<boolean> {

        let req: any = {
            name: data.name,
            email: data.email,
            dayOfCycle: data.dayOfCycle || 0,
            campaign: {
                campaignId: data.token
            },
            ipAddress: data.ip
        }
        if(data.customFields){
            req.customFieldValues = []
            data.customFields.forEach(field => {
                req.customFieldValues.push({
                    customFieldId: field.id,
                    value: field.value
                })
            })
        }

        return this.call({
            method: "POST",
            path: "/contacts",
            data: req
        }).then(response => {
            return (response.res.statusCode === 202)
        })

    }

    private call(callData: callOptions): Promise<any> {

        let client = Restify.createJsonClient({
            url: this.apiUrl,
            requestTimeout: 5000,
            retry: false,
            headers: {
                "X-Auth-Token": `api-key ${this.config.apiKey}`
            }
        })

        return new Promise((resolve,reject) => {
            if(callData.method === "POST"){
                if(this._debug) console.log(`curl -X POST -H 'X-Auth-Token: api-key ${this.config.apiKey}' -H 'Content-Type: application/json' -d '${JSON.stringify(callData.data)}' '${this.apiUrl}${callData.path}'`)
                client.post(`${this.apiUrlVersion}${callData.path}`, callData.data,(err,req,res,obj) => {
                    if(this._debug) console.log(obj)
                    if(err){
                        if(this._debug) console.error(err)
                        return reject(obj)
                    }
                    resolve({
                        res: res,
                        obj: obj
                    })
                })
            }
        })
    }
}
