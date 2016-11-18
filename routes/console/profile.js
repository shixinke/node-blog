const profile = {};
const path = require('path');
const helper = require('../../libs/helper.js');
const userModel = require('../../models/user.js');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: 'public/uploads/images/avatar',
    filename: function (req, file, cb) {
        let fileName = helper.md5(Date.now())+path.extname(file.originalname);
        cb(null, fileName)
    }
});
const upload = multer({storage : storage}).single('file');

profile.index = async function(req, res){
    const uid = req.session.user.uid;
    const userInfo = await userModel.detail(uid);
    res.render('profile/index', {title : '个人资料', info : userInfo});
};

profile.password = async function(req, res){
    const uid = req.session.user.uid;
    const userInfo = await userModel.detail(uid);
    res.render('profile/password', {title : '修改密码', info : userInfo});
};

profile.resetPassword = async function(req, res){
    const uid = req.session.user.uid;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
        res.json({code : 5001, message : '两次输入密码不一致'});
    }
    const data = {};
    data.password = helper.md5(password);
    data.uid = uid;
    let result;
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

profile.resetProfile = async function(req, res){
    const uid = req.session.user.uid;
    const data = req.body;
    data.uid = uid;
    let result;
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

profile.avatar = function(req, res){
    upload(req, res, function(err){
        const filename = req.file.path.replace('public', '');
        const basename = req.file.filename;
        if (err) {
            res.json({code : 5003, message : '上传失败'+err});
        } else {
            res.json({code : 200, message : '上传成功', data:{url : filename, basename : basename}});
        }

    });

};


module.exports = profile;