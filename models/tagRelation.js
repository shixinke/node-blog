const tagRelationModel = {};
const db = require('../libs/db.js');
const tagModel = require('./tags.js');
const TagRelation = db.db.define('tags', {
    tag_id: {type : db.Sequelize.INTEGER, primaryKey : true},
    posts_id:{type : db.Sequelize.INTEGER, primaryKey : true}
}, {
    tableName:'blog_tag_relation',
    timestamps:false,
    createdAt : false,
    updatedAt : false,
    deletedAt : false
});

tagRelationModel.search = async function(condition, offset, limit){

};

tagRelationModel.add = async function(postId, tags){
    let data;
    data = await tagModel.addPostsTags(tags);
    if (data) {
        tagRelationModel.delete(postId);
        const datalist = [];
        for(let tag in data) {
            datalist.push({tag_id : data[tag].tag_id, posts_id : parseInt(postId)});
        }
        return TagRelation.bulkCreate(datalist);
    }
    return data;
};

tagRelationModel.delete = async function(postId, tagId){
    const where = {};
    if (postId) {
        where['posts_id'] = postId;
    }
    if (tagId) {
        where['tag_id'] = tagId;
    }
    if (where.length > 0) {
        return await TagRelation.delete({where : where});
    }
};

module.exports = tagRelationModel;