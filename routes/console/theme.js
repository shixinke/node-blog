const theme = {};
const themeModel = require('../../models/config.js');
const helper = require('../../libs/helper.js');
const fs = require('fs');
const unzip = require("unzip");
const path = require('path');
const multer  = require('multer');
const exec = require('child_process').exec;
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const dest = 'tmp/uploads/theme/zip';
        if (!fs.existsSync(dest)) {
            exec('mkdir -p '+dest);
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        let fileName = helper.md5(Date.now())+path.extname(file.originalname);
        cb(null, fileName)
    }
});
const upload = multer({storage : storage}).single('file');


theme.index = async function(req, res){
    const datalist = [];
    const viewPath = 'views/home/';
    let defaultSkin = helper.getItem('default_theme');
    defaultSkin = defaultSkin ? defaultSkin : 'default';
    const dirs = fs.readdirSync(viewPath);
    if (dirs) {
        for (let i=0; i< dirs.length; i++) {
            let confPath = path.join(viewPath, dirs[i], 'config.json');
            if (fs.existsSync(confPath)) {
                let tmp = fs.readFileSync(confPath);
                const data = JSON.parse(tmp);
                data.viewPath = viewPath + dirs[i];
                data.preview = '/static/img/theme/'+dirs[i]+'/'+data.preview;
                data.current = defaultSkin == dirs[i] ? true : false;
                data.name = dirs[i];
                datalist.push(data);
            }
        }
    }
    console.log(datalist);
    res.render('theme/index', {title : '主题管理', datalist : datalist});
};

theme.insert = async function(req, res){
    upload(req, res, function(err){
        if (!req.file) {
            res.json({code : 5003, message : '请选择要上传的文件'});
            return;
        }
        if (err) {
            res.json({code : 5003, message : '上传失败'+err});
            return;
        }
        if (req.file.mimetype != 'application/zip') {
            exec('rm -rf '+req.file.path);
            res.json({code : 5003, message : '上传格式不正确'});
            return;
        }
        const tmpDestPath = 'tmp/uploads/theme/unarchive/';
        if (!fs.existsSync(tmpDestPath)) {
            exec('mkdir -p '+tmpDestPath);
        }
        let defaultSkin = helper.getItem('default_theme');
        defaultSkin = defaultSkin ? defaultSkin : 'default';
        const result = fs.createReadStream(req.file.path).pipe(unzip.Extract({ path: tmpDestPath }));
        result.on('finish', function(){
            fs.readdir(tmpDestPath, function(err, files){
                if (err) {
                    exec('rm -rf tmp/uploads/theme/*');
                    res.json({code : 5003, message : '目录读取出错'});
                    return;
                }
                if (files.length > 0) {
                    const dirs = fs.readdirSync(path.join(tmpDestPath, files[0]));
                    if (!helper.inArray('config.json', dirs)) {
                        exec('rm -rf tmp/uploads/theme/*');
                        res.json({code : 5003, message : '缺少配置文件'});
                        return;
                    }

                    if (files[0] == defaultSkin) {
                        exec('rm -rf tmp/uploads/theme/*');
                        res.json({code : 5003, message : '文件夹名称不能为'+defaultSkin});
                        return;
                    }

                    const viewDirs = fs.readdirSync('views/home/');
                    if (helper.inArray(files[0], viewDirs)) {
                        exec('rm -rf tmp/uploads/theme/*');
                        res.json({code : 5003, message : '文件夹名称与现有模板文件名有冲突'});
                        return;
                    }

                    fs.readFile(path.join(tmpDestPath, files[0], 'config.json'), function(err, data){
                        if (err) {
                            exec('rm -rf tmp/uploads/theme/*');
                            res.json({code : 5003, message : '配置文件读取失败'});
                            return;
                        }
                        if(!fs.existsSync(path.join('public/static/img/theme/', files[0]))) {
                            fs.mkdirSync('public/static/img/theme/'+files[0]);
                        }
                        const confJson = JSON.parse(data.toString());
                        if (confJson && confJson.preview) {
                            const previewFile = path.join(tmpDestPath, files[0], confJson.preview);
                            console.log(previewFile);
                            if (!fs.existsSync(previewFile)) {
                                res.json({code : 5003, message : '预览文件不存在'});
                                return;
                            }
                            const cmd = 'mv '+previewFile+' public/static/img/theme/'+files[0]+'/'+confJson.preview;
                            exec(cmd, function(err){
                                if (err) {
                                    exec('rm -rf tmp/uploads/theme/*');
                                    res.json({code : 5003, message : '预览文件移动失败'});
                                    return;
                                }
                                exec('mv '+path.join(tmpDestPath, files[0])+' views/home/', function(err){
                                    if (err) {
                                        res.json({code : 5003, message : '模板文件移动失败'});
                                        return;
                                    }
                                    exec('rm -rf tmp/uploads/theme/*');
                                    res.json({code : 200, message : '上传成功', data: {url : '/console/theme/index'}});
                                });
                            });

                        } else {
                            exec('rm -rf tmp/uploads/theme/*');
                            res.json({code : 5003, message : '配置文件格式有误'});
                            return;
                        }

                    });

                } else {
                    exec('rm -rf tmp/uploads/theme/*', function(err, out){
                        if (err) {
                            res.json({code : 5003, message : err});
                        }
                        res.json({code : 5003, message : '目录读取失败'});
                    });

                }
            });
        });


    });
};

theme.update = async function(req, res){
    let result = {};
    let id = req.body.id;
    try {
        result = await themeModel.update({key : 'default_theme', value : id});
    } catch (e) {
        result = {error : '修改失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '修改成功', data : {url : '/console/theme/index'}});
    }
};



theme.delete = async function(req, res){
    const id = req.body.id;
    let result;
    try {
        result = await themeModel.delete(id);
    } catch (e) {
        result = {error : '删除失败', data : false};
    }
    if (result.error) {
        res.json({code : 5003, message : result.error});
    } else {
        res.json({code : 200, message : '删除成功', data : {url : '/console/theme/index'}});
    }
};

module.exports = theme;