const config = {};
const configModel = require('../../models/config.js');
const helper = require('../../libs/helper.js');
const fs = require('fs');


config.index = async function(req, res){
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 15;
    if (page < 1) {
        page = 1;
    }
    let offset = 0;
    if (page > 0 ) {
        offset = (page - 1)*pagesize;
    }
    const condition = {};
    const query = req.query;
    if (query.key && query.key != '') {
        condition.key = query.key.trim();
    }
    if (query.group && query.group != '') {
        condition.group = query.group.trim();
    }
    if (query.title && query.title != '') {
        condition.title = query.title.trim();
    }

    const result = await configModel.search(condition, offset, pagesize);
    const pageCount = Math.ceil(result.count / pagesize);
    res.render('config/index', {title : '配置列表', condition : condition, data : result, page : {page : page, pagesize : pagesize, pageCount : pageCount}});
};

config.options = async function(req, res){
    const data = await configModel.lists();
    res.render('config/options', {title : '配置管理', datalist : data});
};


config.add = function(req, res){
    res.render('config/add', {title : '添加配置'});
};

config.insert = async function(req, res){
    let result = {};
    let data = check(req, res);
    try {
        result = await configModel.add(data);
    } catch (e) {
        result = {error : '添加失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '添加成功', data : {url : '/console/config/index'}});
    }
};

config.edit = async function(req, res){
    const id = req.params.id.trim();
    let error = '';
    let info = {};
    if (!id || id == '') {
        error = '非法参数';
    } else {
        try {
            info = await configModel.detail(id);
        } catch(e) {
            error = '未查到该配置';
        }

        if (!info.key) {
            info = false;
            error = '未查到该配置';
        }
    }
    console.log(info);


    res.render('config/edit', {title:'编辑配置项', info : info, error : error});
};

config.update = async function(req, res){
    let result = {};
    let data = check(req, res);
    try {
        result = await configModel.update(data);
    } catch (e) {
        result = {error : '修改失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '修改成功', data : {url : '/console/config/index'}});
    }
};

config.delete = async function(req, res){
    const id = req.body.id;
    let result;
    try {
        result = await configModel.delete(id);
    } catch (e) {
        result = {error : '删除失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '删除成功', data : {url : '/console/config/index'}});
    }
};

let check = function(req, res){
    let data = req.body;
    if (!data.key || data.key == '') {
        res.json({code : 5001, message : '请输入配置键'});
    }
    if (!data.value || data.value == '') {
        res.json({code : 5001, message : '请输入配置值'});
    }
    if (!data.title || data.title == '') {
        res.json({code : 5001, message : '请输入配置名称'});
    }
    if (!data.datatype || data.datatype == '') {
        data.datatype = 'STRING';
    }
    /*
    switch(data.datatype) {
        case 'INT':
            data.value = parseInt(data.value);
            break;
        case 'FLOAT':
            data.value = parseFloat(data.value);
            break;
        case 'JSON':
            data.value = JSON.stringify(data.value);
            break;
        default:
            data.value = data.value.toString();
    }
    */
    return data;
};

config.save = async function(req, res){
    const data = req.body;
    let result;
    try {
        result = await configModel.save(data);
    } catch (e) {
        result = {error : '保存失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '保存成功', data : {url : '/console/config/options'}});
    }
};

module.exports = config;