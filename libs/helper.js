const helper = {};
const conf = require('./conf.js');
const crypto = require('crypto');

helper.md5 = function(str, saltKey){
    let salt;
    salt = saltKey ? saltKey : conf.security.salt;
    let md5sum = crypto.createHash('md5');
    md5sum.update(str+salt);
    str = md5sum.digest('hex');
    return str;
};

helper.inArray = function(ele, arr){
    let isArr = false;
    if (arr && typeof arr == 'object' && arr.constructor === Array) {
        isArr = true;
    }
    if (!isArr) {
        return false;
    }
    let len = arr.length;
    for(let i=0;i < len; i++){
        if(ele == arr[i] ){
            return true;
        }
    }
    return false;
};

helper.mergeObject = function(obj1, obj2){
    let obj = obj2;
    for (let k in obj1) {
        obj[k] = obj1[k];
    }
    return obj;
};



helper.getExtenstion

module.exports = helper;