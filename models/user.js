const userModel = {};
const db = require('../libs/db.js');
const User = db.db.define('user', {
    uid:{type : db.Sequelize.INTEGER, primaryKey : true},
    account: db.Sequelize.STRING,
    password: db.Sequelize.STRING,
    nickname: db.Sequelize.STRING,
    email: db.Sequelize.STRING,
    avatar: db.Sequelize.STRING,
    status: db.Sequelize.STRING,
    last_login_time: db.Sequelize.DATE,
    last_login_ip: db.Sequelize.STRING,
    create_time: db.Sequelize.DATE
}, {
    tableName:'blog_user',
    timestamps:true,
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false
});

userModel.user = User;
userModel.error = '';

userModel.search = async function(condition, offset, limit){
    const where = {};
    if (condition.account && condition.account != '') {
        where.account = condition.account.trim();
    }
    if (condition.nickname && condition.nickname != '') {
        where.nickname = condition.nickname.trim();
    }
    if (condition.email && condition.email != '') {
        where.email = condition.email.trim();
    }
    if (condition.status && condition.status != '') {
        where.status = condition.status;
    }
    return User.findAndCountAll({where : where, offset : offset, limit : limit});
};

userModel.add = async function(data){
    return User.create(data);
};

userModel.detail = async function(id){
    return await User.findById(id);
};

userModel.update = async function(data){
    return await User.update(data, {where : {uid : data.uid}});
};

userModel.delete = async function(id){
    return await User.destroy({where : {uid : id}});
};

userModel.all = async function(){
    const data =  await User.findAll({attributes:['uid', 'account', 'nickname', 'avatar'], where : {status : 'ENABLE'}});
    let datalist = [];
    if (data) {
        for(let i=0; i<data.length; i++) {
            datalist.push(data[i].dataValues);
        }
    }
    return datalist;
};

userModel.checkLogin = async function(account, password){
    let result;
    result = await User.findOne({where:{account:account}});
    if (result && result.uid) {
        if (result.password != password) {
            return {error : '密码不正确', data : false};
        }
        if (result.status != 'ENABLE') {
            return {error : '该账号尚未启用', data : false};
        }
        return {error : null, data : result};
    } else {
        return {error : '该账号不存在', data : false};
    }

};

userModel.register = async function(data){
    return await User.create(data);
};

module.exports = userModel;