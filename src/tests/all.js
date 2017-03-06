"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Should = require("should");
const GetResponse_1 = require("../api/GetResponse");
let config;
let id = "";
describe("API tests", () => {
    before(() => {
        try {
            config = require("./config.json");
        }
        catch (err) {
            console.error(`    ! ${err.message}. For the tests you must setup config.json like config.example.json.`);
        }
    });
    it("Add new Contact", function () {
        if (config === undefined)
            this.skip();
        this.slow(20000);
        let gr = new GetResponse_1.GetResponse(config);
        return gr.debug(false).addContact({
            name: "Random Test",
            email: "random-test-123@gmail.com",
            token: config.token,
            dayOfCycle: 0,
            ip: "10.20.30.40",
            customFields: [{
                    id: config.customs[0],
                    value: ["Test"]
                }, {
                    id: config.customs[1],
                    value: ["CA"]
                }]
        }).then(response => {
            Should(response).be.exactly(true);
        });
    });
    it("Find Contact by E-mail", function () {
        if (config === undefined)
            this.skip();
        this.slow(20000);
        let gr = new GetResponse_1.GetResponse(config);
        return gr.debug(false).findContactByEmail("random-test-123@gmail.com").then(response => {
            Should(response).has.property("contactId");
            id = response.contactId;
            Should(response).has.property("name");
            Should(response).has.property("email");
            Should(response).has.property("dayOfCycle");
            Should(response.name).be.exactly("Random Test");
            Should(response.email).be.exactly("random-test-123@gmail.com");
            Should(response.dayOfCycle).be.exactly("0");
            Should(response).has.property("campaign");
            Should(response.campaign).has.property("campaignId");
            Should(response.campaign.campaignId).be.exactly(config.token);
        });
    });
    it("Update Contact", function () {
        if (config === undefined)
            this.skip();
        this.slow(20000);
        let gr = new GetResponse_1.GetResponse(config);
        return gr.debug(false).updateContact(id, {
            token: config.token,
            name: "Random2 ChangeTest",
            note: "test-note",
            customFields: [{
                    "id": config.customs[0],
                    "value": ["Test2"]
                }, {
                    "id": config.customs[1],
                    "value": ["US"]
                }]
        }).then(response => {
            Should(response).has.property("contactId");
            Should(response.contactId).be.exactly(id);
            Should(response).has.property("name");
            Should(response).has.property("email");
            Should(response).has.property("note");
            Should(response).has.property("customFieldValues");
            Should(response.name).be.exactly("Random2 ChangeTest");
            Should(response.email).be.exactly("random-test-123@gmail.com");
            Should(response.note).be.exactly("test-note");
        });
    });
    it("Add Duplicate Contact", function () {
        if (config === undefined)
            this.skip();
        this.slow(20000);
        let gr = new GetResponse_1.GetResponse(config);
        return gr.debug(false).addContact({
            name: "Random2 ChangeTest",
            email: "random-test-123@gmail.com",
            token: config.token,
            dayOfCycle: 0,
            customFields: [{
                    id: config.customs[0],
                    value: ["Test2"]
                }, {
                    id: config.customs[1],
                    value: ["US"]
                }]
        }).then(response => {
            throw new Error("Duplicate Contact");
        }).catch((err) => {
            Should(err).has.property("res");
            Should(err.res).has.property("statusCode");
            Should(err.res.statusCode).be.exactly(409);
        });
    });
    it("Delete Contact", function () {
        if (config === undefined)
            this.skip();
        this.slow(20000);
        let gr = new GetResponse_1.GetResponse(config);
        return gr.debug(false).deleteContact(id).then(response => {
            Should(response).be.exactly(true);
        });
    });
    it("Find non-existent Contact by E-mail", function () {
        if (config === undefined)
            this.skip();
        this.slow(20000);
        let gr = new GetResponse_1.GetResponse(config);
        return gr.debug(false).findContactByEmail("non-existent-test-123@gmail.com").then(response => {
            Should(response).be.exactly(null);
        });
    });
});
