const category = {};
const categoryModel = require('../../models/category.js');
const helper = require('../../libs/helper.js');

category.index = async function(req, res){
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
    if (query.pid && query.pid != '') {
        condition.pid = query.pid;
    }
    if (query.category_name && query.category_name != '') {
        condition.category_name = query.category_name.trim();
    }
    if (query.category_alias && query.category_alias != '') {
        condition.category_alias = query.category_alias.trim();
    }
    if (query.visible && query.visible != '') {
        condition.visible = query.visible;
    }
    if (query.sort && query.sort != '') {
        condition.sort = query.sort;
    }
    if (query.status && query.status != '') {
        condition.status = query.status;
    }
    const result = await categoryModel.search(condition, offset, pagesize);
    const categoryList = await categoryModel.lists(0);
    const pageCount = Math.ceil(result.count / pagesize);
    res.render('category/index', {title : '分类管理', condition : condition, data : result, page : {page : page, pagesize : pagesize, pageCount : pageCount, categoryList : categoryList}});
};

category.add = async function(req, res){
    const categoryList = await categoryModel.lists(0);
    res.render('category/add', {title : '添加分类', categoryList : categoryList});
};

category.insert = async function(req, res){
    let result = {};
    let data = req.body;
    if (!data.category_name || data.category_name == '') {
        res.json({code : 5001, message : '请输入分类名称'});
    }
    if (!data.category_alias || data.category_alias == '') {
        data.category_alias = data.category_name;
    }

    try {
        result = await categoryModel.add(data);
    } catch (e) {
        result = {error : '添加失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '添加成功', data : {url : '/console/category/index'}});
    }
};

category.edit = async function(req, res){
    const id = parseInt(req.params.id);
    let error = '';
    let info = {};
    if (!id) {
        error = '非法参数';
    } else {
        try {
            info = await categoryModel.detail(id);
        } catch(e) {
            error = '未查到该分类';
        }

        if (!info.category_id) {
            info = false;
            error = '未查到该分类';
        }
    }

    const categoryList = await categoryModel.lists(0);
    res.render('category/edit', {title:'编辑分类', info : info, error : error, categoryList : categoryList});
};

category.update = async function(req, res){
    let result = {};
    let data = req.body;
    if (!data.category_name || data.category_name == '') {
        res.json({code : 5001, message : '请输入分类名称'});
    }
    if (!data.category_alias || data.category_alias == '') {
        data.category_alias = data.category_name;
    }

    try {
        result = await categoryModel.update(data);
    } catch (e) {
        result = {error : '修改失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '修改成功', data : {url : '/console/category/index'}});
    }
};

category.delete = async function(req, res){
    const id = req.body.id;
    let result;
    try {
        result = await categoryModel.delete(id);
    } catch (e) {
        result = {error : '删除失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '删除成功', data : {url : '/console/category/index'}});
    }
};

module.exports = category;