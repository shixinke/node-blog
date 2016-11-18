const user = {};
const userModel = require('../../models/user.js');
const helper = require('../../libs/helper.js');

user.index = async function(req, res){
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
    if (query.account && query.account != '') {
        condition.account = query.account.trim();
    }
    if (query.nickname && query.nickname != '') {
        condition.nickname = query.nickname.trim();
    }
    if (query.email && query.email != '') {
        condition.email = query.email.trim();
    }
    if (query.status && query.status != '') {
        condition.status = query.status;
    }
    const result = await userModel.search(condition, offset, pagesize);
    const pageCount = Math.ceil(result.count / pagesize);
    res.render('user/index', {title : '用户列表', condition : condition, data : result, page : {page : page, pagesize : pagesize, pageCount : pageCount}});
};

user.add = function(req, res){
    res.render('user/add', {title : '添加用户'});
};

user.insert = async function(req, res){
    let result = {};
    let data = req.body;
    if (!data.account || data.account == '') {
        res.json({code : 5001, message : '请输入账号'});
    }
    if (!data.password || data.password == '') {
        res.json({code : 5001, message : '请输入密码'});
    }
    if (!data.nickname || data.nickname == '') {
        res.json({code : 5001, message : '请输入昵称'});
    }
    if (!data.email || data.email == '') {
        res.json({code : 5001, message : '请输入邮箱'});
    }

    data.password = helper.md5(data.password);
    try {
        result = await userModel.add(data);
    } catch (e) {
        result = {error : '添加失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '添加成功', data : {url : '/console/user/index'}});
    }
};

user.edit = async function(req, res){
    const id = parseInt(req.params.id);
    let error = '';
    let info = {};
    if (!id) {
        error = '非法参数';
    } else {
        try {
            info = await userModel.detail(id);
        } catch(e) {
            error = '未查到该用户';
        }

        if (!info.uid) {
            info = false;
            error = '未查到该用户';
        }
    }


    res.render('user/edit', {info : info, error : error});
};

user.update = async function(req, res){
    let result = {};
    let data = req.body;
    if (!data.account || data.account == '') {
        res.json({code : 5001, message : '请输入账号'});
    }
    if (!data.nickname || data.nickname == '') {
        res.json({code : 5001, message : '请输入昵称'});
    }
    if (!data.email || data.email == '') {
        res.json({code : 5001, message : '请输入邮箱'});
    }

    try {
        result = await userModel.update(data);
    } catch (e) {
        result = {error : '修改失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '修改成功', data : {url : '/console/user/index'}});
    }
};

user.delete = async function(req, res){
    const id = req.body.id;
    let result;
    try {
        result = await userModel.delete(id);
    } catch (e) {
        result = {error : '删除失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '删除成功', data : {url : '/console/user/index'}});
    }
};

module.exports = user;