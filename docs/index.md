#  api-getresponse
api-getresponse
===========
[![Build Status](https://travis-ci.org/scippio/api-getresponse.svg)](https://travis-ci.org/scippio/api-getresponse)
[![Dependency Status](https://david-dm.org/scippio/api-getresponse.svg)](https://david-dm.org/scippio/api-getresponse)
[![devDependency Status](https://david-dm.org/scippio/api-getresponse/dev-status.svg)](https://david-dm.org/scippio/api-getresponse#info=devDependencies)
Quick Usage
-----
```!javascript
import { GetResponse } from "api-getresponse"
let gr = new GetResponse({
"apiKey": "xxx"
})
gr.addContact({
name: "Random Test",
email: "random-test-123@gmail.com",
token: "yyy",
dayOfCycle: 0,
ip: "10.20.30.40",
customFields: [{
id: "abcd",
value: ["Test"]
},{
id: "efgh",
value: ["CA"]
}]
}).then(ok => {
if(ok) console.log("Contact added!")
}).catch(err => {
console.log(err)
})
```
Docs
-----
This lib Doc: [Documentation](docs/index.md)
Get Response official API doc: [Get Response API](https://apidocs.getresponse.com/v3)
# Index
* *[Globals](globals.md)** ["api/GetResponse"](modules/_api_getresponse_.md)* ["index"](modules/_index_.md)* ["tests/all"](modules/_tests_all_.md)
Generated using [TypeDoc](http://typedoc.io)