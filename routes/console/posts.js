const posts = {};
const trimHtml = require('trim-html');
const postsModel = require('../../models/posts.js');
const helper = require('../../libs/helper.js');
const categoryModel = require('../../models/category.js');
const tagModel = require('../../models/tags.js');
const userModel = require('../../models/user.js');

posts.index = async function(req, res){
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
    condition.type = 'POSTS';
    if (query.title && query.title != '') {
        condition.title = query.title.trim();
    }
    if (query.alias && query.alias != '') {
        condition.alias = query.alias.trim();
    }
    if (query.category_id && query.category_id != '') {
        condition.category_id = parseInt(query.category_id);
    }
    if (query.is_top && query.is_top != '') {
        condition.is_top = parseInt(query.is_top);
    }
    if (query.status && query.status != '') {
        condition.status = query.status;
    }
    if (query.uid && query.uid != '') {
        condition.uid = query.uid;
    }
    if (query.tag_id && query.tag_id != '') {
        condition.tag_id = query.tag_id;
    }

    let userList = await userModel.all();
    let categoryList = await categoryModel.all();
    const tagList = await tagModel.all();

    const result = await postsModel.search(condition, offset, pagesize);
    if (result.count > 0) {
        userList = helper.arrayColumn(userList, 'uid');
        categoryList = helper.arrayColumn(categoryList, 'category_id');
        console.log(result.rows);
        for(let i=0; i<result.rows.length; i++) {
            result.rows[i].nickname = userList[result.rows[i].uid] ? userList[result.rows[i].uid].nickname : '未知';
            result.rows[i].category_name = categoryList[result.rows[i].category_id] ? categoryList[result.rows[i].category_id].category_name : '未知';
            result.rows[i].create_time = result.rows[i].create_time.toLocaleString();
        }

    }
    const pageCount = Math.ceil(result.count / pagesize);

    res.render('posts/index', {title : '文章列表', condition : condition, data : result, categoryList: categoryList, userList: userList, tagList : tagList, page : {page : page, pagesize : pagesize, pageCount : pageCount}});
};

posts.add = async function(req, res){
    const userList = await userModel.all();
    const categoryList = await categoryModel.all();
    const tagList = await tagModel.all();
    let tpls = helper.getItem('posts_templates');
    const templates = [];
    if (tpls) {
        tpls = tpls.split(',');
        for (let i=0; i< tpls.length; i++) {
            if (!tpls[i] || tpls[i] == '') {
                continue;
            }
            if (tpls[i] == 'detail') {
                templates.push({template : tpls[i], name : '默认'});
            } else {
                templates.push({template : tpls[i]});
            }
        }
    }
    res.render('posts/add', {title : '添加文章', userList : userList, tagList : tagList, categoryList: categoryList, templates : templates});
};

posts.insert = async function(req, res){
    let result = {};
    let data = check(req, res);

    try {
        result = await postsModel.add(data);
    } catch (e) {
        result = {error : '添加失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '添加成功', data : {url : '/console/posts/index'}});
    }
};

posts.edit = async function(req, res){
    const id = parseInt(req.params.id);
    let error = '';
    let info = {};
    if (!id) {
        error = '非法参数';
    } else {
        try {
            info = await postsModel.detail(id);
        } catch(e) {
            error = '未查到该文章';
        }

        if (!info.uid) {
            info = false;
            error = '未查到该文章';
        }
    }

    const userList = await userModel.all();
    const categoryList = await categoryModel.all();
    const tagList = await tagModel.all();
    let tpls = helper.getItem('posts_templates');
    const templates = [];
    if (tpls) {
        tpls = tpls.split(',');
        for (let i=0; i< tpls.length; i++) {
            if (!tpls[i] || tpls[i] == '') {
                continue;
            }
            if (tpls[i] == 'detail') {
                templates.push({template : tpls[i], name : '默认'});
            } else {
                templates.push({template : tpls[i]});
            }
        }
    }

    res.render('posts/edit', {info : info, error : error, userList : userList, tagList : tagList, categoryList: categoryList, templates: templates});
};

posts.update = async function(req, res){
    let result = {};
    let data = check(req, res);

    try {
        result = await postsModel.update(data);
    } catch (e) {
        result = {error : '修改失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '修改成功', data : {url : '/console/posts/index'}});
    }
};

posts.delete = async function(req, res){
    const id = req.body.id;
    let result;
    try {
        result = await postsModel.delete(id);
    } catch (e) {
        result = {error : '删除失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '删除成功', data : {url : '/console/posts/index'}});
    }
};

var check = function(req, res){
    const data = req.body;
    if (!data.title || data.title == '') {
        res.json({code : 5001, message : '请输入标题'});
    }
    if (!data.content || data.content == '') {
        res.json({code : 5001, message : '请填写内容'});
    }
    if (!data.alias || data.alias == '') {
        data.alias = data.title;
    }
    if (!data.publish_time || data.publish_time == '') {
        data.publish_time = helper.formatTime();
    }
    if (!data.summary || data.summary == '') {
        const summary = trimHtml(data.content, { limit: 200 });
        data.summary = summary.html;
    }

    return data;
};

module.exports = posts;