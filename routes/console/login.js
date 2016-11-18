const login = {};
const userModel = require('../../models/user.js');
const helper = require('../../libs/helper.js');

login.index = function(req, res){
    res.render('login/index', {title : '管理登录', layout : false});
};

login.checkLogin = async function(req, res){
    let account = req.body.account;
    let password = req.body.password;
    let remember = req.body.remember;
    let result = {};
    if (!account || account == '') {
        res.json({code : 5001, message : '请输入账号'});
    }
    if (!password || password == '') {
        res.json({code : 5001, message : '请输入密码'});
    }
    password = helper.md5(password);
    try {
        result = await userModel.checkLogin(account, password);
    } catch (e) {
        result = {error : '未找到数据', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        let userInfo = {};
        userInfo = result.data.dataValues;
        req.session.user = userInfo;
        res.json({code : 200, message : '登录成功', data : {url : '/console/index'}});
    }
};


module.exports = login;