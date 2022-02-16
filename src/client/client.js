let https = require('https');
let deasync = require("deasync");

class RaidHelperClient {
    constructor() {
        this.apiUrl = "https://raid-helper.dev/api/";
    }

    // public methods
    async queryAsync(resource, cbSuccess) {
        let url = this.apiUrl + resource;
        console.log(url);
        https.get(url, function(response) {
            let str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                cbSuccess(str);
            });
        });
    }

    query(resource) {
        let self = this;
        let result = null;
        let fn = function(data) {
            result = data;
        }
        this.queryAsync(resource, fn);
        deasync.loopWhile(function() { return (result === null); });
        return result;
    }

    // private methods
}

module.exports = RaidHelperClient;