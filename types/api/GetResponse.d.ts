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
    name?: string;
    email: string;
    token: string;
    dayOfCycle?: number;
    ip?: string;
    customFields?: Array<customField>;
}
export interface updateContactOptions {
    name?: string;
    token?: string;
    note?: string;
    dayOfCycle?: number;
    scoring?: number;
    tags?: Array<string>;
    customFields?: Array<customField>;
}
export interface callOptions {
    method: Method;
    path: string;
    data?: any;
}
export interface Contact {
    contactId: string;
    href: string;
    name: string | null;
    email: string;
    note: string | null;
    origin: string;
    dayOfCycle: number;
    changedOn: null | string;
    timeZone: string;
    ipAddress: string;
    activities: string;
    campaign: {
        campaignId: string;
        href: string;
        name: string;
    };
    createdOn: string;
    scoring: null | number;
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
    findContactByEmail(email: string): Promise<Contact | null>;
    updateContact(contactId: string, data: updateContactOptions): Promise<Contact>;
    deleteContact(contactId: string): Promise<boolean>;
    private call(callData);
}
