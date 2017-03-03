/// <reference types="bluebird" />
import * as Promise from "bluebird";
export interface GetResponseConfig {
    apiKey: string;
}
export interface customField {
    id: string;
    value: Array<string | number | boolean>;
}
export interface addContactOptions {
    name: string;
    email: string;
    token: string;
    dayOfCycle?: number;
    ip?: string;
    customFields?: Array<customField>;
}
export interface callOptions {
    method: Method;
    path: string;
    data: any;
}
export declare type Method = "GET" | "POST" | "DELETE";
export declare class GetResponse {
    private readonly apiUrl;
    private readonly apiUrlVersion;
    private config;
    private client;
    private _debug;
    constructor(config: GetResponseConfig);
    debug(dbg: boolean): this;
    addContact(data: addContactOptions): Promise<boolean>;
    private call(callData);
}
