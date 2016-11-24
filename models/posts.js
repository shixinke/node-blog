const postsModel = {};
const db = require('../libs/db.js');
const tagRelationModel = require('./tagRelation.js');
const Posts = db.db.define('posts', {
    posts_id:{type : db.Sequelize.INTEGER, primaryKey : true},
    category_id : db.Sequelize.INTEGER,
    type: db.Sequelize.STRING,
    alias: db.Sequelize.STRING,
    title: db.Sequelize.STRING,
    keywords: db.Sequelize.STRING,
    description: db.Sequelize.STRING,
    cover: db.Sequelize.STRING,
    content: db.Sequelize.STRING,
    uid: db.Sequelize.INTEGER,
    tags: db.Sequelize.STRING,
    is_top:db.Sequelize.INTEGER,
    status: db.Sequelize.STRING,
    views: db.Sequelize.INTEGER,
    comments: db.Sequelize.INTEGER,
    template:db.Sequelize.STRING,
    publish_time:db.Sequelize.DATE,
    create_time: db.Sequelize.DATE
}, {
    tableName:'blog_posts',
    timestamps:false,
    createdAt : 'create_time',
    updatedAt : false,
    deletedAt : false
});

postsModel.posts = Posts;

postsModel.search = async function(condition, offset, limit){
    const where = {};
    where.type = 'POSTS';
    if (condition.type && condition.type != '') {
        where.type = condition.type;
    }
    if (condition.title && condition.title != '') {
        where.title = {$like : '%'+condition.title+'%'};
    }
    if (condition.alias && condition.alias != '') {
        where.alias = {$like : '%'+condition.alias+'%'};
    }
    if (condition.category_id && condition.category_id != '') {
        where.category_id = parseInt(condition.category_id);
    }
    if (condition.is_top && condition.is_top != '') {
        where.is_top = parseInt(condition.is_top);
    }
    if (condition.status && condition.status != '') {
        where.status = condition.status;
    }
    if (condition.uid && condition.uid != '') {
        where.uid = condition.uid;
    }
    if (condition.tag_id && condition.tag_id != '') {
        where.tag_id = condition.tag_id;
    }
    return Posts.findAndCountAll({where : where, offset : offset, limit : limit});
};

postsModel.add = async function(data){
    const res = await Posts.create(data);
    if (res && data.tags.length != '') {
        tagRelationModel.add(res, data.tags)
    }
    return res;
};

postsModel.detail = async function(id){
    return await Posts.findById(id);
};

postsModel.update = async function(data){
    const res =  await Posts.update(data, {where : {posts_id : data.posts_id}});
    if (res && data.tags != '') {
        tagRelationModel.add(data.posts_id, data.tags)
    } else {
        tagRelationModel.delete(data.posts_id);
    }
    return res;
};

postsModel.delete = async function(id){
    const res = await Posts.destroy({where : {posts_id : id}});
    if (res) {
        tagRelationModel.delete(id);
    }
    return res;
};

postsModel.stats = async function(){
    const countRes = await Posts.count({attributes:['type'], where : {status:'PUBLIC'}, group:['type']});
    const tops = await Posts.findAll({attributes:['posts_id', 'title', 'alias', 'views'], order:[['views', 'DESC']]});
    const statsRes = await Posts.sum('views');
    const data = {};
    for(let i=0; i< countRes.length; i++) {
        data[countRes[i].type.toLowerCase()] = countRes[i].count;
    }
    data.views = statsRes;
    data.tops = tops;
    return data;
};

module.exports = postsModel;