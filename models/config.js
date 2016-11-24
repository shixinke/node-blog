const configModel = {};
const db = require('../libs/db.js');
const helper = require('../libs/helper.js');
const Config = db.db.define('config', {
    key:{type : db.Sequelize.STRING, primaryKey : true},
    value: db.Sequelize.STRING,
    group: db.Sequelize.STRING,
    title: db.Sequelize.STRING,
    datatype: db.Sequelize.STRING
}, {
    tableName:'blog_config',
    timestamps:false,
    createdAt : false,
    updatedAt : false,
    deletedAt : false
});

configModel.config = Config;

configModel.search = async function(condition, offset, limit){
    const where = {};
    if (condition.key && condition.key != '') {
        where.key = {$like : '%'+condition.key+'%'};
    }
    if (condition.group && condition.group != '') {
        where.group = group;
    }
    if (condition.title && condition.title != '') {
        where.title = {$like : '%'+condition.title+'%'};
    }


    return Config.findAndCountAll({where : where, offset : offset, limit : limit});
};

configModel.lists = async function(group){
    const where = {};
    if (group) {
        where['group'] = group;
    }
    const data =  await Config.findAll({where : where});
    const datalist = [];
    if (data) {
        for (let i=0; i< data.length; i++) {
            datalist.push(data[i].dataValues);
        }
    }
    return datalist;
};

configModel.add = async function(data){
    return Config.create(data);
};

configModel.detail = async function(id){
    return await Config.findById(id);
};

configModel.update = async function(data){
    return await Config.update(data, {where : {key : data.key}});
};

configModel.delete = async function(id){
    return await Config.destroy({where : {key : id}});
};

configModel.save = async function(data){
    let result;
    for (let key in data) {
        res = await Config.update({key : key, value : data[key]}, {where : {key : key}});
        if (res) {
            result = res;
        }
    }
    if (result) {
        let data = await configModel.lists();
        const datalist = {};
        for(let i=0; i< data.length;i++) {
            switch(data[i].datatype) {
                case 'INT':
                case 'BOOLEAN':
                    datalist[data[i].key] = parseInt(data[i].value);
                case 'FLOAT':
                    datalist[data[i].key] = parseFloat(data[i].value);
                    break;
                case 'JSON':
                    datalist[data[i].key] = data[i].value.split(',');
                    break;
                default:
                    datalist[data[i].key] = data[i].value.toString();
            }
        }
        helper.resetItem(datalist);
    }
    return result;
};

module.exports = configModel;