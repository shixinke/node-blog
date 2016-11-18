const register = {};
const userModel = require('../../models/user.js');
const helper = require('../../libs/helper.js');

register.index = function(req, res){
    res.render('register/index', {title : '管理账号申请', layout:false});
};

register.register = async function(req, res){
    let account = req.body.account;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let email = req.body.email;
    let result = {};
    if (!account || account == '') {
        res.json({code : 5001, message : '请输入账号'});
    }
    if (!password || password == '') {
        res.json({code : 5001, message : '请输入密码'});
    }
    if (!confirmPassword || password != confirmPassword) {
        res.json({code : 5001, message : '两次输入密码不一致'});
    }
    if (!email || email == '') {
        res.json({code : 5001, message : '请输入邮箱'});
    }
    password = helper.md5(password);
    try {
        result = await userModel.register({account : account, password : password, email : email, nickname : account});
    } catch (e) {
        result = {error : '申请失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '申请成功', data: {url : '/console/login'}});
    }
};


module.exports = register;