const tags = {};
const tagsModel = require('../../models/tags.js');
const helper = require('../../libs/helper.js');

tags.index = async function(req, res){
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
    if (query.tag_name && query.tag_name != '') {
        condition.tag_name = query.tag_name.trim();
    }
    if (query.tag_alias && query.tag_alias != '') {
        condition.tag_alias = query.tag_alias.trim();
    }
    if (query.sort && query.sort != '') {
        condition.sort = query.sort.trim();
    }

    const result = await tagsModel.search(condition, offset, pagesize);
    const pageCount = Math.ceil(result.count / pagesize);
    res.render('tags/index', {title : '标签列表', condition : condition, data : result, page : {page : page, pagesize : pagesize, pageCount : pageCount}});
};

tags.add = function(req, res){
    res.render('tags/add', {title : '添加标签'});
};

tags.insert = async function(req, res){
    let result = {};
    let data = req.body;
    if (!data.tag_name || data.tag_name == '') {
        res.json({code : 5001, message : '请输入标签名称'});
    }
    if (!data.tag_alias || data.tag_alias == '') {
        data.tag_alias = data.tag_name;
    }
    data.style = {};
    if (data.background && data.background != '') {
        data.style.background = data.background;
    }
    if (data.text && data.text != '') {
        data.style.text = data.text;
    }
    data.style = JSON.stringify(data.style);

    try {
        result = await tagsModel.add(data);
    } catch (e) {
        result = {error : '添加失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '添加成功', data : {url : '/console/tags/index'}});
    }
};

tags.edit = async function(req, res){
    const id = parseInt(req.params.id);
    let error = '';
    let info = {};
    if (!id) {
        error = '非法参数';
    } else {
        try {
            info = await tagsModel.detail(id);
            if (info && info.style) {
                info.style = JSON.parse(info.style);
            }
        } catch(e) {
            error = '未查到该标签';
        }

        if (!info.tag_id) {
            info = false;
            error = '未查到该标签';
        }
    }


    res.render('tags/edit', {info : info, error : error});
};

tags.update = async function(req, res){
    let result = {};
    let data = req.body;
    if (!data.tag_name || data.tag_name == '') {
        res.json({code : 5001, message : '请输入标签名称'});
    }
    if (!data.tag_alias || data.tag_alias == '') {
        data.tag_alias = data.tag_name;
    }

    data.style = {};
    if (data.background && data.background != '') {
        data.style.background = data.background;
    }
    if (data.text && data.text != '') {
        data.style.text = data.text;
    }
    data.style = JSON.stringify(data.style);

    try {
        result = await tagsModel.update(data);
    } catch (e) {
        result = {error : '修改失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '修改成功', data : {url : '/console/tags/index'}});
    }
};

tags.delete = async function(req, res){
    const id = req.body.id;
    let result;
    try {
        result = await tagsModel.delete(id);
    } catch (e) {
        result = {error : '删除失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '删除成功', data : {url : '/console/tags/index'}});
    }
};

module.exports = tags;