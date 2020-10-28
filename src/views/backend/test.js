const convert = require('xml-js');

console.log(convert.js2xml(JSON.stringify({
    rss: {
        _attributes: {
            version: '2.0'
        },
        channel: {

        }
    }
})));