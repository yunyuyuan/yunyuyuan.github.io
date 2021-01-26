// import md5 from 'md5';
// console.log(md5(''));

const fs = require("fs");
const path = require("path");
const siteConfig = require('../site-config');

module.exports = class genTimeStamp {
    apply (compiler){
        compiler.hooks.emit.tap('genTimeStamp', (compilation) => {
            const dist = compilation.options.output.path;
            fs.mkdir(dist, err=>{
                fs.writeFile(path.join(compilation.options.output.path, 'time.stamp'), siteConfig.timeStamp.toString(), function(err) {
                    if (err) {
                        throw '[write time.stamp err]:'+err;
                    }
                });
            })
        });
    }
}