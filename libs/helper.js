const helper = {};
const fs = require('fs');
const conf = require('./conf.js');
const crypto = require('crypto');
const path = require('path');
const registry = require('../libs/registry');

helper.config = {};

helper.md5 = function(str, saltKey){
    let salt;
    salt = saltKey ? saltKey : conf.security.salt;
    let md5sum = crypto.createHash('md5');
    md5sum.update(str+salt);
    str = md5sum.digest('hex');
    return str;
};

helper.isArray = function(arr){
    let isArr = false;
    if (arr && typeof arr == 'object' && arr.constructor === Array) {
        isArr = true;
    }
    return isArr;
};

helper.inArray = function(ele, arr){
    let isArr = helper.isArray(arr);
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


helper.getItem = function(key, grp){
    let group;
    group = grp ? grp : 'options';
    if (conf[key]) {
       return conf[key];
    }
    const v = registry.get(key);
    if (v) {
        return v;
    }
    let file = './conf/'+group+'.json';
    const data = fs.readFileSync(file);
    if (data) {
        const obj = JSON.parse(data.toString());
        registry.register(obj);
        if (key) {
            if (obj[key]) {
                return obj[key];
            }
            return false;
        }  else {
            return obj;
        }
    }
    return false;
};

helper.resetItem = function(data, grp){
    let group;
    group = grp ? grp : 'options';
    registry.register(data);
    const dataStr = JSON.stringify(data);
    let file = './conf/'+group+'.json';
    const result = fs.writeFileSync(file, dataStr);
    return result;
};

helper.arrayColumn = function(arr, k){
    if (!helper.isArray(arr)) {
        return arr;
    }
    const newArr = [];
    for (let i=0; i< arr.length; i++) {
        if (!arr[i] || !arr[i][k]) {
            continue;
        }
        newArr[arr[i][k]] = arr[i];
    }
    return newArr;
};

helper.getAppConf = function(key){
    if (key) {
        if (conf[key]) {
            return conf[key];
        }
        return false;
    }
    return conf;
};

helper.formatTime = function(time, format){
    let date = new Date();
    if (!format) {
        format = '%Y-%m-%d %H:%i:%s';
    }
    let timeStr = '';
    if (time && time != '' && time > 0) {
        date = new Date(time);
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    timeStr = format.replace('%Y', year);
    timeStr = timeStr.replace('%m', month);
    timeStr = timeStr.replace('%d', day);
    timeStr = timeStr.replace('%H', hours);
    timeStr = timeStr.replace('%i', minutes);
    timeStr = timeStr.replace('%s', seconds);
    return timeStr;
};



module.exports = helper;