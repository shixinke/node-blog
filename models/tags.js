const tagsModel = {};
const db = require('../libs/db.js');
const Tags = db.db.define('tags', {
    tag_id:{type : db.Sequelize.INTEGER, primaryKey : true},
    tag_name: db.Sequelize.STRING,
    tag_alias: db.Sequelize.STRING,
    title: db.Sequelize.STRING,
    keywords: db.Sequelize.STRING,
    description: db.Sequelize.STRING,
    style: db.Sequelize.STRING,
    sort: db.Sequelize.INTEGER,
    items: db.Sequelize.INTEGER,
}, {
    tableName:'blog_tags',
    timestamps:false,
    createdAt : false,
    updatedAt : false,
    deletedAt : false
});

tagsModel.tags = Tags;

tagsModel.search = async function(condition, offset, limit){
    const where = {};
    let order = ['tag_id', 'ASC'];
    if (condition.tag_name && condition.tag_name != '') {
        where.tag_name = {$like : '%'+condition.tag_name+'%'};
    }
    if (condition.tag_alias && condition.tag_alias != '') {
        where.tag_alias = {$like : '%'+condition.tag_alias+'%'};
    }

    if (condition.sort && condition.sort != '') {
        order = [$condition.sort, 'DESC']
    }
    return Tags.findAndCountAll({where : where, offset : offset, limit : limit, order : [order]});
};

tagsModel.all = async function(sortby) {
    let sort = [];
    if (sortby) {
        sort = [sortby, 'DESC']
    } else {
        sort = ['sort', 'DESC']
    }
    return Tags.findAll({attributes:['tag_id', 'tag_name', 'tag_alias', 'style', 'items'], order:[sort]});
};

tagsModel.add = async function(data){
    return Tags.create(data);
};

tagsModel.detail = async function(id){
    return await Tags.findById(id);
};

tagsModel.update = async function(data){
    return await Tags.update(data, {where : {tag_id : data.tag_id}});
};

tagsModel.addPostsTags = async function(tags){
    const data = [];
    if (typeof tags == 'string') {
        tags = tags.split(',');
    }
    for (let tag in tags) {
        if (!tags[tag] || tags[tag] == '') {
            continue;
        }
        let res = await Tags.findOne({attributes:['tag_id', 'items'], where:{tag_name:tags[tag]}});
        if (res && res.tag_id) {
            Tags.update({items : parseInt(res.items)+1}, {where : {tag_id : res.tag_id}});
            data.push({tag_id : res.tag_id, tag_name : tags[tag]});
        } else {
            let tagId = Tags.create({tag_name : tags[tag], items: 1});
            data.push({tag_id : tagId, tag_name : tags[tag]});
        }
    }
    return data;
};

tagsModel.delete = async function(id){
    return await Tags.destroy({where : {tag_id : id}});
};

module.exports = tagsModel;