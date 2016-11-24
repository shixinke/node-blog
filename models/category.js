const categoryModel = {};
const db = require('../libs/db.js');
const Category = db.db.define('category', {
    category_id:{type : db.Sequelize.INTEGER, primaryKey : true},
    pid : db.Sequelize.INTEGER,
    category_name: db.Sequelize.STRING,
    category_alias: db.Sequelize.STRING,
    title: db.Sequelize.STRING,
    keywords: db.Sequelize.STRING,
    description: db.Sequelize.STRING,
    icon: db.Sequelize.STRING,
    sort:db.Sequelize.INTEGER,
    visible: db.Sequelize.INTEGER,
    status: db.Sequelize.STRING,
    items: db.Sequelize.INTEGER,
    create_time: db.Sequelize.DATE
}, {
    tableName:'blog_category',
    timestamps:true,
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false
});

categoryModel.category = Category;

categoryModel.search = async function(condition, offset, limit){
    const where = {};
    let order = ['category_id', 'ASC'];
    if (condition.category_name && condition.category_name != '') {
        where.category_name = {$like : '%'+condition.category_name+'%'};
    }
    if (condition.category_alias && condition.category_alias != '') {
        where.category_alias = {$like : '%'+condition.category_alias+'%'};
    }
    if (condition.pid && condition.pid != '') {
        where.pid = parseInt(condition.pid);
    }
    if (condition.visible && condition.visible != '') {
        where.visible = parseInt(condition.visible);
    }
    if (condition.status && condition.status != '') {
        where.status = condition.status;
    }
    if (condition.sort && condition.sort != '') {
        order = [$condition.sort, 'DESC']
    }
    return Category.findAndCountAll({where : where, offset : offset, limit : limit, order:[order]});
};

categoryModel.lists = async function(pid){
    let attr;
    attr = pid ? parseInt(pid) : 0;
    return Category.findAll({where:{pid:attr}});
};

categoryModel.all = async function(){
    const data = await Category.findAll({attributes:['category_id', 'pid', 'category_name', 'icon'], where:{status:'ENABLE'}, order:[['sort', 'DESC'], ['pid', 'ASC']]});
    const datalist = [];
    if (data) {
        for(let i=0; i<data.length; i++) {
            datalist[data[i].category_id] = data[i].dataValues;
        };
        datalist.sort(function(a, b){
            if (a.pid == b.pid) {
                return parseInt(b.sort) - parseInt(a.sort);
            } else {
                if (a.pid == 0) {
                    return parseInt(datalist[b.pid].sort) - parseInt(a.sort);
                } else if(b.pid == 0) {
                    return parseInt(b.sort) - parseInt(datalist[a.pid].sort);
                } else {
                    return parseInt(b.sort) - parseInt(a.sort);
                }
            }
        });
    }
    return datalist;
};

categoryModel.add = async function(data){
    return Category.create(data);
};

categoryModel.detail = async function(id){
    return await Category.findById(id);
};

categoryModel.update = async function(data){
    return await Category.update(data, {where : {category_id : data.category_id}});
};

categoryModel.delete = async function(id){
    return await Category.destroy({where : {category_id : id}});
};

module.exports = categoryModel;